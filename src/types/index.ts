export interface ComponentData {
  id: string;
  type: string;
  props: Record<string, any>;
  children?: ComponentData[];
  parent?: string;
}

export interface ComponentDefinition {
  type: string;
  name: string;
  icon: string;
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
