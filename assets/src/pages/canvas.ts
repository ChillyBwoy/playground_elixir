import Konva from "konva";

import type { Dot } from "../lib/store/dots";
import { withSocket } from "../lib/withSocket";
import { renderGrid } from "../lib/canvas";
import { range } from "../lib/range";
import { randomRGB } from "../lib/color";

const { channel } = withSocket("/socket");

interface DotCreatePayload {
  dot: Dot;
}

const stage = new Konva.Stage({
  container: "canvas",
  width: 3000,
  height: 3000,
  draggable: true,
});

const backgroundLayer = new Konva.Layer();
const gridLayer = new Konva.Layer();
const drawLayer = new Konva.Layer();

backgroundLayer.add(
  new Konva.Rect({
    x: 0,
    y: 0,
    width: stage.width(),
    height: stage.height(),
    fill: "white",
  })
);

stage.add(backgroundLayer);
stage.add(gridLayer);
stage.add(drawLayer);

backgroundLayer.draw();
drawLayer.draw();

function render() {
  renderGrid(stage, gridLayer);
}

let scales = range(0.5, 5, 0.25);
let currentScale = 1;

stage.scale({ x: currentScale, y: currentScale });

render();

stage.on("wheel", (event) => {
  event.evt.preventDefault();

  const oldScale = stage.scaleX();
  const pointer = stage.getPointerPosition()!;

  const mousePointTo = {
    x: (pointer.x - stage.x()) / oldScale,
    y: (pointer.y - stage.y()) / oldScale,
  };

  let direction = event.evt.deltaY > 0 ? -1 : 1;
  if (event.evt.ctrlKey) {
    direction = -direction;
  }

  if (direction > 0) {
    currentScale = currentScale > 0 ? currentScale - 1 : currentScale;
  } else {
    currentScale =
      currentScale < scales.length - 1 ? currentScale + 1 : currentScale;
  }

  const newScale = scales[currentScale];
  stage.scale({ x: newScale, y: newScale });

  const newPos = {
    x: pointer.x - mousePointTo.x * newScale,
    y: pointer.y - mousePointTo.y * newScale,
  };
  stage.position(newPos);
  stage.draw();
});

stage.on("click", () => {
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
});

channel.on("dot:created", (data: DotCreatePayload) => {
  const { dot } = data;

  const circle = new Konva.Circle({
    x: dot.x,
    y: dot.y,
    radius: 10,
    fill: dot.color,
  });

  drawLayer.add(circle);
});
