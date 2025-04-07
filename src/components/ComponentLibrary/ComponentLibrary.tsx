import React from "react";
import { useDrag } from "react-dnd";
import styled from "styled-components";
import { componentDefinitions } from "./componentDefinitions";
import { Card, Typography, Row, Col } from "antd";
import {
  ContainerOutlined,
  FontSizeOutlined,
  BorderOutlined,
  PictureOutlined
} from "@ant-design/icons";

const { Title, Text } = Typography;

const LibraryContainer = styled(Card)`
  height: 100%;
  overflow-y: auto;
`;

const ComponentItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  margin-bottom: 8px;
  cursor: move;
  transition: all 0.2s;

  &:hover {
    background-color: #f5f5f5;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

interface DraggableComponentProps {
  type: string;
  name: string;
  icon: string;
  defaultProps: Record<string, any>;
  isContainer?: boolean;
}

const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case "container":
      return <ContainerOutlined />;
    case "font-size":
      return <FontSizeOutlined />;
    case "button":
      return <BorderOutlined />;
    case "picture":
      return <PictureOutlined />;
    default:
      return <ContainerOutlined />;
  }
};

const DraggableComponent: React.FC<DraggableComponentProps> = ({
  type,
  name,
  icon,
  defaultProps,
  isContainer
}) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "COMPONENT",
    item: { type, defaultProps, isContainer },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    })
  }));

  return (
    <ComponentItem ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }}>
      {getIconComponent(icon)}
      <Text style={{ marginTop: 8 }}>{name}</Text>
    </ComponentItem>
  );
};

const ComponentLibrary: React.FC = () => {
  return (
    <LibraryContainer title="组件库">
      <Row gutter={[16, 16]}>
        {componentDefinitions.map((component) => (
          <Col span={12} key={component.type}>
            <DraggableComponent
              type={component.type}
              name={component.name}
              icon={component.icon}
              defaultProps={component.defaultProps}
              isContainer={component.isContainer}
            />
          </Col>
        ))}
      </Row>
    </LibraryContainer>
  );
};

export default ComponentLibrary;
