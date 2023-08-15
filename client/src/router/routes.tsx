import { createBrowserRouter } from "react-router-dom";
import DefaultLayout from "../layouts/DefaultLayout";
import NotFoundPage from "../pages/NotFoundPage";
import HomePage from "../pages/HomePage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <DefaultLayout />,
    children: [
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
    ],
  },
]);
