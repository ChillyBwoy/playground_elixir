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
    this.stage.attrs.container.style.cursor =
      settings.mode === "move" ? "move" : "crosshair";
  };
}
