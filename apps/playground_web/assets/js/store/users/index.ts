import { v4 as uuid } from "uuid";
import { Store } from "../base";
import type { User } from "./types";

class UsersStore extends Store<Array<User>, User> {
  constructor() {
    super([]);
  }

  private randomColor() {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);

    return `rgba(${r}, ${g}, ${b}, 1)`;
  }

  join = (user: Omit<User, "id" | "color">) => {
    const newUser = {
      ...user,
      id: uuid(),
      color: this.randomColor(),
    };
    this.state = [...this.state, newUser];
    this.emit(newUser);
  };

  leave = (id: string) => {
    const user = this.state.find((user) => user.id === id);
    if (!user) {
      return;
    }

    this.state = this.state.filter((user) => user.id !== id);
    this.emit(user);
  };
}

export const usersStore = new UsersStore();
