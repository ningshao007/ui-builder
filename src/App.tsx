import React, { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import styled from "styled-components";
import { Row, Col, Layout, Typography } from "antd";
import ComponentLibrary from "./components/ComponentLibrary/ComponentLibrary";
import Canvas from "./components/Canvas/Canvas";
import PropertyEditor from "./components/PropertyEditor/PropertyEditor";
import { ComponentData } from "./types";
import Toolbar from "./components/Toolbar/Toolbar";
import { useProjectState } from "./hooks/useProjectState";

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
  const { components, setComponents, saveProject, loadProject } =
    useProjectState();
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(
    null
  );
  const [isPreview, setIsPreview] = useState(false);

  // 深度查找选中的组件
  const findSelectedComponent = (
    components: ComponentData[],
    id: string | null
  ): ComponentData | null => {
    if (!id) return null;

    for (const comp of components) {
      if (comp.id === id) {
        return comp;
      }
      if (comp.children?.length > 0) {
        const found = findSelectedComponent(comp.children, id);
        if (found) {
          return found;
        }
      }
    }
    return null;
  };

  const selectedComponent = findSelectedComponent(
    components,
    selectedComponentId
  );

  const handlePreview = () => {
    setIsPreview(!isPreview);
    setSelectedComponentId(null);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <AppContainer>
        <HeaderStyled>
          <Title level={3} style={{ margin: 0 }}>
            React UI Builder
          </Title>
        </HeaderStyled>
        <ContentStyled>
          <Toolbar
            onSave={saveProject}
            onLoad={loadProject}
            onPreview={handlePreview}
          />
          <Row gutter={[24, 24]}>
            {!isPreview && (
              <Col span={6}>
                <ComponentLibrary />
              </Col>
            )}
            <Col span={isPreview ? 24 : 12}>
              <Canvas
                components={components}
                setComponents={setComponents}
                selectedComponentId={selectedComponentId}
                setSelectedComponentId={setSelectedComponentId}
                isPreview={isPreview}
              />
            </Col>
            {!isPreview && (
              <Col span={6}>
                <PropertyEditor
                  selectedComponent={selectedComponent}
                  components={components}
                  setComponents={setComponents}
                />
              </Col>
            )}
          </Row>
        </ContentStyled>
      </AppContainer>
    </DndProvider>
  );
};

export default App;
