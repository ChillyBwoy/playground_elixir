import React from "react";

type Draw = (ctx: CanvasRenderingContext2D, frame: number) => void;

export function useCanvas(draw: Draw) {
  const ref = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const ctx = ref.current?.getContext("2d");
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
  }, [draw]);

  return ref;
}
