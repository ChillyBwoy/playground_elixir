import Konva from "konva";
import { CanvasGrid } from "./grid";
import { CanvasScale } from "./scale";

interface CanvasRendererOptions {
  gridSize: number;
  gridColor: string;
  bgColor: string;
  onClick: (
    evt: Konva.KonvaEventObject<MouseEvent>,
    stage: Konva.Stage
  ) => void;
}

export class CanvasRenderer {
  private options: CanvasRendererOptions;

  private stage: Konva.Stage;

  private backgroundLayer: Konva.Layer;
  private gridLayer: Konva.Layer;
  public drawLayer: Konva.Layer;

  private grid: CanvasGrid;
  private scale: CanvasScale;

  constructor(id: string, options: CanvasRendererOptions) {
    this.options = options;
    this.stage = new Konva.Stage({
      container: id,
      width: 3000,
      height: 3000,
      draggable: true,
    });

    this.backgroundLayer = new Konva.Layer();
    this.gridLayer = new Konva.Layer();
    this.drawLayer = new Konva.Layer();

    this.grid = new CanvasGrid(this.stage, this.gridLayer, {
      gridSize: this.options.gridSize,
      gridColor: this.options.gridColor,
    });

    this.scale = new CanvasScale(this.stage);

    this.init();
  }

  private init() {
    const width = this.stage.width();
    const height = this.stage.height();

    this.stage.add(this.backgroundLayer);
    this.stage.add(this.gridLayer);
    this.stage.add(this.drawLayer);

    this.backgroundLayer.add(
      new Konva.Rect({ x: 0, y: 0, width, height, fill: this.options.bgColor })
    );

    this.scale.init();

    this.stage.on("click", (evt) => {
      this.options.onClick(evt, this.stage);
    });
  }

  toggleDraggable(value: boolean) {
    this.stage.draggable(value);
    return this;
  }

  render() {
    this.backgroundLayer.draw();
    this.grid.render();
    this.drawLayer.draw();
  }
}
