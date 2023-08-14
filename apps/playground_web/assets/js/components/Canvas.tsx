import styled from 'styled-components';
import React from "react";

import { dotsStore } from "../store/dots";
import { useCanvas } from "../hooks/useCanvas";
import { useRandomColor } from '../hooks/useRandomColor';
import { useSocket } from '../hooks/useSocket';

const Root = styled.div`
  position: relative;
`

interface CanvasProps {
  width: number;
  height: number;
}

const Canvas: React.FC<CanvasProps> = ({ width, height }) => {
  const color = useRandomColor();
  const { socket, channel } = useSocket("room:lobby");

  const dots = React.useSyncExternalStore(dotsStore.subscribe, dotsStore.getSnapshot);

  React.useEffect(() => {
    channel.on("dot:created", (payload) => {
      console.log(payload);
    });
  }, [])

  const handleClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    console.log(event)
    const newDot = dotsStore.add({ x: event.clientX, y: event.clientY, owner: 'me', color });
    channel.push("dot:create", { dot: newDot })
  }

  const ref = useCanvas((ctx, frame) => {
    for (const dot of dots) {
      ctx.fillStyle = dot.color;
      ctx.beginPath();
      ctx.arc(dot.x, dot.y, 10 * Math.sin(frame * 0.05) ** 2, 0, 2 * Math.PI)
      ctx.fill();
    }
  });

  return (
    <Root>
      <canvas ref={ref} width={width} height={height} onClick={handleClick} />
    </Root>
  );
};

export default Canvas;
