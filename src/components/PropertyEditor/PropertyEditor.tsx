import React from "react";
import styled from "styled-components";
import { ComponentData } from "../../types";
import { componentDefinitions } from "../ComponentLibrary/componentDefinitions";
import {
  Card,
  Typography,
  Input,
  Select,
  Form,
  Switch,
  Space,
  Divider
} from "antd";

const { Title, Text } = Typography;
const { Option } = Select;

const EditorContainer = styled(Card)`
  height: 100%;
  overflow-y: auto;
`;

const PropertyGroup = styled.div`
  margin-bottom: 16px;
`;

interface PropertyEditorProps {
  selectedComponent: ComponentData | null;
  components: ComponentData[];
  setComponents: React.Dispatch<React.SetStateAction<ComponentData[]>>;
}

const PropertyEditor: React.FC<PropertyEditorProps> = ({
  selectedComponent,
  components,
  setComponents
}) => {
  if (!selectedComponent) {
    return (
      <EditorContainer title="属性编辑器">
        <Text type="secondary">请选择一个组件来编辑其属性</Text>
      </EditorContainer>
    );
  }

  const componentDefinition = componentDefinitions.find(
    (def) => def.type === selectedComponent.type
  );

  if (!componentDefinition) {
    return (
      <EditorContainer title="属性编辑器">
        <Text type="danger">未找到组件定义: {selectedComponent.type}</Text>
      </EditorContainer>
    );
  }

  const handlePropertyChange = (propName: string, value: any) => {
    if (!selectedComponent) return;

    setComponents((prevComponents) => {
      const updateComponentInTree = (
        comps: ComponentData[]
      ): ComponentData[] => {
        return comps.map((comp) => {
          if (comp.id === selectedComponent.id) {
            return {
              ...comp,
              props: {
                ...comp.props,
                [propName]: value
              }
            };
          }
          if (comp.children?.length > 0) {
            return {
              ...comp,
              children: updateComponentInTree(comp.children)
            };
          }
          return comp;
        });
      };

      return updateComponentInTree(prevComponents);
    });
  };

  const renderPropertyEditor = (propDef: any) => {
    const value = selectedComponent.props[propDef.name];

    switch (propDef.type) {
      case "string":
        return (
          <Form.Item label={propDef.label} style={{ marginBottom: 12 }}>
            <Input
              value={value || ""}
              onChange={(e) =>
                handlePropertyChange(propDef.name, e.target.value)
              }
              size="small"
            />
          </Form.Item>
        );
      case "number":
        return (
          <Form.Item label={propDef.label} style={{ marginBottom: 12 }}>
            <Input
              type="number"
              value={value || 0}
              onChange={(e) =>
                handlePropertyChange(propDef.name, Number(e.target.value))
              }
              size="small"
            />
          </Form.Item>
        );
      case "boolean":
        return (
          <Form.Item label={propDef.label} style={{ marginBottom: 12 }}>
            <Switch
              checked={Boolean(value)}
              onChange={(checked) =>
                handlePropertyChange(propDef.name, checked)
              }
            />
          </Form.Item>
        );
      case "select":
        return (
          <Form.Item label={propDef.label} style={{ marginBottom: 12 }}>
            <Select
              value={value || ""}
              onChange={(value) => handlePropertyChange(propDef.name, value)}
              style={{ width: "100%" }}
              size="small"
            >
              {propDef.options?.map((option: string) => (
                <Option key={option} value={option}>
                  {option}
                </Option>
              ))}
            </Select>
          </Form.Item>
        );
      case "color":
        return (
          <Form.Item label={propDef.label} style={{ marginBottom: 12 }}>
            <Space>
              <input
                type="color"
                value={value || "#000000"}
                onChange={(e) =>
                  handlePropertyChange(propDef.name, e.target.value)
                }
                style={{ width: 40, height: 24, padding: 0, border: "none" }}
              />
              <Input
                value={value || ""}
                onChange={(e) =>
                  handlePropertyChange(propDef.name, e.target.value)
                }
                size="small"
                style={{ width: 120 }}
              />
            </Space>
          </Form.Item>
        );
      default:
        return <Text>不支持的属性类型: {propDef.type}</Text>;
    }
  };

  return (
    <EditorContainer title="属性编辑器">
      <Title level={5}>{componentDefinition.name}</Title>

      <PropertyGroup>
        <Divider orientation="left">基本属性</Divider>
        <Form layout="vertical" size="small">
          {componentDefinition.propDefinitions.map((propDef) => (
            <div key={propDef.name}>{renderPropertyEditor(propDef)}</div>
          ))}
        </Form>
      </PropertyGroup>
    </EditorContainer>
  );
};

export default PropertyEditor;
