import throttle from "lodash.throttle";
import Konva from "konva";
import {
  canvasDefaultSettings,
  type CanvasLayer,
  type CanvasSettings,
  type CanvasSettingsReceiver,
} from "./CanvasBase";

interface CanvasDrawOptions {
  onDraw?(data: Konva.ShapeConfig): void;
  onDrawEnd?(data: Konva.ShapeConfig): void;
}

interface SelectionArea {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export class CanvasDraw implements CanvasLayer, CanvasSettingsReceiver {
  private isDrawing = false;
  private lastLine: Konva.Line | null = null;

  private layer: Konva.Layer;
  private settings: CanvasSettings = { ...canvasDefaultSettings };
  private selectionRectangle: Konva.Rect;
  private selectionArea: SelectionArea = { x1: 0, y1: 0, x2: 0, y2: 0 };
  private transformer: Konva.Transformer;

  constructor(private stage: Konva.Stage, private options: CanvasDrawOptions) {
    this.layer = new Konva.Layer({
      name: "draw",
    });

    this.transformer = new Konva.Transformer();
    this.layer.add(this.transformer);

    this.selectionRectangle = new Konva.Rect({
      fill: "rgba(0,0,255,0.5)",
      visible: false,
    });
    this.layer.add(this.selectionRectangle);
  }

  init() {
    this.stage.add(this.layer);

    this.stage.on("mousedown touchstart", this.handleMouseDown);
    this.stage.on("mouseup touchend", this.handleMouseUp);
    this.stage.on("mousemove touchmove", this.handleMouseMove);
  }

  private handleDrawStart() {
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
  }

  private handleDraw() {
    if (!this.lastLine) {
      return;
    }

    const pos = this.stage.getRelativePointerPosition();
    const newPoints = this.lastLine.points().concat([pos.x, pos.y]);

    this.lastLine.points(newPoints);

    this.handleData(this.lastLine.toObject());
  }

  private handleDrawEnd() {
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

  private handleMouseDown: Konva.KonvaEventListener<Konva.Stage, PointerEvent> =
    (event) => {
      event.evt.preventDefault();

      switch (this.settings.mode) {
        case "draw":
        case "erase":
          this.isDrawing = true;
          this.handleDrawStart();
          break;

        case "select":
          const pos = this.stage.getRelativePointerPosition();

          this.selectionArea = {
            x1: pos.x,
            y1: pos.y,
            x2: pos.x,
            y2: pos.y,
          };
          this.selectionRectangle.visible(true);
          this.selectionRectangle.width(0);
          this.selectionRectangle.height(0);
          break;

        default:
          break;
      }
    };

  private handleData = throttle((data: Konva.ShapeConfig) => {
    this.options.onDraw && this.options.onDraw(data);
  }, 200);

  private handleMouseMove: Konva.KonvaEventListener<Konva.Stage, PointerEvent> =
    (event) => {
      event.evt.preventDefault();

      switch (this.settings.mode) {
        case "draw":
        case "erase":
          this.handleDraw();
          break;

        case "select":
          const pos = this.stage.getRelativePointerPosition();
          this.selectionArea.x2 = pos.x;
          this.selectionArea.y2 = pos.y;

          this.selectionRectangle.setAttrs({
            x: Math.min(this.selectionArea.x1, this.selectionArea.x2),
            y: Math.min(this.selectionArea.y1, this.selectionArea.y2),
            width: Math.abs(this.selectionArea.x2 - this.selectionArea.x1),
            height: Math.abs(this.selectionArea.y2 - this.selectionArea.y1),
          });
          break;
        default:
          break;
      }
    };

  private handleMouseUp: Konva.KonvaEventListener<Konva.Stage, PointerEvent> = (
    event
  ) => {
    event.evt.preventDefault();

    switch (this.settings.mode) {
      case "draw":
      case "erase":
        if (this.isDrawing) {
          this.handleDrawEnd();
          this.isDrawing = false;
        }
        break;

      case "select":
        if (this.selectionRectangle.visible()) {
          this.selectionRectangle.visible(false);
          const shapes = this.stage.find(".line");
          const box = this.selectionRectangle.getClientRect();
          const selected = shapes.reduce<Array<Konva.Node>>((acc, shape) => {
            const hasIntersection = Konva.Util.haveIntersection(
              box,
              shape.getClientRect()
            );
            if (hasIntersection) {
              shape.setAttrs({
                stroke: "red",
                strokeWidth: 5,
                globalCompositeOperation: "source-over",
                // selected: true,
              });
              acc.push(shape);
            }
            return acc;
          }, []);

          console.log(selected);

          this.transformer.nodes(selected);
        }
        break;

      default:
        break;
    }
  };

  settingsUpdated = (settings: CanvasSettings) => {
    this.settings = settings;
  };

  drawShape(data: Konva.ShapeConfig): void {
    const line = new Konva.Line({
      ...data,
      name: "line",
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
