import {
  canvasDefaultSettings,
  type CanvasSettings,
  type CanvasSettingsReceiver,
} from "./CanvasBase";

type CanvasSettingsFormSubscriber = (data: CanvasSettings) => void;

export class CanvasSettingsForm {
  private $form: HTMLFormElement;
  private subscribers: Array<CanvasSettingsFormSubscriber> = [];
  private _data: CanvasSettings = {
    ...canvasDefaultSettings,
  };
  private data: CanvasSettings;

  constructor(id: string) {
    this.$form = document.getElementById(id) as HTMLFormElement;

    this.data = new Proxy(this._data, {
      set(target, prop: keyof CanvasSettings, value) {
        if (prop === "mode") {
          target[prop] = value;
        }
        if (prop === "showGrid") {
          target[prop] = Boolean(value);
        }
        if (prop === "color") {
          target[prop] = value;
        }
        if (prop === "brushSize") {
          target[prop] = Number(value);
        }

        return true;
      },
    });

    this.$form.addEventListener("change", this.handleFormChange);
  }

  private handleFormChange = (evt: Event) => {
    const formData = new FormData(evt.currentTarget as HTMLFormElement);
    this.data.mode = formData.get("mode") as CanvasSettings["mode"];
    this.data.showGrid = formData.get("show_grid") === "on";
    this.data.color = formData.get("color") as CanvasSettings["color"];
    this.data.brushSize = Number(formData.get("brush_size"));

    this.notify();
  };

  subscribe(subscriber: CanvasSettingsReceiver) {
    if (!subscriber.settingsUpdated) {
      return;
    }

    this.subscribers.push(subscriber.settingsUpdated);

    subscriber.settingsUpdated(this.data);

    return () => {
      this.subscribers = this.subscribers.filter(
        (fn) => fn !== subscriber.settingsUpdated
      );
    };
  }

  notify() {
    for (const subscriber of this.subscribers) {
      subscriber(this.data);
    }
  }
}
