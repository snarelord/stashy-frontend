import { useState, useEffect } from "react";

interface ContextMenuItem {
  x: number;
  y: number;
  item: any;
  type?: "file" | "folder";
}

export function useContextMenu() {
  const [contextMenu, setContextMenu] = useState<ContextMenuItem | null>(null);

  useEffect(function () {
    const handleClick = function () {
      setContextMenu(null);
    };
    document.addEventListener("click", handleClick);
    return function () {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  const handleContextMenu = function (e: React.MouseEvent, item: any, type?: "file" | "folder") {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      item: type ? { ...item, type } : item,
    });
  };

  return {
    contextMenu,
    setContextMenu,
    handleContextMenu,
  };
}
