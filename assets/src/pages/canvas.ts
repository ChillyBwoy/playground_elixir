import Konva from "konva";
import { Socket } from "phoenix";

import type { Dot } from "../lib/store/dots";
import { CanvasRenderer } from "../lib/canvas/renderer";
import { randomRGB } from "../lib/color";

import throttle from "lodash.throttle";

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

const socket = new Socket("/socket", { params: { token: window.userToken } });
const channel = socket.channel("canvas:lobby", {});

const userMap = new Map<string, { user: User; image: Konva.Image }>();

socket.connect();
channel
  .join()
  .receive("ok", (resp: UserResponse) => {
    run(userResponseMap(resp));
  })
  .receive("error", (resp) => {
    console.log("Unable to join", resp);
  });

interface SceneSettings {
  mode: "draw" | "move";
}

function run(user: User) {
  const $form = document.getElementById("canvas_settings_form")!;
  const _sceneSettings: SceneSettings = {
    mode: "move",
  };

  const renderer = new CanvasRenderer("canvas", {
    gridSize: 50,
    gridColor: "rgba(0, 0, 0, 0.1)",
    bgColor: "#fff",
  });

  channel.push("user:join", { id: user.id });

  channel.on("user:joined", (data: UserResponse) => {
    if (user.id === data.id) {
      return;
    }

    const currentUser = userResponseMap(data);
    if (userMap.has(currentUser.id)) {
      return;
    }

    const image = new Image();
    image.src = currentUser.avatarUrl;

    const userImage = new Konva.Image({
      x: 0,
      y: 0,
      width: 24,
      height: 24,
      image,
    });

    userMap.set(currentUser.id, { user: currentUser, image: userImage });

    console.log(userMap);

    renderer.userLayer.add(userImage);
  });

  renderer.stage.on("click", () => {
    const stage = renderer.stage;

    if (_sceneSettings.mode !== "draw") {
      return;
    }
    const pointer = stage.getPointerPosition()!;
    const scale = stage.scaleX();
    const x = (pointer.x - stage.x()) / scale;
    const y = (pointer.y - stage.y()) / scale;
    const dot: Omit<Dot, "id"> = {
      owner: user.id,
      color: randomRGB(),
      x,
      y,
    };
    channel.push("dot:create", { dot });
  });

  const handleStageMove = throttle(
    (_evt: Konva.KonvaEventObject<PointerEvent>) => {
      var pos = renderer.stage.getRelativePointerPosition();

      channel.push("user:move", {
        id: user.id,
        x: pos.x,
        y: pos.y,
      });
    },
    100
  );

  renderer.stage.on("pointermove", handleStageMove);

  let sceneSettings = new Proxy(_sceneSettings, {
    set(target, prop: keyof SceneSettings, value) {
      target[prop] = value;
      renderer.toggleDraggable(value === "move");
      return true;
    },
  });

  $form.addEventListener("change", (evt) => {
    const data = new FormData(evt.currentTarget as HTMLFormElement);
    const canvasMode = data.get("mode") as SceneSettings["mode"];

    sceneSettings.mode = canvasMode;
  });

  renderer.render();

  interface DotCreatedPayload {
    dot: Dot;
  }

  interface UserMovedPayload {
    x: number;
    y: number;
    id: string;
  }

  channel.on("user:moved", (data: UserMovedPayload) => {
    if (data.id === user.id) {
      return;
    }

    const currentUser = userMap.get(data.id);
    if (!currentUser) {
      return;
    }

    currentUser.image.x(data.x);
    currentUser.image.y(data.y);
    renderer.userLayer.draw();
  });

  channel.on("dot:created", (data: DotCreatedPayload) => {
    const { dot } = data;

    const circle = new Konva.Circle({
      x: dot.x,
      y: dot.y,
      radius: 10,
      fill: dot.color,
    });

    renderer.drawLayer.add(circle);
  });
}
