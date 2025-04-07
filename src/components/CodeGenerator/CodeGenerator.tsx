import React from "react";
import styled from "styled-components";
import { ComponentData } from "../../types";
import { Card, Typography, Button } from "antd";

const { Title, Paragraph } = Typography;

const CodeContainer = styled(Card)`
  margin-top: 20px;
`;

const CodeBlock = styled.pre`
  background-color: #f5f5f5;
  padding: 16px;
  border-radius: 4px;
  overflow-x: auto;
  font-family: "Courier New", Courier, monospace;
  font-size: 14px;
`;

interface CodeGeneratorProps {
  components: ComponentData[];
}

const CodeGenerator: React.FC<CodeGeneratorProps> = ({ components }) => {
  const generateComponentCode = (
    component: ComponentData,
    indent = 2
  ): string => {
    const indentStr = " ".repeat(indent);

    switch (component.type) {
      case "Container":
        const childrenCode =
          component.children && component.children.length > 0
            ? component.children
                .map((child) => generateComponentCode(child, indent + 2))
                .join("\n")
            : "";

        return `${indentStr}<div
${indentStr}  style={{
${indentStr}    width: '${component.props.width}',
${indentStr}    height: '${component.props.height}',
${indentStr}    backgroundColor: '${component.props.backgroundColor}',
${indentStr}    padding: '${component.props.padding}',
${indentStr}  }}
${indentStr}>${
          childrenCode ? "\n" + childrenCode + "\n" + indentStr : ""
        }</div>`;

      case "Text":
        return `${indentStr}<Typography.Text
${indentStr}  style={{
${indentStr}    fontSize: '${component.props.fontSize}',
${indentStr}    color: '${component.props.color}',
${indentStr}    fontWeight: '${component.props.fontWeight}',
${indentStr}  }}
${indentStr}>${component.props.content}</Typography.Text>`;

      case "Button":
        return `${indentStr}<Button
${indentStr}  type="${component.props.type}"
${indentStr}  size="${component.props.size}"
${indentStr}  danger={${component.props.danger}}
${indentStr}>${component.props.text}</Button>`;

      case "Image":
        return `${indentStr}<img
${indentStr}  src="${component.props.src}"
${indentStr}  alt="${component.props.alt}"
${indentStr}  style={{
${indentStr}    width: '${component.props.width}',
${indentStr}    height: '${component.props.height}',
${indentStr}  }}
${indentStr}/>`;

      default:
        return `${indentStr}<!-- Unknown component type: ${component.type} -->`;
    }
  };

  const generateFullCode = (): string => {
    const imports = `import React from 'react';
import { Typography, Button } from 'antd';
import 'antd/dist/antd.css';`;

    const componentCode = components
      .map((comp) => generateComponentCode(comp))
      .join("\n");

    return `${imports}

const GeneratedComponent = () => {
  return (
    <div>
${componentCode}
    </div>
  );
};

export default GeneratedComponent;`;
  };

  const handleCopyCode = () => {
    const code = generateFullCode();
    navigator.clipboard
      .writeText(code)
      .then(() => alert("代码已复制到剪贴板"))
      .catch((err) => console.error("复制失败:", err));
  };

  return (
    <CodeContainer title="生成的代码">
      <Button
        type="primary"
        onClick={handleCopyCode}
        style={{ marginBottom: 16 }}
      >
        复制代码
      </Button>
      <CodeBlock>{generateFullCode()}</CodeBlock>
    </CodeContainer>
  );
};

export default CodeGenerator;
