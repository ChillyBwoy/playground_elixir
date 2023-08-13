import { uuid } from "../../lib/uuid";
import { Store } from "../base";
import type { Dot } from "./types";

class DotsStore extends Store<Array<Dot>, Dot> {
  constructor() {
    super([]);
  }

  add = (payload: Omit<Dot, "id">) => {
    const newDot = {
      ...payload,
      id: uuid(),
    };
    this.state = [...this.state, newDot];
    this.emit(newDot);
  };
}

export const dotsStore = new DotsStore();
