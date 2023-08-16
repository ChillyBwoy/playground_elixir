import Konva from "konva";

export function unScale(stage: Konva.Stage, val: number) {
  return val / stage.scaleX();
}

export function renderGrid(
  stage: Konva.Stage,
  gridLayer: Konva.Layer,
  stepSize = 50
) {
  const gridColor = "rgba(0, 0, 0, 0.2)";

  gridLayer.clear();
  gridLayer.destroyChildren();
  gridLayer.clipWidth(0);

  const stageRect = {
    x1: 0,
    y1: 0,
    x2: stage.width(),
    y2: stage.height(),
    offset: {
      x: unScale(stage, stage.position().x),
      y: unScale(stage, stage.position().y),
    },
  };

  const gridOffset = {
    x: Math.ceil(unScale(stage, stage.position().x) / stepSize) * stepSize,
    y: Math.ceil(unScale(stage, stage.position().y) / stepSize) * stepSize,
  };

  const gridRect = {
    x1: -gridOffset.x,
    y1: -gridOffset.y,
    x2: unScale(stage, stage.width()) - gridOffset.x + stepSize,
    y2: unScale(stage, stage.height()) - gridOffset.y + stepSize,
  };

  const fullRect = {
    x1: Math.min(stageRect.x1, gridRect.x1),
    y1: Math.min(stageRect.y1, gridRect.y1),
    x2: Math.max(stageRect.x2, gridRect.x2),
    y2: Math.max(stageRect.y2, gridRect.y2),
  };

  const xSize = fullRect.x2 - fullRect.x1 - stepSize;
  const ySize = fullRect.y2 - fullRect.y1 - stepSize;

  const xSteps = Math.floor(xSize / stepSize);
  const ySteps = Math.floor(ySize / stepSize);

  for (let i = 0; i <= xSteps; i++) {
    const line = new Konva.Line({
      x: fullRect.x1 + i * stepSize,
      y: fullRect.y1,
      points: [0, 0, 0, ySize],
      stroke: gridColor,
      strokeWidth: 1,
    });
    gridLayer.add(line);
  }

  for (let i = 0; i <= ySteps; i++) {
    const line = new Konva.Line({
      x: fullRect.x1,
      y: fullRect.y1 + i * stepSize,
      points: [0, 0, xSize, 0],
      stroke: gridColor,
      strokeWidth: 1,
    });
    gridLayer.add(line);
  }

  gridLayer.batchDraw();
}
