import styled from "styled-components";
import React from "react";
import ReactDOM from "react-dom/client";

import { Canvas } from "../components/Canvas/Canvas"

const Root = styled.section`
  display: flex;
  height: 100%;
`;

const Content = styled.section`
  background-color: #333;
  flex: 1
`;

const Sidebar = styled.section`
  width: 200px;
  background: #b0b0b0;
`;

const StyledCanvas = styled(Canvas)`
  flex: 1;
`

const App: React.FC = () => {
  return (
    <Root>
      <Content>
        <StyledCanvas width={1000} height={1000} />
      </Content>
      <Sidebar />
    </Root>
  );
};

const root = document.getElementById("root");
if (root) {
  ReactDOM.createRoot(root).render(<App />);
}
