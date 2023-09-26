import Konva from "konva";
import type {
  CanvasLayer,
  CanvasOptions,
  CanvasSettings,
  CanvasSettingsReceiver,
} from "./CanvasBase";

export class CanvasRenderer implements CanvasSettingsReceiver {
  public options: CanvasOptions;

  public stage: Konva.Stage;

  private layers: Array<CanvasLayer> = [];

  constructor(id: string, options: CanvasOptions) {
    this.options = options;
    this.stage = new Konva.Stage({
      container: id,
      width: options.width,
      height: options.height,
      draggable: true,
    });

    for (const layer of this.layers) {
      layer.init();
    }
  }

  addLayer(layer: CanvasLayer) {
    this.layers.push(layer);
    layer.init();
  }

  render() {
    for (const layer of this.layers) {
      layer.draw && layer.draw();
    }
  }

  settingsUpdated = (settings: CanvasSettings) => {
    this.stage.draggable(settings.mode === "move");

    switch (settings.mode) {
      case "draw":
        this.stage.attrs.container.style.cursor = "crosshair";
        break;
      case "erase":
        this.stage.attrs.container.style.cursor = "cell";
        break;
      case "move":
        this.stage.attrs.container.style.cursor = "move";
        break;

      default:
        this.stage.attrs.container.style.cursor = "default";
    }
  };
}
