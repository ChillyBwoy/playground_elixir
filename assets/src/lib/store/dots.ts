import { Store } from "./base";

export interface Dot {
  id: string;
  owner: string;
  x: number;
  y: number;
  color: string;
}

export class DotsStore extends Store<Array<Dot>> {
  constructor() {
    super("dots", []);
  }

  add(dot: Dot) {
    this.state = [...this.state, dot];
    this.emit();
  }
}
