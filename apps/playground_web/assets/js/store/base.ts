type Listener<T> = (payload: T) => void;

export class Store<T, TPayload> {
  protected state: T;

  private listeners: Array<Listener<TPayload>> = [];

  constructor(initial: T) {
    this.state = initial;
  }

  protected emit(data: TPayload) {
    for (const listener of this.listeners) {
      listener(data);
    }
  }

  subscribe = (listener: Listener<TPayload>) => {
    this.listeners = [...this.listeners, listener];

    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  };

  getSnapshot = () => {
    return this.state;
  };
}
