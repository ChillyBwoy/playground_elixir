import { Channel, Socket } from "phoenix";

import { CanvasRenderer } from "../lib/canvas/renderer";
import { CanvasSettingsForm } from "../lib/canvas/settings_form";
import throttle from "lodash.throttle";
import Konva from "konva";
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
const MOVE_THROTTLE = 200;

export function canvasHook(socket: Socket) {
  let channel: Channel;
  let renderer: CanvasRenderer;
  let form: CanvasSettingsForm;

  function init(this: LiveViewHook, { user }: Props) {
    renderer = new CanvasRenderer("canvas", {
      gridSize: 50,
      gridColor: "rgba(0, 0, 0, 0.1)",
      bgColor: "#fff",
      width: 3000,
      height: 3000,
    });

    const handleStageMove = throttle(
      (_evt: Konva.KonvaEventObject<PointerEvent>) => {
        var pos = renderer.stage.getRelativePointerPosition();
        // channel.push("user:move", {
        //   user_id: user.id,
        //   x: pos.x,
        //   y: pos.y,
        // });
      },
      MOVE_THROTTLE
    );
    renderer.stage.on("pointermove", handleStageMove);

    form = new CanvasSettingsForm(
      document.getElementById("canvas_settings_form") as HTMLFormElement,
      (settings) => {
        renderer.toggleDraggable(settings.mode === "move");
        renderer.toggleScale(settings.mode === "move");
        this.el.style.cursor = settings.mode === "move" ? "move" : "crosshair";
      }
    );

    channel.on("user:move", ({ user_id, x, y }: EventUserMoveResponse) => {
      if (user_id === user.id) {
        return;
      }

      console.log(user_id, x, y);
    });

    renderer.render();
  }

  return {
    disconnected(): void {
      renderer.stage.off("pointermove");
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
