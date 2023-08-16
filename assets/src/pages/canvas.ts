import { DotsStore } from "../lib/store/dots";
import type { Dot } from "../lib/store/dots";
import { randomRGB } from "../lib/color";
import { withCanvas } from "../lib/withCanvas";
import { withSocket } from "../lib/withSocket";

const dotsStore = new DotsStore();

interface DotCreatePayload {
  dot: Dot;
}

export function renderGrid(
  ctx: CanvasRenderingContext2D,
  _frame: number,
  size: number
) {
  const { width, height } = ctx.canvas;

  ctx.strokeStyle = "#000";
  ctx.lineWidth = 0.5;
  ctx.beginPath();

  for (let x = size; x <= width - size; x += size) {
    ctx.moveTo(x, size);
    ctx.lineTo(x, height - size);
  }

  for (let y = size; y <= height - size; y += size) {
    ctx.moveTo(size, y);
    ctx.lineTo(width - size, y);
  }

  ctx.stroke();
}

export function renderDots(
  ctx: CanvasRenderingContext2D,
  frame: number,
  dots: Array<Dot>
) {
  for (const dot of dots) {
    renderDot(ctx, frame, dot);
  }
}

export function renderDot(
  ctx: CanvasRenderingContext2D,
  frame: number,
  dot: Dot
) {
  ctx.fillStyle = dot.color;
  ctx.beginPath();
  ctx.arc(dot.x, dot.y, 10 * Math.sin(frame * 0.05) ** 2, 0, 2 * Math.PI);
  ctx.fill();
}

const { channel } = withSocket("/socket");

channel.on("dot:created", (payload: DotCreatePayload) => {
  dotsStore.add(payload.dot);
});

const $canvas = document.getElementById("canvas") as HTMLCanvasElement;

$canvas.addEventListener("click", (event) => {
  const { left, top } = (
    event.currentTarget as HTMLCanvasElement
  ).getBoundingClientRect();

  const dot: Omit<Dot, "id"> = {
    x: event.clientX - left,
    y: event.clientY - top,
    owner: "me",
    color: randomRGB(),
  };

  channel.push("dot:create", { dot });
});

withCanvas($canvas, (ctx, frame) => {
  renderGrid(ctx, frame, 20);
  renderDots(ctx, frame, dotsStore.getSnapshot());
});
