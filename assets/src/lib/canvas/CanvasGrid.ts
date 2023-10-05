import Konva from "konva";
import type {
  CanvasLayer,
  CanvasSettings,
  CanvasSettingsReceiver,
} from "./CanvasBase";

interface CanvasGridOptions {
  gridSize: number;
  gridColor: string;
  width: number;
  height: number;
}

export class CanvasGrid implements CanvasLayer, CanvasSettingsReceiver {
  private layer: Konva.Layer;

  constructor(private stage: Konva.Stage, private options: CanvasGridOptions) {
    this.layer = new Konva.Layer({ name: "grid", listening: false });
    this.stage.add(this.layer);
  }

  private createLine(x: number, y: number, points: number[]) {
    const { gridColor } = this.options;

    return new Konva.Line({
      x,
      y,
      points: points,
      stroke: gridColor,
      strokeWidth: 1,
      listening: false,
      shadowForStrokeEnabled: false,
      hitStrokeWidth: 0,
    });
  }

  draw() {
    const { gridSize, height, width } = this.options;

    this.layer.clear();
    this.layer.destroyChildren();
    this.layer.clipWidth(0);

    const fullRect = {
      x1: 0,
      y1: 0,
      x2: Math.max(width, width + gridSize),
      y2: Math.max(height, height + gridSize),
    };

    const xSize = fullRect.x2 - fullRect.x1 - gridSize;
    const ySize = fullRect.y2 - fullRect.y1 - gridSize;

    const xSteps = Math.floor(xSize / gridSize);
    const ySteps = Math.floor(ySize / gridSize);

    for (let i = 0; i <= xSteps; i++) {
      const points = [0, 0, 0, ySize];
      const line = this.createLine(
        fullRect.x1 + i * gridSize,
        fullRect.y1,
        points
      );
      this.layer.add(line);
    }

    for (let i = 0; i <= ySteps; i++) {
      const points = [0, 0, xSize, 0];
      const line = this.createLine(
        fullRect.x1,
        fullRect.y1 + i * gridSize,
        points
      );
      this.layer.add(line);
    }

    this.layer.batchDraw();
  }

  destroy() {
    this.layer.destroy();
  }

  settingsUpdated = (settings: CanvasSettings) => {
    if (settings.showGrid) {
      this.layer.show();
    } else {
      this.layer.hide();
    }
  };
}
