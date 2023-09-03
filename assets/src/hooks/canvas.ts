import { Socket } from "phoenix";

import { CanvasRenderer } from "../lib/canvas/renderer";
import { CanvasSettingsForm } from "../lib/canvas/settings_form";
import { LiveViewHook } from "../lib/PhoenixLiveHook";

export class CanvasHook extends LiveViewHook {
  mounted() {
    const userToken = this.el.dataset.userToken;
    const roomId = this.el.dataset.roomId;

    if (!userToken || !roomId) {
      return;
    }

    const socket = new Socket("/socket", { params: { token: userToken } });
    socket.connect();

    const channel = socket.channel(`canvas:${roomId}`, {});
    channel
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
}
