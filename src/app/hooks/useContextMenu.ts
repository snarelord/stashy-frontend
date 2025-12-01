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

    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      item,
      type,
    });
  }, []);

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
