import styled from 'styled-components';
import React from "react";

import { dotsStore } from '../store/dots'

const Root = styled.div`
  position: relative;
`

const StyledCanvas = styled.canvas``;

interface CanvasProps {
  width: number;
  height: number;
}

type Draw = (ctx: CanvasRenderingContext2D, frame: number) => void;

function useCanvas(draw: Draw) {
  const ref = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    if (!ref.current) {
      return
    }

    const context = ref.current.getContext('2d')
    if (!context) {
      return
    }

    let frame = 0;
    let animationFrameId: number | null = null;

    const render = () => {
      frame += 1;
      context.fillStyle = '#fff'
      context.fillRect(0, 0, context.canvas.width, context.canvas.height)
      draw(context, frame)
      animationFrameId = window.requestAnimationFrame(render)
    }

    render();

    return () => {
      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId)
      }
    }

  }, [draw]);

  return ref;
}

function useRandomColor() {
  return React.useMemo(() => {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);

    return `rgba(${r}, ${g}, ${b}, 1)`
  }, [])
}

const Canvas: React.FC<CanvasProps> = ({ width, height }) => {
  const color = useRandomColor();

  const handleClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    dotsStore.add({ x: event.clientX, y: event.clientY, owner: 'me', color })
  }

  const dots = React.useSyncExternalStore(dotsStore.subscribe, dotsStore.getSnapshot);

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
      <StyledCanvas ref={ref} width={width} height={height} onClick={handleClick} />
    </Root>
  );
};

export default Canvas;
