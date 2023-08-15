import { v4 as uuid } from "uuid";
import { Store } from "../base";
import type { Dot } from "./types";

class DotsStore extends Store<Array<Dot>, Dot> {
  constructor() {
    super([]);
  }

  add = (payload: Omit<Dot, "id">): Dot => {
    const newDot = {
      ...payload,
      id: uuid(),
    };
    this.state = [...this.state, newDot];
    this.emit(newDot);

    return newDot;
  };
}

export const dotsStore = new DotsStore();
