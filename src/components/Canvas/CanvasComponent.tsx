import React from "react";
import { useDrag, useDrop } from "react-dnd";
import styled from "styled-components";
import { ComponentData } from "../../types";
import { Button, Typography } from "antd";

const { Text } = Typography;

const ComponentWrapper = styled.div<{ isSelected: boolean }>`
  position: relative;
  margin: 5px;
  cursor: pointer;
  border: 2px solid ${(props) => (props.isSelected ? "#2196f3" : "transparent")};

  &:hover {
    outline: 1px dashed #9e9e9e;
  }
`;

const ComponentControls = styled.div`
  position: absolute;
  top: -20px;
  right: 0;
  display: flex;
  gap: 5px;
  z-index: 10;
`;

const DeleteButton = styled.button`
  background: #f44336;
  color: white;
  border: none;
  border-radius: 3px;
  width: 20px;
  height: 20px;
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

interface CanvasComponentProps {
  component: ComponentData;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onMove: (dragId: string, hoverId: string) => void;
  components: ComponentData[];
  setComponents: React.Dispatch<React.SetStateAction<ComponentData[]>>;
}

const CanvasComponent: React.FC<CanvasComponentProps> = ({
  component,
  isSelected,
  onSelect,
  onMove,
  components,
  setComponents
}) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "CANVAS_COMPONENT",
    item: { id: component.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    })
  }));

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "CANVAS_COMPONENT",
    hover: (item: { id: string }) => {
      if (item.id !== component.id) {
        onMove(item.id, component.id);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver()
    })
  }));

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setComponents(components.filter((c) => c.id !== component.id));
  };

  const renderComponent = () => {
    switch (component.type) {
      case "Container":
        return (
          <div
            style={{
              width: component.props.width,
              height: component.props.height,
              backgroundColor: component.props.backgroundColor,
              padding: component.props.padding
            }}
          >
            {component.children?.map((child) => (
              <CanvasComponent
                key={child.id}
                component={child}
                isSelected={child.id === isSelected}
                onSelect={onSelect}
                onMove={onMove}
                components={components}
                setComponents={setComponents}
              />
            ))}
          </div>
        );
      case "Text":
        return (
          <Text
            style={{
              fontSize: component.props.fontSize,
              color: component.props.color,
              fontWeight: component.props.fontWeight
            }}
          >
            {component.props.content}
          </Text>
        );
      case "Button":
        return (
          <Button
            type={component.props.type}
            size={component.props.size}
            danger={component.props.danger}
          >
            {component.props.text}
          </Button>
        );
      case "Image":
        return (
          <img
            src={component.props.src}
            alt={component.props.alt}
            style={{
              width: component.props.width,
              height: component.props.height
            }}
          />
        );
      default:
        return <div>未知组件类型: {component.type}</div>;
    }
  };

  return (
    <ComponentWrapper
      ref={(node) => drag(drop(node))}
      isSelected={isSelected}
      onClick={() => onSelect(component.id)}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      {isSelected && (
        <ComponentControls>
          <DeleteButton onClick={handleDelete}>×</DeleteButton>
        </ComponentControls>
      )}
      {renderComponent()}
    </ComponentWrapper>
  );
};

export default CanvasComponent;
