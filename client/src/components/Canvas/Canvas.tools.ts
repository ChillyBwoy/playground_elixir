import { Dot } from "../../store/dots/types";

export function renderGrid(
  ctx: CanvasRenderingContext2D,
  frame: number,
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
