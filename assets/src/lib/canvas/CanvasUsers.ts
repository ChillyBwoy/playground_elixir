import throttle from "lodash.throttle";
import Konva from "konva";
import type { CanvasLayer } from "./CanvasBase";

interface CanvasUsersOptions {
  onMove(x: number, y: number): void;
}

export class CanvasUsers implements CanvasLayer {
  private layer: Konva.Layer;

  constructor(private stage: Konva.Stage, private options: CanvasUsersOptions) {
    this.layer = new Konva.Layer();
  }

  private handleStageMove = throttle(
    (_event: Konva.KonvaEventObject<PointerEvent>) => {
      var pos = this.stage.getRelativePointerPosition();
      this.options.onMove(pos.x, pos.y);
    },
    200
  );

  init(): void {
    this.stage.on("pointermove", this.handleStageMove);
    this.stage.add(this.layer);
  }

  draw(): void {
    this.layer.draw();
  }

  addUserAvatar(img: Konva.Image) {
    this.layer.add(img);
  }

  removeUserAvatar(img: Konva.Image): void {
    img.remove();
    img.destroy();
  }

  destroy() {
    this.stage.off("pointermove", this.handleStageMove);
    this.layer.destroy();
  }
}
