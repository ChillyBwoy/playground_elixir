import React from "react";

import { dotsStore } from "../../store/dots";
import { useCanvas } from "../../hooks/useCanvas";
import { useRandomColor } from "../../hooks/useRandomColor";
import { useSocket } from "../../hooks/useSocket";

import { renderDots, renderGrid } from "./Canvas.tools";
import { Dot, DotInstance } from "../../store/dots/types";

interface CanvasProps {
  width: number;
  height: number;
}

interface DotCreatePayload {
  dot: DotInstance;
}

export const Canvas: React.FC<CanvasProps> = ({ width, height }) => {
  const color = useRandomColor();

  const dots = React.useSyncExternalStore(
    dotsStore.subscribe,
    dotsStore.getSnapshot
  );

  const { channel } = useSocket((channel) => {
    channel.on("dot:created", (payload: DotCreatePayload) => {
      dotsStore.add(payload.dot);
    });
  });

  const handleClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const { left, top } = event.currentTarget.getBoundingClientRect();

    const dot: Dot = {
      x: event.clientX - left,
      y: event.clientY - top,
      owner: "me",
      color,
    };

    channel.push("dot:create", { dot });
  };

  const draw = React.useCallback(
    (ctx: CanvasRenderingContext2D, frame: number) => {
      renderGrid(ctx, frame, 20);
      renderDots(ctx, frame, dots);
    },
    [dots]
  );

  const ref = useCanvas(draw);

  return (
    <canvas ref={ref} width={width} height={height} onClick={handleClick} />
  );
};
