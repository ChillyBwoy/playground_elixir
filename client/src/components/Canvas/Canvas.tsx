import React from "react";

import { dotsStore } from "../../store/dots";
import { useCanvas } from "../../hooks/useCanvas";
import { useRandomColor } from "../../hooks/useRandomColor";
import { useSocket } from "../../hooks/useSocket";

import { renderDot, renderGrid } from "./Canvas.tools";

interface CanvasProps {
  width: number;
  height: number;
}

export const Canvas: React.FC<CanvasProps> = ({ width, height }) => {
  const color = useRandomColor();
  const { channel } = useSocket("room:lobby");

  const dots = React.useSyncExternalStore(dotsStore.subscribe, dotsStore.getSnapshot);

  React.useEffect(() => {
    channel.on("dot:created", (payload) => {
      console.log(payload);
    });
  }, [channel]);

  const handleClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    console.log(event)
    const newDot = dotsStore.add({ x: event.clientX, y: event.clientY, owner: "me", color });
    channel.push("dot:create", { dot: newDot })
  }

  const ref = useCanvas((ctx, frame) => {
    renderGrid(ctx, frame, 50);

    for (const dot of dots) {
      renderDot(ctx, frame, dot);
    }
  });

  return (
    <canvas ref={ref} width={width} height={height} onClick={handleClick} />
  );
};
