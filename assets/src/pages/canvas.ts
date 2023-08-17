import Konva from "konva";
import type { Dot } from "../lib/store/dots";
import { withSocket } from "../lib/withSocket";
import { CanvasRenderer } from "../lib/canvas/renderer";
import { randomRGB } from "../lib/color";

const { channel } = withSocket("/socket");

interface SceneSettings {
  mode: "draw" | "move";
}

const $form = document.getElementById("canvas_settings_form")!;
const _sceneSettings: SceneSettings = {
  mode: "move",
};

const renderer = new CanvasRenderer("canvas", {
  gridSize: 50,
  gridColor: "rgba(0, 0, 0, 0.1)",
  bgColor: "#fff",
  onClick: (_evt, stage) => {
    if (_sceneSettings.mode !== "draw") {
      return;
    }
    const pointer = stage.getPointerPosition()!;
    const scale = stage.scaleX();
    const x = (pointer.x - stage.x()) / scale;
    const y = (pointer.y - stage.y()) / scale;
    const dot: Omit<Dot, "id"> = {
      owner: "me",
      color: randomRGB(),
      x,
      y,
    };
    channel.push("dot:create", { dot });
  },
});

let sceneSettings = new Proxy(_sceneSettings, {
  set(target, prop: keyof SceneSettings, value) {
    target[prop] = value;
    renderer.toggleDraggable(value === "move");
    return true;
  },
});

$form.addEventListener("change", (evt) => {
  const data = new FormData(evt.currentTarget as HTMLFormElement);
  const canvasMode = data.get("mode") as SceneSettings["mode"];

  sceneSettings.mode = canvasMode;
});

interface DotCreatePayload {
  dot: Dot;
}
renderer.render();

channel.on("dot:created", (data: DotCreatePayload) => {
  const { dot } = data;

  const circle = new Konva.Circle({
    x: dot.x,
    y: dot.y,
    radius: 10,
    fill: dot.color,
  });

  renderer.drawLayer.add(circle);
});
