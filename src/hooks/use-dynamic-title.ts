import { useEffect } from "react";

interface Tool {
  id: string;
  name: string;
  category: string;
  description: string;
}

interface UseDynamicTitleProps {
  currentTool: Tool | undefined;
  selectedCategory: string;
  baseTitle?: string;
}

export function useDynamicTitle({
  currentTool,
  selectedCategory,
  baseTitle = "ToolifyLab",
}: UseDynamicTitleProps) {
  useEffect(() => {
    let title: string;

    if (currentTool) {
      title = `${currentTool.name} - ${currentTool.category} | ${baseTitle}`;
    } else if (selectedCategory !== "All Tools") {
      title = `${selectedCategory} Tools - ${baseTitle}`;
    } else {
      title = `${baseTitle} - All-in-One Utility Collection`;
    }

    document.title = title;

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      if (currentTool) {
        metaDescription.setAttribute("content", currentTool.description);
      } else {
        metaDescription.setAttribute(
          "content",
          "Professional Calculator Suite with financial, health, math, and conversion tools. Free online calculators for everyday use."
        );
      }
    }
  }, [currentTool, selectedCategory, baseTitle]);
}
