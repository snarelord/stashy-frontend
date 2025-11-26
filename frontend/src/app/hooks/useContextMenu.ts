import { useState, useCallback, useEffect } from "react";

export function useContextMenu() {
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    item: any;
    type: "file" | "folder";
  } | null>(null);

  const handleContextMenu = useCallback(function (e: React.MouseEvent, item: any, type: "file" | "folder") {
    e.preventDefault();
    e.stopPropagation();

    console.log("Context menu opened for:", type, item.name);

    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      item,
      type, // Make sure type is being set!
    });
  }, []);

  // Close context menu when clicking anywhere
  useEffect(
    function () {
      const handleClick = function () {
        if (contextMenu) {
        }
        setContextMenu(null);
      };

      document.addEventListener("click", handleClick);

      return function () {
        document.removeEventListener("click", handleClick);
      };
    },
    [contextMenu]
  );

  return {
    contextMenu,
    setContextMenu,
    handleContextMenu,
  };
}
