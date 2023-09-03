interface CanvasSettingsFormData {
  mode: "draw" | "move";
}

export class CanvasSettingsForm {
  private _data: CanvasSettingsFormData = {
    mode: "move",
  };
  private data: CanvasSettingsFormData;

  constructor(
    private $form: HTMLFormElement,
    private onChange: (data: CanvasSettingsFormData) => void
  ) {
    this.data = new Proxy(this._data, {
      set(target, prop: keyof CanvasSettingsFormData, value) {
        target[prop] = value;
        return true;
      },
    });
    this.$form.addEventListener("change", this.handleFormChange);

    this.onChange(this.data);
  }

  private handleFormChange = (evt: Event) => {
    const formData = new FormData(evt.currentTarget as HTMLFormElement);
    const canvasMode = formData.get("mode") as CanvasSettingsFormData["mode"];

    this.data.mode = canvasMode;

    this.onChange(this.data);
  };
}
