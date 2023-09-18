import { Store } from "./base";
import type { Presence } from "../../types/app";

export class PresenceStore extends Store<Map<string, Presence>> {
  constructor() {
    super("users", new Map());
  }

  update(presences: Record<string, Presence>) {
    this.state = new Map(Object.entries(presences));
    this.emit();
  }
}
