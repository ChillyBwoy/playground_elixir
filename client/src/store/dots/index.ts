import { Store } from "../base";
import type { Dot, DotInstance } from "./types";

class DotsStore extends Store<Array<Dot>, Dot> {
  constructor() {
    super([]);
  }

  add = (dot: DotInstance) => {
    this.state = [...this.state, dot];
    this.emit(dot);
  };
}

export const dotsStore = new DotsStore();
