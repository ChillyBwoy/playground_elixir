import styled from "styled-components";
import React from "react";

import Canvas from "../components/Canvas"
import { useSocket } from "../hooks/useSocket";

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

interface AppProps { }

const App: React.FC<AppProps> = () => {
  return (
    <Root>
      <Content>
        <StyledCanvas width={1000} height={1000} />
      </Content>
      <Sidebar />
    </Root>
  );
};

export default App;
