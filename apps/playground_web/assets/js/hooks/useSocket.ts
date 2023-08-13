import { Socket } from "phoenix";

export function useSocket(endpoint: string) {
  const socket = new Socket("/socket", { params: { token: window.userToken } });
  socket.connect();

  const channel = socket.channel(endpoint, {});
  channel
    .join()
    .receive("ok", (resp) => {
      console.log("Joined successfully", resp);
    })
    .receive("error", (resp) => {
      console.log("Unable to join", resp);
    });

  return { socket, channel };
}
