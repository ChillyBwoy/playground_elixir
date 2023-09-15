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
import type { LiveViewHook, Room, User } from "../types/app";

interface CanvasJoinResponse {
  current_user: User;
  room: Room;
}

interface EventUserMoveResponse {
  user_id: string;
  x: number;
  y: number;
}

interface Props {
  user: User;
  room: Room;
}

const EVENT_PRESENCE_STATE = "presence_state";

export function canvasHook(socket: Socket) {
  let channel: Channel;

  function init(this: LiveViewHook, { user }: Props) {
    const form = new CanvasSettingsForm("canvas_settings_form");

    const renderer = new CanvasRenderer("canvas", {
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
      onDrawLine(data) {
        console.log(data);
      },
    });
    const gridLayer = new CanvasGrid(renderer.stage, {
      gridSize: renderer.options.gridSize,
      gridColor: renderer.options.gridColor,
    });
    const usersLayer = new CanvasUsers(renderer.stage, {
      onMove(x, y) {
        channel.push("user:move", { user_id: user.id, x, y });
      },
    });

    form.subscribe(renderer);
    form.subscribe(drawLayer);
    form.subscribe(gridLayer);

    renderer.addLayer(scaleLayer);
    renderer.addLayer(backgroundLayer);
    renderer.addLayer(drawLayer);
    renderer.addLayer(gridLayer);
    renderer.addLayer(usersLayer);

    renderer.render();

    channel.on("user:move", ({ user_id, x, y }: EventUserMoveResponse) => {
      if (user_id === user.id) {
        return;
      }
    });
  }

  return {
    disconnected(): void {
      channel.off(EVENT_PRESENCE_STATE);
      channel.leave();
    },
    mounted() {
      channel = socket.channel(`canvas:${this.el.dataset.roomId}`, {});

      channel.on(EVENT_PRESENCE_STATE, (state) => {
        console.log(":: handle presence_state ::", state);
      });

      channel
        .join()
        .receive("ok", (resp: CanvasJoinResponse) => {
          const payload = {
            user: resp.current_user,
            room: resp.room,
          };
          init.apply(this, [payload]);
        })
        .receive("error", (resp) => {
          console.error("Unable to join", resp);
        });
    },
  } as LiveViewHook;
}
