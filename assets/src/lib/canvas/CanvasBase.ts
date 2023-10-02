export interface CanvasOptions {
  gridSize: number;
  gridColor: string;
  bgColor: string;
  width: number;
  height: number;
}

export interface CanvasSettings {
  mode: "draw" | "move" | "select";
  showGrid: boolean;
  color: string;
  brushSize: number;
}

export interface CanvasLayer {
  draw(): void;
  destroy(): void;
}

export interface CanvasSettingsReceiver {
  settingsUpdated(settings: CanvasSettings): void;
}

export const canvasDefaultSettings: CanvasSettings = {
  mode: "move",
  showGrid: true,
  color: "#000000",
  brushSize: 1,
};

export const shapeName = "playground_shape";
