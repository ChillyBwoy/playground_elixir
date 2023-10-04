import Konva from "konva";

import { range } from "../range";
import type {
  CanvasLayer,
  CanvasSettings,
  CanvasSettingsReceiver,
} from "./CanvasBase";

export class CanvasScale implements CanvasLayer, CanvasSettingsReceiver {
  private scaleRange = range(0.5, 5, 0.25);
  private scale = 1;
  private isActive = true;

  constructor(private stage: Konva.Stage) {
    this.stage.scale({ x: this.scale, y: this.scale });
    this.stage.on("wheel", this.handleScale);
  }

  private handleScale = (event: Konva.KonvaEventObject<WheelEvent>) => {
    event.evt.preventDefault();

    if (!this.isActive) {
      return;
    }

    const oldScale = this.stage.scaleX();
    const pointer = this.stage.getPointerPosition()!;

    const mousePointTo = {
      x: (pointer.x - this.stage.x()) / oldScale,
      y: (pointer.y - this.stage.y()) / oldScale,
    };

    let direction = event.evt.deltaY > 0 ? -1 : 1;
    if (event.evt.ctrlKey) {
      direction = -direction;
    }

    if (direction > 0) {
      this.scale = this.scale > 0 ? this.scale - 1 : this.scale;
    } else {
      this.scale =
        this.scale < this.scaleRange.length - 1 ? this.scale + 1 : this.scale;
    }

    const newScale = this.scaleRange[this.scale];
    this.stage.scale({ x: newScale, y: newScale });

    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };
    this.stage.position(newPos);
    this.stage.draw();
  };

  settingsUpdated = (_settings: CanvasSettings) => {};

  draw(): void {}

  destroy() {
    this.stage.off("wheel", this.handleScale);
  }
}
