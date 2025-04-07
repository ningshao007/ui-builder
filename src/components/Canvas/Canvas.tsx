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
  isPreview?: boolean;
}

const Canvas: React.FC<CanvasProps> = ({
  components,
  setComponents,
  selectedComponentId,
  setSelectedComponentId,
  isPreview
}) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ["COMPONENT", "CANVAS_COMPONENT"],
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
        children: [],
        path: [],
        isContainer: item.type === "Container"
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

  const handleComponentMove = (
    dragId: string,
    hoverId: string,
    dropPosition: "inside" | "before" | "after"
  ) => {
    setComponents((prevComponents) => {
      const newComponents = JSON.parse(JSON.stringify(prevComponents));

      // 查找要移动的组件和目标组件
      const findComponent = (
        comps: ComponentData[],
        id: string
      ): [ComponentData | null, ComponentData[] | null] => {
        for (let i = 0; i < comps.length; i++) {
          if (comps[i].id === id) {
            const [comp] = comps.splice(i, 1);
            return [comp, comps];
          }
          if (comps[i].children) {
            const [found, parent] = findComponent(comps[i].children, id);
            if (found) {
              return [found, parent];
            }
          }
        }
        return [null, null];
      };

      const [dragComponent] = findComponent(newComponents, dragId);
      if (!dragComponent) return prevComponents;

      const insertComponent = (
        comps: ComponentData[],
        id: string,
        component: ComponentData,
        position: "inside" | "before" | "after"
      ) => {
        for (let i = 0; i < comps.length; i++) {
          if (comps[i].id === id) {
            if (position === "inside" && comps[i].isContainer) {
              comps[i].children.push({ ...component, parent: comps[i].id });
              return true;
            } else if (position === "before") {
              comps.splice(i, 0, component);
              return true;
            } else if (position === "after") {
              comps.splice(i + 1, 0, component);
              return true;
            }
          }
          if (
            comps[i].children &&
            insertComponent(comps[i].children, id, component, position)
          ) {
            return true;
          }
        }
        return false;
      };

      insertComponent(newComponents, hoverId, dragComponent, dropPosition);
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
              selectedComponentId={selectedComponentId} // 正确传递类型
              onSelect={handleComponentSelect}
              onMove={handleComponentMove}
              components={components}
              setComponents={setComponents}
              path={[component.id]}
            />
          ))
        )}
      </CanvasContainer>
    </div>
  );
};

export default Canvas;
