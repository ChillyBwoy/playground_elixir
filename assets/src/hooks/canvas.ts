import Konva from "konva";
import { Channel, Socket } from "phoenix";

import {
  CanvasBackground,
  CanvasDraw,
  CanvasGrid,
  CanvasRenderer,
  CanvasScale,
  CanvasSelectTransform,
  CanvasSettingsForm,
  CanvasUsers,
} from "../lib/canvas";
import { PresenceStore } from "../lib/store/presence";
import { strToColor } from "../lib/color";
import type { Canvas, LiveViewHook, Presence, User } from "../types/app";
import { transformKeys } from "../lib/object";
import { toCamelCase } from "../lib/string";

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
  data: Konva.ShapeConfig;
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

export function canvasHook(socket: Socket) {
  let channel: Channel;
  const presenceStore = new PresenceStore();
  const avatars = new Map<string, Konva.Image>();

  function init(this: LiveViewHook, { user, canvas }: Props) {
    console.log(canvas);

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
      onDrawEnd(data) {
        channel.push(EVENTS.USER_DRAW_END, { user_id: user.id, data });
      },
    });
    const selectLayer = new CanvasSelectTransform(renderer.stage);
    const gridLayer = new CanvasGrid(renderer.stage, {
      gridSize: renderer.options.gridSize,
      gridColor: renderer.options.gridColor,
    });
    const usersLayer = new CanvasUsers(renderer.stage, {
      onMove(x, y) {
        channel.push(EVENTS.USER_MOVE, { user_id: user.id, x, y });
      },
    });

    const handlePresenceChange = (presenceMap: Map<string, Presence>) => {
      for (const key of avatars.keys()) {
        if (!presenceMap.has(key)) {
          const avatar = avatars.get(key);
          if (avatar) {
            usersLayer.removeUserAvatar(avatar);
            avatars.delete(key);
          }
        }
      }

      for (const [key, presence] of presenceMap.entries()) {
        if (presence.user.id === user.id) {
          continue;
        }

        if (!avatars.has(key)) {
          const img = new Image();
          img.src = presence.user.avatar_url;

          const image = new Konva.Image({
            image: img,
            x: 0,
            y: 0,
            width: 32,
            height: 32,
            cornerRadius: 15,
            stroke: strToColor(presence.user.username),
            strokeWidth: 6,
          });

          usersLayer.addUserAvatar(image);
          avatars.set(key, image);
        }
      }
    };

    presenceStore.subscribe(handlePresenceChange);

    form.subscribe(renderer);
    form.subscribe(scaleLayer);
    form.subscribe(drawLayer);
    form.subscribe(selectLayer);
    form.subscribe(gridLayer);

    renderer.addLayer(scaleLayer);
    renderer.addLayer(backgroundLayer);
    renderer.addLayer(drawLayer);
    renderer.addLayer(selectLayer);
    renderer.addLayer(gridLayer);
    renderer.addLayer(usersLayer);

    renderer.render();

    for (const shape of canvas.shapes) {
      const shapeConfig = transformKeys(shape.shape_data, toCamelCase);
      drawLayer.drawShape(shapeConfig);
    }

    channel.on(EVENTS.USER_MOVE, ({ user_id, x, y }: UserMoveResponse) => {
      if (user_id === user.id) {
        return;
      }

      const avatar = avatars.get(user_id);
      if (!avatar) {
        return;
      }
      avatar.x(x);
      avatar.y(y);
    });

    channel.on(EVENTS.USER_DRAW_END, ({ data }: UserDrawEndResponse) => {
      console.log(data);
      drawLayer.drawShape(data);
    });

    channel.on(EVENTS.PRESENCE_STATE, (presence: Record<string, Presence>) => {
      presenceStore.update(presence);
    });
  }

  return {
    destroyed() {
      console.log(`disconecting canvas:${this.el.dataset.canvasId}`);
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
