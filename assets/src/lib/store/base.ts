type Listener = () => void;

export class Store<T> {
  protected state: T;
  protected name: string;

  private listeners: Array<Listener> = [];

  constructor(name: string, initial: T) {
    this.name = name;
    this.state = initial;
  }

  protected emit() {
    for (const listener of this.listeners) {
      listener();
    }
  }

  subscribe(listener: Listener) {
    this.listeners.push(listener);

    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  getSnapshot() {
    return this.state;
  }
}
