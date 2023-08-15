import React from "react";

import { Canvas } from "../components/Canvas/Canvas";

const RoomPage: React.FC = () => {
  return (
    <div className="flex bg-yellow-700">
      <div className="bg-slate-100 flex-1">
        <Canvas width={1000} height={1000} />
      </div>
      <section className="bg-slate-500 flex-1" />
    </div>
  );
};

export async function loader() {
  return null;
}

export const Component = RoomPage;
