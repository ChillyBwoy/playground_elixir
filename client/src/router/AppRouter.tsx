import React from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { PageLoader } from "../components/PageLoader";

const AppRouter: React.FC = () => {
  return <RouterProvider router={router} fallbackElement={<PageLoader />} />;
};

export default AppRouter;
