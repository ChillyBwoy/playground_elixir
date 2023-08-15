import React from "react";
import ReactDOM from "react-dom/client";

import { Canvas } from "../components/Canvas/Canvas"

export const RoomPage: React.FC = () => {
  return (
    <div className="flex bg-yellow-700">
      <div className="bg-slate-100 flex-1">
        <Canvas width={1000} height={1000} />
      </div>
      <section className="bg-slate-500 flex-1" />
    </div>
  );
};

const root = document.getElementById("root");
if (root) {
  ReactDOM.createRoot(root).render(<RoomPage />);
}
