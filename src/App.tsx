import React, { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import styled from "styled-components";
import { Row, Col, Layout, Typography } from "antd";
import ComponentLibrary from "./components/ComponentLibrary/ComponentLibrary";
import Canvas from "./components/Canvas/Canvas";
import PropertyEditor from "./components/PropertyEditor/PropertyEditor";
import { ComponentData } from "./types";

const { Header, Content } = Layout;
const { Title } = Typography;

const AppContainer = styled(Layout)`
  min-height: 100vh;
`;

const HeaderStyled = styled(Header)`
  background-color: #fff;
  border-bottom: 1px solid #f0f0f0;
  padding: 0 24px;
  display: flex;
  align-items: center;
`;

const ContentStyled = styled(Content)`
  padding: 24px;
`;

const App: React.FC = () => {
  const [components, setComponents] = useState<ComponentData[]>([]);
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(
    null
  );

  const selectedComponent =
    components.find((c) => c.id === selectedComponentId) || null;

  return (
    <DndProvider backend={HTML5Backend}>
      <AppContainer>
        <HeaderStyled>
          <Title level={3} style={{ margin: 0 }}>
            React UI Builder
          </Title>
        </HeaderStyled>
        <ContentStyled>
          <Row gutter={[24, 24]}>
            <Col span={6}>
              <ComponentLibrary />
            </Col>
            <Col span={12}>
              <Canvas
                components={components}
                setComponents={setComponents}
                selectedComponentId={selectedComponentId}
                setSelectedComponentId={setSelectedComponentId}
              />
            </Col>
            <Col span={6}>
              <PropertyEditor
                selectedComponent={selectedComponent}
                components={components}
                setComponents={setComponents}
              />
            </Col>
          </Row>
        </ContentStyled>
      </AppContainer>
    </DndProvider>
  );
};

export default App;
