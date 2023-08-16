import { Socket, Channel } from "phoenix";
import React from "react";

type Callback = (channel: Channel) => void;

export function useSocket(callback: Callback) {
  const ready = React.useRef(false);

  const socket = React.useMemo(
    () => new Socket("ws://localhost:4000/socket", {}),
    []
  );

  const channel = React.useMemo(
    () => socket.channel("room:lobby", {}),
    [socket]
  );

  React.useEffect(() => {
    if (ready.current) {
      return;
    }

    socket.connect();
    channel
      .join()
      .receive("ok", (resp) => {
        console.log("Joined successfully", resp);
      })
      .receive("error", (resp) => {
        console.log("Unable to join", resp);
      });

    callback(channel);

    ready.current = true;
  }, [callback, channel, socket]);

  return { channel, socket };
}
