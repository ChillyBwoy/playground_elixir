import Konva from "konva";
import {
  canvasDefaultSettings,
  type CanvasLayer,
  type CanvasSettings,
  type CanvasSettingsReceiver,
} from "./CanvasBase";

interface SelectionArea {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export class CanvasSelectTransform
  implements CanvasLayer, CanvasSettingsReceiver
{
  private layer: Konva.Layer;

  private settings: CanvasSettings = { ...canvasDefaultSettings };
  private selectionRectangle: Konva.Rect;
  private selectionArea: SelectionArea = { x1: 0, y1: 0, x2: 0, y2: 0 };
  private transformer: Konva.Transformer;

  constructor(private stage: Konva.Stage) {
    this.layer = new Konva.Layer({
      name: "select",
    });

    this.transformer = new Konva.Transformer();
    this.selectionRectangle = new Konva.Rect({
      fill: "rgba(0,0,255,0.5)",
      visible: false,
    });
  }

  private handleMouseDown: Konva.KonvaEventListener<Konva.Stage, PointerEvent> =
    (event) => {
      if (this.settings.mode !== "select") {
        return;
      }

      event.evt.preventDefault;
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
    };

  private handleMouseMove: Konva.KonvaEventListener<Konva.Stage, PointerEvent> =
    (event) => {
      if (this.settings.mode !== "select") {
        return;
      }
      event.evt.preventDefault();

      const pos = this.stage.getRelativePointerPosition();
      this.selectionArea.x2 = pos.x;
      this.selectionArea.y2 = pos.y;

      this.selectionRectangle.setAttrs({
        x: Math.min(this.selectionArea.x1, this.selectionArea.x2),
        y: Math.min(this.selectionArea.y1, this.selectionArea.y2),
        width: Math.abs(this.selectionArea.x2 - this.selectionArea.x1),
        height: Math.abs(this.selectionArea.y2 - this.selectionArea.y1),
      });
    };

  private handleMouseUp: Konva.KonvaEventListener<Konva.Stage, PointerEvent> = (
    event
  ) => {
    if (this.settings.mode !== "select") {
      return;
    }
    event.evt.preventDefault();

    if (!this.selectionRectangle.visible()) {
      return;
    }

    this.selectionRectangle.visible(false);
    const shapes = this.stage.find(".line");

    const box = this.selectionRectangle.getClientRect();
    const selected = shapes.reduce<Array<Konva.Node>>((acc, shape) => {
      const hasIntersection = Konva.Util.haveIntersection(
        box,
        shape.getClientRect()
      );
      if (hasIntersection) {
        acc.push(shape);
      }
      return acc;
    }, []);

    this.transformer.nodes(selected);
  };

  init(): void {
    this.layer.add(this.selectionRectangle);
    this.layer.add(this.transformer);

    this.stage.add(this.layer);

    this.stage.on("mousedown touchstart", this.handleMouseDown);
    this.stage.on("mouseup touchend", this.handleMouseUp);
    this.stage.on("mousemove touchmove", this.handleMouseMove);
  }

  draw(): void {}

  destroy(): void {
    this.stage.off("mousedown touchstart", this.handleMouseDown);
    this.stage.off("mouseup touchend", this.handleMouseUp);
    this.stage.off("mousemove touchmove", this.handleMouseMove);

    this.layer.destroy();
  }

  settingsUpdated = (settings: CanvasSettings) => {
    this.settings = settings;
  };
}
