import React from "react";

import { PageLoader } from "./PageLoader";

interface Props {
  children: React.ReactNode;
}

export const LazyRoute: React.FC<Props> = ({ children }) => {
  return <React.Suspense fallback={<PageLoader />}>{children}</React.Suspense>;
};
