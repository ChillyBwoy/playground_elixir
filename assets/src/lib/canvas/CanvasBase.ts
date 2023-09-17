export interface CanvasOptions {
  gridSize: number;
  gridColor: string;
  bgColor: string;
  width: number;
  height: number;
}

export interface CanvasSettings {
  mode: "draw" | "move";
  showwGrid: boolean;
  color: string;
}

export interface CanvasLayer {
  init(): void;
  draw?(): void;
  destroy(): void;
}

export interface CanvasSettingsReceiver {
  settingsUpdated(settings: CanvasSettings): void;
}
