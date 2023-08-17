import Konva from "konva";

interface CanvasGridOptions {
  gridSize: number;
  gridColor: string;
}

export class CanvasGrid {
  constructor(
    private stage: Konva.Stage,
    private gridLayer: Konva.Layer,
    private options: CanvasGridOptions
  ) {}

  private normalize(val: number) {
    return val / this.stage.scaleX();
  }

  render() {
    const { gridSize, gridColor } = this.options;
    const width = this.stage.width();
    const height = this.stage.height();
    const position = this.stage.position();

    this.gridLayer.clear();
    this.gridLayer.destroyChildren();
    this.gridLayer.clipWidth(0);

    const stageRect = {
      x1: 0,
      y1: 0,
      x2: width,
      y2: height,
      offset: {
        x: this.normalize(position.x),
        y: this.normalize(position.y),
      },
    };

    const gridOffset = {
      x: Math.ceil(this.normalize(position.x) / gridSize) * gridSize,
      y: Math.ceil(this.normalize(position.y) / gridSize) * gridSize,
    };

    const gridRect = {
      x1: -gridOffset.x,
      y1: -gridOffset.y,
      x2: this.normalize(width) - gridOffset.x + gridSize,
      y2: this.normalize(height) - gridOffset.y + gridSize,
    };

    const fullRect = {
      x1: Math.min(stageRect.x1, gridRect.x1),
      y1: Math.min(stageRect.y1, gridRect.y1),
      x2: Math.max(stageRect.x2, gridRect.x2),
      y2: Math.max(stageRect.y2, gridRect.y2),
    };

    const xSize = fullRect.x2 - fullRect.x1 - gridSize;
    const ySize = fullRect.y2 - fullRect.y1 - gridSize;

    const xSteps = Math.floor(xSize / gridSize);
    const ySteps = Math.floor(ySize / gridSize);

    for (let i = 0; i <= xSteps; i++) {
      const line = new Konva.Line({
        x: fullRect.x1 + i * gridSize,
        y: fullRect.y1,
        points: [0, 0, 0, ySize],
        stroke: gridColor,
        strokeWidth: 1,
      });
      this.gridLayer.add(line);
    }

    for (let i = 0; i <= ySteps; i++) {
      const line = new Konva.Line({
        x: fullRect.x1,
        y: fullRect.y1 + i * gridSize,
        points: [0, 0, xSize, 0],
        stroke: gridColor,
        strokeWidth: 1,
      });
      this.gridLayer.add(line);
    }

    this.gridLayer.batchDraw();
  }
}