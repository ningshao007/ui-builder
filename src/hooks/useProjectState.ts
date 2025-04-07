import { useState, useCallback } from "react";
import { ComponentData } from "../types";

export const useProjectState = () => {
  const [components, setComponents] = useState<ComponentData[]>([]);

  const saveProject = useCallback(() => {
    const projectData = {
      components,
      version: "1.0"
    };
    const jsonString = JSON.stringify(projectData);

    // Save to localStorage
    localStorage.setItem("ui-builder-project", jsonString);

    // Also allow download as file
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ui-builder-project.json";
    a.click();
    URL.revokeObjectURL(url);
  }, [components]);

  const loadProject = useCallback((jsonString: string) => {
    try {
      const projectData = JSON.parse(jsonString);
      if (projectData.components) {
        setComponents(projectData.components);
        return true;
      }
    } catch (error) {
      console.error("Failed to load project:", error);
    }
    return false;
  }, []);

  return {
    components,
    setComponents,
    saveProject,
    loadProject
  };
};
