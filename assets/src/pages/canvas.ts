import Konva from "konva";
import type { Dot } from "../lib/store/dots";
import { withSocket } from "../lib/withSocket";
import { CanvasRenderer } from "../lib/canvas/renderer";
import { randomRGB } from "../lib/color";

const { channel } = withSocket("/socket");

interface DotCreatePayload {
  dot: Dot;
}

const renderer = new CanvasRenderer("canvas", {
  gridSize: 50,
  gridColor: "rgba(0, 0, 0, 0.1)",
  bgColor: "#fff",
  onClick: (_evt, stage) => {
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
