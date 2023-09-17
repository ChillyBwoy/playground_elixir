import Konva from "konva";
import type { CanvasLayer } from "./CanvasBase";

interface CanvasBackgroundOptions {
  bgColor: string;
}

export class CanvasBackground implements CanvasLayer {
  private layer: Konva.Layer;

  constructor(
    private stage: Konva.Stage,
    private options: CanvasBackgroundOptions
  ) {
    this.layer = new Konva.Layer();
  }

  init(): void {
    const width = this.stage.width();
    const height = this.stage.height();

    this.stage.add(this.layer);

    this.layer.add(
      new Konva.Rect({ x: 0, y: 0, width, height, fill: this.options.bgColor })
    );
  }

  draw(): void {
    this.layer.draw();
  }

  destroy(): void {
    this.layer.destroy();
  }
}
