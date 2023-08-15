export interface Dot {
  owner: string;
  x: number;
  y: number;
  color: string;
}

export interface DotInstance extends Dot {
  id: string;
}
