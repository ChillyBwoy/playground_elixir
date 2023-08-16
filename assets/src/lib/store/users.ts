import { Store } from "./base";

export interface User {
  id: string;
  name: string;
  avatar: string;
}

class UsersStore extends Store<Array<User>> {
  constructor() {
    super("users", []);
  }

  join(user: User) {
    this.state = [...this.state, user];
    this.emit();
  }

  leave(id: string) {
    const user = this.state.find((user) => user.id === id);
    if (!user) {
      return;
    }

    this.state = this.state.filter((user) => user.id !== id);
    this.emit();
  }
}

export const usersStore = new UsersStore();
