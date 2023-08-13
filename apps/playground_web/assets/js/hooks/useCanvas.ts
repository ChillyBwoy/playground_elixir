import React from "react";

type Draw = (ctx: CanvasRenderingContext2D, frame: number) => void;

export function useCanvas(draw: Draw) {
  const ref = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    if (!ref.current) {
      return;
    }

    const context = ref.current.getContext("2d");
    if (!context) {
      return;
    }

    let frame = 0;
    let animationFrameId: number | null = null;

    const render = () => {
      frame += 1;
      context.fillStyle = "#fff";
      context.fillRect(0, 0, context.canvas.width, context.canvas.height);
      draw(context, frame);
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
