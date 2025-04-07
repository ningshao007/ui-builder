import React from "react";
import { Button, Space, Upload, message } from "antd";
import { SaveOutlined, UploadOutlined, EyeOutlined } from "@ant-design/icons";
import styled from "styled-components";

const ToolbarContainer = styled.div`
  padding: 8px 16px;
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 16px;
`;

interface ToolbarProps {
  onSave: () => void;
  onLoad: (jsonString: string) => boolean;
  onPreview: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ onSave, onLoad, onPreview }) => {
  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const success = onLoad(content);
      if (success) {
        message.success("项目加载成功");
      } else {
        message.error("项目加载失败");
      }
    };
    reader.readAsText(file);
    return false;
  };

  return (
    <ToolbarContainer>
      <Space>
        <Button icon={<SaveOutlined />} type="primary" onClick={onSave}>
          保存
        </Button>
        <Upload
          beforeUpload={handleFileUpload}
          showUploadList={false}
          accept=".json"
        >
          <Button icon={<UploadOutlined />}>加载</Button>
        </Upload>
        <Button icon={<EyeOutlined />} onClick={onPreview}>
          预览
        </Button>
      </Space>
    </ToolbarContainer>
  );
};

export default Toolbar;
