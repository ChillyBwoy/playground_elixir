import Konva from "konva";
import type {
  CanvasOptions,
  CanvasSettings,
  CanvasSettingsReceiver,
} from "./CanvasBase";

export class CanvasStage implements CanvasSettingsReceiver {
  public options: CanvasOptions;

  public stage: Konva.Stage;

  constructor(id: string, options: CanvasOptions) {
    this.options = options;
    this.stage = new Konva.Stage({
      container: id,
      width: options.width,
      height: options.height,
      draggable: true,
    });
  }

  settingsUpdated = (settings: CanvasSettings) => {
    this.stage.draggable(settings.mode === "move");

    switch (settings.mode) {
      case "select":
        this.stage.attrs.container.style.cursor = "crosshair";
        break;

      case "move":
        this.stage.attrs.container.style.cursor = "move";
        break;

      default:
        this.stage.attrs.container.style.cursor = "default";
    }
  };
}
