import Konva from "konva";
import { Channel, Socket } from "phoenix";

import {
  CanvasBackground,
  CanvasDraw,
  CanvasGrid,
  CanvasStage,
  CanvasScale,
  CanvasSelectTransform,
  CanvasSettingsForm,
  CanvasUsers,
} from "../lib/canvas";
import { PresenceStore } from "../lib/store/presence";
import { strToColor } from "../lib/color";
import type { Canvas, LiveViewHook, Presence, User, Shape } from "../types/app";
import type { CanvasLayer } from "../lib/canvas/CanvasBase";
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
  let layers: Array<CanvasLayer> = [];

  const presenceStore = new PresenceStore();
  const users = new Map<string, Konva.Image>();

  function init(this: LiveViewHook, { user, canvas }: Props) {
    console.log(canvas);

    const form = new CanvasSettingsForm(`${canvas.id}_form`);

    const stage = new CanvasStage(`${canvas.id}_canvas`, {
      gridSize: 50,
      gridColor: "rgba(0, 0, 0, 0.1)",
      bgColor: "#fff",
      width: 3000,
      height: 3000,
    });

    const scaleLayer = new CanvasScale(stage.stage);
    const backgroundLayer = new CanvasBackground(stage.stage, {
      bgColor: stage.options.bgColor,
    });

    const drawLayer = new CanvasDraw(stage.stage, {
      onDrawEnd(data) {
        channel.push(EVENTS.USER_DRAW_END, { user_id: user.id, data });
      },
    });
    const selectLayer = new CanvasSelectTransform(stage.stage);
    const gridLayer = new CanvasGrid(stage.stage, {
      gridSize: stage.options.gridSize,
      gridColor: stage.options.gridColor,
    });
    const usersLayer = new CanvasUsers(stage.stage, {
      onMove(x, y) {
        if (users.size > 0) {
          channel.push(EVENTS.USER_MOVE, { user_id: user.id, x, y });
        }
      },
    });

    layers.push(
      scaleLayer,
      backgroundLayer,
      drawLayer,
      selectLayer,
      gridLayer,
      usersLayer
    );

    form.subscribe(stage);
    form.subscribe(scaleLayer);
    form.subscribe(drawLayer);
    form.subscribe(selectLayer);
    form.subscribe(gridLayer);

    for (const layer of layers) {
      layer.draw();
    }

    for (const shape of canvas.shapes) {
      const shapeConfig = transformKeys(shape.shape_data, toCamelCase);
      drawLayer.drawLine(shapeConfig);
    }

    const handlePresenceChange = (presenceMap: Map<string, Presence>) => {
      for (const key of users.keys()) {
        if (!presenceMap.has(key)) {
          const avatar = users.get(key);
          if (avatar) {
            usersLayer.removeUserAvatar(avatar);
            users.delete(key);
          }
        }
      }

      for (const [key, presence] of presenceMap.entries()) {
        if (presence.user.id === user.id) {
          continue;
        }

        if (!users.has(key)) {
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
          users.set(key, image);
        }
      }
    };

    presenceStore.subscribe(handlePresenceChange);

    channel.on(EVENTS.USER_MOVE, ({ user_id, x, y }: UserMoveResponse) => {
      if (user_id === user.id) {
        return;
      }

      const avatar = users.get(user_id);
      if (!avatar) {
        return;
      }
      avatar.x(x);
      avatar.y(y);
    });

    channel.on(EVENTS.USER_DRAW_END, (shape: Shape) => {
      const shapeConfig = transformKeys(shape.shape_data, toCamelCase);
      drawLayer.drawLine({
        ...shapeConfig,
        id: shape.id,
      });
    });

    channel.on(EVENTS.PRESENCE_STATE, (presence: Record<string, Presence>) => {
      presenceStore.update(presence);
    });
  }

  return {
    destroyed() {
      console.log(`disconecting canvas:${this.el.dataset.canvasId}`);

      for (const layer of layers) {
        layer.destroy();
      }

      channel.off(EVENTS.PRESENCE_STATE);
      channel.leave();
    },
    mounted() {
      layers = [];
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
