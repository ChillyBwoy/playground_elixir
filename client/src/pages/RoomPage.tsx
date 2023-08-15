import React from "react";

import { Canvas } from "../components/Canvas/Canvas";

const RoomPage: React.FC = () => {
  return <Canvas width={1000} height={1000} />;
};

export async function loader() {
  return null;
}

export const Component = RoomPage;

export default RoomPage;
