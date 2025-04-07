import React from "react";
import { useDrag, useDrop } from "react-dnd";
import styled from "styled-components";
import { Button, Typography } from "antd";
import { v4 as uuidv4 } from "uuid";
import { ComponentData } from "../../types";

const { Text } = Typography;

const ComponentWrapper = styled.div<{ isSelected: boolean; isOver: boolean }>`
  position: relative;
  margin: 5px;
  cursor: pointer;
  border: 2px solid ${(props) => (props.isSelected ? "#2196f3" : "transparent")};
  background-color: ${(props) =>
    props.isOver ? "rgba(33, 150, 243, 0.1)" : "transparent"};

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
  onMove: (
    dragId: string,
    hoverId: string,
    dropPosition: "inside" | "before" | "after"
  ) => void;
  components: ComponentData[];
  setComponents: React.Dispatch<React.SetStateAction<ComponentData[]>>;
  path: string[];
}

const CanvasComponent: React.FC<CanvasComponentProps> = ({
  component,
  isSelected,
  onSelect,
  onMove,
  components,
  setComponents,
  path
}) => {
  const [{ isDragging }, drag] = useDrag({
    type: "CANVAS_COMPONENT",
    item: {
      id: component.id,
      type: component.type,
      path,
      isContainer: component.isContainer
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  const [{ isOver }, drop] = useDrop({
    accept: ["CANVAS_COMPONENT", "COMPONENT"],
    hover: (item: any, monitor) => {
      const dragPath = item.path;

      // 防止拖拽到自身或其子元素中
      if (dragPath && path.some((id) => dragPath.includes(id))) {
        return;
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      if (!hoverBoundingRect) return;

      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;

      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      let dropPosition: "inside" | "before" | "after" = "inside";

      if (component.isContainer) {
        // 容器组件的放置逻辑
        const thresholdTop = hoverBoundingRect.height * 0.25;
        const thresholdBottom = hoverBoundingRect.height * 0.75;

        if (hoverClientY < thresholdTop) {
          dropPosition = "before";
        } else if (hoverClientY > thresholdBottom) {
          dropPosition = "after";
        } else {
          dropPosition = "inside";
        }
      } else {
        // 非容器组件的放置逻辑
        dropPosition = hoverClientY < hoverMiddleY ? "before" : "after";
      }

      onMove(item.id || uuidv4(), component.id, dropPosition);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true })
    })
  });

  const ref = React.useRef<HTMLDivElement>(null);
  const dragDropRef = drag(drop(ref));

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
                path={[...path, child.id]}
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
      ref={dragDropRef}
      isSelected={isSelected}
      isOver={isOver}
      onClick={() => onSelect(component.id)}
      style={{
        opacity: isDragging ? 0.5 : 1,
        border: isOver ? "2px dashed #2196f3" : undefined
      }}
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
