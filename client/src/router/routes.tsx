import { createBrowserRouter } from "react-router-dom";
import NotFoundPage from "../pages/NotFoundPage";
import HomePage from "../pages/HomePage";

export const router = createBrowserRouter([
  {
    index: true,
    element: <HomePage />,
  },
  {
    path: "/room/:id",
    async lazy() {
      const { Component, loader } = await import("../pages/RoomPage");
      return { Component, loader };
    },
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
