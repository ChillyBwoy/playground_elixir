import Konva from "konva";
import {
  canvasDefaultSettings,
  shapeName,
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
  private selected: Array<Konva.Node> = [];

  constructor(private stage: Konva.Stage) {
    this.layer = new Konva.Layer({
      name: "select",
    });

    this.transformer = new Konva.Transformer({
      borderDash: [5, 5],
      resizeEnabled: false,
      rotateEnabled: false,
      borderStroke: "rgba(0, 0, 0, 0.5)",
      borderStrokeWidth: 1,
    });

    this.selectionRectangle = new Konva.Rect({
      fill: "rgba(0, 0, 0, 0.1)",
      visible: false,
    });

    this.layer.add(this.selectionRectangle);
    this.layer.add(this.transformer);
    this.stage.add(this.layer);

    this.stage.on("mousedown touchstart", this.handleMouseDown);
    this.stage.on("mouseup touchend", this.handleMouseUp);
    this.stage.on("mousemove touchmove", this.handleMouseMove);
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
      if (this.selected.length > 0) {
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
    if (!this.selectionRectangle.visible()) {
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

    this.selectionRectangle.visible(false);
    const box = this.selectionRectangle.getClientRect();
    const shapes = this.stage.find(`.${shapeName}`);

    this.selected = shapes.filter((shape) =>
      Konva.Util.haveIntersection(box, shape.getClientRect())
    );

    this.transformer.nodes(this.selected);
  };

  private reset() {
    this.selected = [];
    this.transformer.nodes([]);
    this.selectionArea = { x1: 0, y1: 0, x2: 0, y2: 0 };
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
    this.reset();
  };
}
