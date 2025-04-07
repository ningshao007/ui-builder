export interface ComponentData {
  id: string;
  type: string;
  props: Record<string, any>;
  children: ComponentData[];
  parent?: string;
  path: string[]; // 组件在树中的路径
  isContainer?: boolean; // 标识是否可以包含其他组件
}

export interface ComponentDefinition {
  type: string;
  name: string;
  icon: string;
  isContainer?: boolean; // 添加这个属性
  defaultProps: Record<string, any>;
  propDefinitions: PropDefinition[];
}

export interface PropDefinition {
  name: string;
  label: string;
  type: "string" | "number" | "boolean" | "select" | "color";
  options?: string[]; // 用于select类型
  defaultValue?: any;
}
