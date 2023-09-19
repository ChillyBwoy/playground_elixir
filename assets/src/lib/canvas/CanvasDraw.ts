import throttle from "lodash.throttle";
import Konva from "konva";
import {
  canvasDefaultSettings,
  type CanvasLayer,
  type CanvasSettings,
  type CanvasSettingsReceiver,
} from "./CanvasBase";

interface CanvasDrawOptions {
  onDraw?(data: Konva.LineConfig): void;
  onDrawEnd?(data: Konva.LineConfig): void;
}

export class CanvasDraw implements CanvasLayer, CanvasSettingsReceiver {
  private isDrawing = false;
  private allowDraw = false;
  private lastLine: Konva.Line | null = null;

  private layer: Konva.Layer;
  private settings: CanvasSettings = { ...canvasDefaultSettings };

  constructor(private stage: Konva.Stage, private options: CanvasDrawOptions) {
    this.layer = new Konva.Layer({
      name: "draw",
    });
  }

  init() {
    this.stage.add(this.layer);

    this.stage.on("mousedown touchstart", this.handleMouseDown);
    this.stage.on("mouseup touchend", this.handleMouseUp);
    this.stage.on("mousemove touchmove", this.handleMouseMove);
  }

  private handleMouseDown = () => {
    if (!this.allowDraw) {
      this.isDrawing = false;
      return;
    }

    this.isDrawing = true;

    const pos = this.stage.getRelativePointerPosition();

    const mode =
      this.settings.mode === "draw" ? "source-over" : "destination-out";

    this.lastLine = new Konva.Line({
      stroke: this.settings.color,
      strokeWidth: this.settings.brushSize,
      globalCompositeOperation: mode,
      lineCap: "round",
      lineJoin: "round",
      points: [pos.x, pos.y, pos.x, pos.y],
    });

    this.layer.add(this.lastLine);
  };

  private handleData = throttle((data: Konva.LineConfig) => {
    this.options.onDraw && this.options.onDraw(data);
  }, 200);

  private handleMouseMove = (event: Konva.KonvaEventObject<PointerEvent>) => {
    if (!this.isDrawing || !this.allowDraw || !this.lastLine) {
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
      this.options.onDrawEnd &&
        this.options.onDrawEnd(this.lastLine?.toObject());
      this.lastLine?.remove();
      this.lastLine?.destroy();
      this.lastLine = null;
    }
    this.isDrawing = false;
  };

  settingsUpdated = (settings: CanvasSettings) => {
    this.allowDraw = settings.mode !== "move";
    this.settings = settings;
  };

  drawLine(data: Konva.LineConfig): void {
    const line = new Konva.Line(data);
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
