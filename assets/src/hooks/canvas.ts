import Konva from "konva";
import { Channel, Socket } from "phoenix";

import {
  CanvasBackground,
  CanvasDraw,
  CanvasGrid,
  CanvasRenderer,
  CanvasScale,
  CanvasSettingsForm,
  CanvasUsers,
} from "../lib/canvas";
import type { Canvas, LiveViewHook, User } from "../types/app";

interface CanvasJoinResponse {
  current_user: User;
  canvas: Canvas;
}

interface UserMoveResponse {
  user_id: string;
  x: number;
  y: number;
}

interface UserDrawEndResponse {
  user_id: string;
  data: Konva.LineConfig;
}

interface State {
  users: Record<string, User>;
}

interface Props {
  user: User;
  canvas: Canvas;
}

const EVENTS = {
  USER_MOVE: "user:move",
  USER_DRAW: "user:draw",
  USER_DRAW_END: "user:draw_end",
  PRESENCE_STATE: "presence_state",
} as const;

function ref<T extends {}>(initialValue: T) {
  let data = { ...initialValue };

  let proxy = new Proxy(data, {
    set(target, prop: string | symbol, value) {
      target[prop as keyof T] = value;
      return true;
    },
  });

  return proxy;
}

export function canvasHook(socket: Socket) {
  const state: State = ref({
    users: {},
  });

  let channel: Channel;

  function init(this: LiveViewHook, { user, canvas }: Props) {
    const form = new CanvasSettingsForm(`${canvas.id}_form`);

    const renderer = new CanvasRenderer(`${canvas.id}_canvas`, {
      gridSize: 50,
      gridColor: "rgba(0, 0, 0, 0.1)",
      bgColor: "#fff",
      width: 3000,
      height: 3000,
    });

    const scaleLayer = new CanvasScale(renderer.stage);
    const backgroundLayer = new CanvasBackground(renderer.stage, {
      bgColor: renderer.options.bgColor,
    });

    const drawLayer = new CanvasDraw(renderer.stage, {
      onDraw(data) {
        channel.push(EVENTS.USER_DRAW, { user_id: user.id, data });
      },
      onDrawEnd(data) {
        channel.push(EVENTS.USER_DRAW_END, { user_id: user.id, data });
      },
    });
    const gridLayer = new CanvasGrid(renderer.stage, {
      gridSize: renderer.options.gridSize,
      gridColor: renderer.options.gridColor,
    });
    const usersLayer = new CanvasUsers(renderer.stage, {
      onMove(x, y) {
        // channel.push(EVENTS.USER_MOVE, { user_id: user.id, x, y });
      },
    });

    form.subscribe(renderer);
    form.subscribe(scaleLayer);
    form.subscribe(drawLayer);
    form.subscribe(gridLayer);

    renderer.addLayer(scaleLayer);
    renderer.addLayer(backgroundLayer);
    renderer.addLayer(drawLayer);
    renderer.addLayer(gridLayer);
    renderer.addLayer(usersLayer);

    renderer.render();

    channel.on(EVENTS.USER_MOVE, ({ user_id, x, y }: UserMoveResponse) => {
      if (user_id === user.id) {
        return;
      }
    });

    channel.on(EVENTS.USER_DRAW_END, ({ data }: UserDrawEndResponse) => {
      drawLayer.drawLine(data);
    });

    channel.on(EVENTS.PRESENCE_STATE, (presence) => {
      console.log(":: handle presence_state ::", presence);
      // state.users = presence;
    });
  }

  return {
    destroyed() {
      console.log("disconnected");
      channel.off(EVENTS.PRESENCE_STATE);
      channel.leave();
    },
    mounted() {
      channel = socket.channel(`canvas:${this.el.dataset.canvasId}`, {});

      channel
        .join()
        .receive("ok", (resp: CanvasJoinResponse) => {
          init.apply(this, [
            {
              user: resp.current_user,
              canvas: resp.canvas,
            },
          ]);
        })
        .receive("error", (resp) => {
          console.error("Unable to join", resp);
        });
    },
  } as LiveViewHook;
}
