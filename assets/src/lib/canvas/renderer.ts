import Konva from "konva";
import { CanvasGrid } from "./grid";
import { CanvasScale } from "./scale";

interface CanvasRendererOptions {
  gridSize: number;
  gridColor: string;
  bgColor: string;
  width: number;
  height: number;
}

export class CanvasRenderer {
  private options: CanvasRendererOptions;

  public stage: Konva.Stage;
  public drawLayer: Konva.Layer;
  public userLayer: Konva.Layer;

  private backgroundLayer: Konva.Layer;
  private gridLayer: Konva.Layer;

  private grid: CanvasGrid;
  private scale: CanvasScale;

  constructor(id: string, options: CanvasRendererOptions) {
    this.options = options;
    this.stage = new Konva.Stage({
      container: id,
      width: options.width,
      height: options.height,
      draggable: true,
    });

    this.backgroundLayer = new Konva.Layer();
    this.gridLayer = new Konva.Layer();
    this.drawLayer = new Konva.Layer();
    this.userLayer = new Konva.Layer();

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
    this.stage.add(this.userLayer);

    this.backgroundLayer.add(
      new Konva.Rect({ x: 0, y: 0, width, height, fill: this.options.bgColor })
    );

    this.scale.init();
  }

  toggleDraggable(value: boolean) {
    this.stage.draggable(value);
    return this;
  }

  render() {
    this.backgroundLayer.draw();
    this.grid.render();
    this.drawLayer.draw();
    this.userLayer.draw();
  }
}
