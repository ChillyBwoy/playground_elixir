type Draw = (ctx: CanvasRenderingContext2D, frame: number) => void;

export function withCanvas($ref: HTMLCanvasElement, draw: Draw) {
  const ctx = $ref?.getContext("2d");
  if (!ctx) {
    return;
  }

  let frame = 0;
  let animationFrameId: number | null = null;

  const render = () => {
    frame += 1;
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    draw(ctx, frame);
    animationFrameId = window.requestAnimationFrame(render);
  };

  render();

  return () => {
    if (animationFrameId) {
      window.cancelAnimationFrame(animationFrameId);
    }
  };
}
