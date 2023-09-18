type Listener<T> = (payload: T) => void;

export class Store<T> {
  protected state: T;
  protected name: string;

  private listeners: Array<Listener<T>> = [];

  constructor(name: string, initial: T) {
    this.name = name;
    this.state = initial;
  }

  protected emit() {
    for (const listener of this.listeners) {
      listener(this.state);
    }
  }

  subscribe(listener: Listener<T>) {
    this.listeners.push(listener);

    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  getSnapshot() {
    return this.state;
  }
}
