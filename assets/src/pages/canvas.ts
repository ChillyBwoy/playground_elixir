import Konva from "konva";
import { Socket } from "phoenix";
import throttle from "lodash.throttle";

import type { Dot } from "../lib/store/dots";
import { CanvasRenderer } from "../lib/canvas/renderer";
import { randomRGB } from "../lib/color";
import { CanvasSettingsForm } from "../lib/canvas/settings_form";

interface UserResponse {
  id: string;
  username: string;
  avatar_url: string;
}

interface User {
  id: string;
  userName: string;
  avatarUrl: string;
}

function userResponseMap(data: UserResponse): User {
  return {
    id: data.id,
    userName: data.username,
    avatarUrl: data.avatar_url,
  };
}

// const userMap = new Map<string, { user: User; image: Konva.Image }>();

const socket = new Socket("/socket", { params: { token: window.userToken } });
socket.connect();

const channel = socket.channel("canvas:lobby", {});
channel
  .join()
  .receive("ok", (resp: UserResponse) => {
    run(userResponseMap(resp));
  })
  .receive("error", (resp) => {
    console.log("Unable to join", resp);
  });

function run(user: User) {
  const renderer = new CanvasRenderer("canvas", {
    gridSize: 50,
    gridColor: "rgba(0, 0, 0, 0.1)",
    bgColor: "#fff",
  });

  new CanvasSettingsForm(
    document.getElementById("canvas_settings_form") as HTMLFormElement,
    (data) => {
      renderer.toggleDraggable(data.mode === "move");
    }
  );

  // channel.push("user:join", { id: user.id });

  // channel.on("user:joined", (data: UserResponse) => {
  //   if (user.id === data.id) {
  //     return;
  //   }

  //   const currentUser = userResponseMap(data);
  //   if (userMap.has(currentUser.id)) {
  //     return;
  //   }

  //   const image = new Image();
  //   image.src = currentUser.avatarUrl;

  //   const userImage = new Konva.Image({
  //     x: 0,
  //     y: 0,
  //     width: 32,
  //     height: 32,
  //     image,
  //   });

  //   userMap.set(currentUser.id, { user: currentUser, image: userImage });
  //   renderer.userLayer.add(userImage);
  // });

  // renderer.stage.on("click", () => {
  //   const stage = renderer.stage;

  //   if (_sceneSettings.mode !== "draw") {
  //     return;
  //   }
  //   const pointer = stage.getPointerPosition()!;
  //   const scale = stage.scaleX();
  //   const x = (pointer.x - stage.x()) / scale;
  //   const y = (pointer.y - stage.y()) / scale;
  //   const dot: Omit<Dot, "id"> = {
  //     owner: user.id,
  //     color: randomRGB(),
  //     x,
  //     y,
  //   };
  //   channel.push("dot:create", { dot });
  // });

  // const handleStageMove = throttle(
  //   (_evt: Konva.KonvaEventObject<PointerEvent>) => {
  //     var pos = renderer.stage.getRelativePointerPosition();

  //     channel.push("user:move", {
  //       id: user.id,
  //       x: pos.x,
  //       y: pos.y,
  //     });
  //   },
  //   100
  // );

  // renderer.stage.on("pointermove", handleStageMove);

  renderer.render();

  // interface DotCreatedPayload {
  //   dot: Dot;
  // }

  // interface UserMovedPayload {
  //   x: number;
  //   y: number;
  //   id: string;
  // }

  // channel.on("user:moved", (data: UserMovedPayload) => {
  //   if (data.id === user.id) {
  //     return;
  //   }

  //   const currentUser = userMap.get(data.id);
  //   if (!currentUser) {
  //     return;
  //   }

  //   currentUser.image.x(data.x);
  //   currentUser.image.y(data.y);
  // });

  // channel.on("dot:created", (data: DotCreatedPayload) => {
  //   const { dot } = data;

  //   const circle = new Konva.Circle({
  //     x: dot.x,
  //     y: dot.y,
  //     radius: 10,
  //     fill: dot.color,
  //   });

  //   renderer.drawLayer.add(circle);
  // });
}
