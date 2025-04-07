import { ComponentDefinition } from "../../types";

export const componentDefinitions: ComponentDefinition[] = [
  {
    type: "Container",
    name: "容器",
    icon: "container",
    defaultProps: {
      width: "100%",
      height: "200px",
      backgroundColor: "#f5f5f5",
      padding: "10px"
    },
    propDefinitions: [
      { name: "width", label: "宽度", type: "string", defaultValue: "100%" },
      { name: "height", label: "高度", type: "string", defaultValue: "200px" },
      {
        name: "backgroundColor",
        label: "背景色",
        type: "color",
        defaultValue: "#f5f5f5"
      },
      { name: "padding", label: "内边距", type: "string", defaultValue: "10px" }
    ]
  },
  {
    type: "Text",
    name: "文本",
    icon: "font-size",
    defaultProps: {
      content: "文本内容",
      fontSize: "16px",
      color: "#000000",
      fontWeight: "normal"
    },
    propDefinitions: [
      {
        name: "content",
        label: "内容",
        type: "string",
        defaultValue: "文本内容"
      },
      {
        name: "fontSize",
        label: "字体大小",
        type: "string",
        defaultValue: "16px"
      },
      { name: "color", label: "颜色", type: "color", defaultValue: "#000000" },
      {
        name: "fontWeight",
        label: "字重",
        type: "select",
        options: ["normal", "bold"],
        defaultValue: "normal"
      }
    ]
  },
  {
    type: "Button",
    name: "按钮",
    icon: "button",
    defaultProps: {
      text: "按钮",
      type: "primary",
      size: "middle",
      danger: false
    },
    propDefinitions: [
      { name: "text", label: "文本", type: "string", defaultValue: "按钮" },
      {
        name: "type",
        label: "类型",
        type: "select",
        options: ["primary", "default", "dashed", "link", "text"],
        defaultValue: "primary"
      },
      {
        name: "size",
        label: "大小",
        type: "select",
        options: ["large", "middle", "small"],
        defaultValue: "middle"
      },
      {
        name: "danger",
        label: "危险按钮",
        type: "boolean",
        defaultValue: false
      }
    ]
  },
  {
    type: "Image",
    name: "图片",
    icon: "picture",
    defaultProps: {
      src: "https://via.placeholder.com/150",
      alt: "图片",
      width: "150px",
      height: "auto"
    },
    propDefinitions: [
      {
        name: "src",
        label: "图片地址",
        type: "string",
        defaultValue: "https://via.placeholder.com/150"
      },
      { name: "alt", label: "替代文本", type: "string", defaultValue: "图片" },
      { name: "width", label: "宽度", type: "string", defaultValue: "150px" },
      { name: "height", label: "高度", type: "string", defaultValue: "auto" }
    ]
  }
];
