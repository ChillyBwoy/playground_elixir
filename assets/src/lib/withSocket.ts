import { Socket, Channel } from "phoenix";

type Callback = (socket: Socket, channel: Channel) => void;

export function withSocket<T = unknown>(url: string, callback?: Callback) {
  const socket = new Socket(url, {});
  const channel = socket.channel("canvas:lobby", {});

  socket.connect();
  channel
    .join()
    .receive("ok", (resp: T) => {
      console.log("Joined successfully", resp);
    })
    .receive("error", (resp: T) => {
      console.log("Unable to join", resp);
    });

  if (callback) {
    callback(socket, channel);
  }

  return { socket, channel };
}
