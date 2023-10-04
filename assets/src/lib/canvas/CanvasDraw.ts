import throttle from "lodash.throttle";
import Konva from "konva";
import {
  canvasDefaultSettings,
  shapeName,
  type CanvasLayer,
  type CanvasSettings,
  type CanvasSettingsReceiver,
} from "./CanvasBase";

interface CanvasDrawOptions {
  onDraw?(data: Konva.ShapeConfig): void;
  onDrawEnd?(data: Konva.ShapeConfig): void;
}

export class CanvasDraw implements CanvasLayer, CanvasSettingsReceiver {
  private isDrawing = false;
  private lastLine: Konva.Line | null = null;

  private layer: Konva.Layer;
  private settings: CanvasSettings = { ...canvasDefaultSettings };

  constructor(private stage: Konva.Stage, private options: CanvasDrawOptions) {
    this.layer = new Konva.Layer({ name: "draw" });

    this.stage.add(this.layer);
    this.stage.on("mousedown touchstart", this.handleMouseDown);
    this.stage.on("mouseup touchend", this.handleMouseUp);
    this.stage.on("mousemove touchmove", this.handleMouseMove);
    this.layer.on("dragend", (event) => {
      // TODO: send event to server
      console.log(event.target);
    });
  }

  private handleMouseDown = () => {
    if (this.settings.mode !== "draw") {
      this.isDrawing = false;
      return;
    }

    this.isDrawing = true;

    const pos = this.stage.getRelativePointerPosition();

    this.lastLine = new Konva.Line({
      stroke: this.settings.color,
      strokeWidth: this.settings.brushSize,
      globalCompositeOperation: "source-over",
      lineCap: "round",
      lineJoin: "round",
      points: [pos.x, pos.y, pos.x, pos.y],
    });

    this.layer.add(this.lastLine);
  };

  private handleData = throttle((data: Konva.ShapeConfig) => {
    this.options.onDraw && this.options.onDraw(data);
  }, 200);

  private handleMouseMove = (event: Konva.KonvaEventObject<PointerEvent>) => {
    if (!this.isDrawing || this.settings.mode !== "draw" || !this.lastLine) {
      return;
    }

    event.evt.preventDefault();

    const pos = this.stage.getRelativePointerPosition();
    const newPoints = this.lastLine.points().concat([pos.x, pos.y]);

    this.lastLine.points(newPoints);

    this.handleData(this.lastLine.toObject());
  };

  private handleMouseUp = () => {
    if (this.isDrawing) {
      if (this.options.onDrawEnd) {
        const payload = this.lastLine?.toObject();
        payload.attrs = {
          ...payload.attrs,
          ...this.lastLine?.attrs,
        };
        this.options.onDrawEnd(payload);
      }

      this.lastLine?.remove();
      this.lastLine?.destroy();
      this.lastLine = null;
    }
    this.isDrawing = false;
  };

  settingsUpdated = (settings: CanvasSettings) => {
    this.settings = settings;

    if (this.layer.children) {
      const draggable = settings.mode === "select";
      for (const child of this.layer.children) {
        child.draggable(draggable);
      }
    }
  };

  drawLine(id: string, config: Konva.ShapeConfig): void {
    const line = new Konva.Line({
      ...config,
      name: shapeName,
      id,
    });
    this.layer.add(line);
  }

  draw(): void {}

  destroy() {
    this.stage.off("mousedown touchstart", this.handleMouseDown);
    this.stage.off("mouseup touchend", this.handleMouseUp);
    this.stage.off("mousemove touchmove", this.handleMouseMove);

    this.layer.destroy();
  }
}
