import { Channel, Socket } from "phoenix";

import { CanvasRenderer } from "../lib/canvas/renderer";
import { CanvasSettingsForm } from "../lib/canvas/settings_form";
import { LiveViewHook } from "../lib/PhoenixLiveHook";

export class CanvasHook extends LiveViewHook {
  private channel: Channel | null = null;
  private socket: Socket | null = null;

  mounted() {
    const roomId = this.el.dataset.roomId;
    const userToken = this.el.dataset.userToken;

    if (!roomId || !userToken) {
      return;
    }

    this.socket = new Socket("/socket", { params: { token: userToken } });
    this.socket.connect();

    this.channel = this.socket.channel(`canvas:${roomId}`, {});

    this.channel.on("presence_state", (state) => {
      console.log(":: handle presence_state ::", state);
    });

    this.channel
      .join()
      .receive("ok", (resp) => {
        console.log("Joined successfully", resp);
      })
      .receive("error", (resp) => {
        console.log("Unable to join", resp);
      });

    const renderer = new CanvasRenderer("canvas", {
      gridSize: 50,
      gridColor: "rgba(0, 0, 0, 0.1)",
      bgColor: "#fff",
      width: 3000,
      height: 3000,
    });

    new CanvasSettingsForm(
      document.getElementById("canvas_settings_form") as HTMLFormElement,
      (settings) => {
        renderer.toggleDraggable(settings.mode === "move");
        renderer.toggleScale(settings.mode === "move");
        this.el.style.cursor = settings.mode === "move" ? "move" : "crosshair";
      }
    );

    renderer.render();
  }

  disconnected(): void {
    this.channel?.off("presence_state");
    this.channel?.leave();
    this.channel = null;

    this.socket?.disconnect();
    this.socket = null;
  }
}
