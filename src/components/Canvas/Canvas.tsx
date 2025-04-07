import React, { useState } from "react";
import { useDrop } from "react-dnd";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";
import { ComponentData } from "../../types";
import CanvasComponent from "./CanvasComponent";
import { Card, Typography, Empty } from "antd";

const { Title, Text } = Typography;

const CanvasContainer = styled(Card)`
  min-height: 600px;
  position: relative;
  background-color: #fafafa;
  border: 2px dashed #e0e0e0;
`;

const EmptyCanvas = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 400px;
  color: #9e9e9e;
`;

interface CanvasProps {
  components: ComponentData[];
  setComponents: React.Dispatch<React.SetStateAction<ComponentData[]>>;
  selectedComponentId: string | null;
  setSelectedComponentId: React.Dispatch<React.SetStateAction<string | null>>;
}

const Canvas: React.FC<CanvasProps> = ({
  components,
  setComponents,
  selectedComponentId,
  setSelectedComponentId
}) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "COMPONENT",
    drop: (
      item: { type: string; defaultProps: Record<string, any> },
      monitor
    ) => {
      if (monitor.didDrop()) {
        return;
      }

      const newComponent: ComponentData = {
        id: uuidv4(),
        type: item.type,
        props: { ...item.defaultProps },
        children: []
      };

      setComponents((prev) => [...prev, newComponent]);
      return { id: newComponent.id };
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver({ shallow: true })
    })
  }));

  const handleComponentSelect = (id: string) => {
    setSelectedComponentId(id);
  };

  const handleComponentMove = (dragId: string, hoverId: string) => {
    setComponents((prevComponents) => {
      const dragIndex = prevComponents.findIndex((c) => c.id === dragId);
      const hoverIndex = prevComponents.findIndex((c) => c.id === hoverId);

      if (dragIndex === -1 || hoverIndex === -1) return prevComponents;

      const newComponents = [...prevComponents];
      const [removed] = newComponents.splice(dragIndex, 1);
      newComponents.splice(hoverIndex, 0, removed);

      return newComponents;
    });
  };

  return (
    <div>
      <Title level={4}>画布</Title>
      <CanvasContainer
        ref={drop}
        style={{
          backgroundColor: isOver ? "#f0f7ff" : "#fafafa",
          borderColor: isOver ? "#2196f3" : "#e0e0e0"
        }}
      >
        {components.length === 0 ? (
          <EmptyCanvas>
            <Text>拖拽组件到这里</Text>
            <Text type="secondary">从左侧组件库中选择组件</Text>
          </EmptyCanvas>
        ) : (
          components.map((component) => (
            <CanvasComponent
              key={component.id}
              component={component}
              isSelected={component.id === selectedComponentId}
              onSelect={handleComponentSelect}
              onMove={handleComponentMove}
              components={components}
              setComponents={setComponents}
            />
          ))
        )}
      </CanvasContainer>
    </div>
  );
};

export default Canvas;
