import { useState, useCallback } from "react";
import { api } from "../services/api";
import toast from "react-hot-toast";

export function useRename() {
  const [renaming, setRenaming] = useState<{
    item: any;
    type: "file" | "folder";
    newName: string;
  } | null>(null);

  const startRename = useCallback((item: any, type: "file" | "folder") => {
    setRenaming({
      item,
      type,
      newName: type === "file" ? item.name : item.name, // use existing name as default
    });
  }, []);

  const cancelRename = useCallback(() => {
    setRenaming(null);
  }, []);

  const updateNewName = useCallback(
    (newName: string) => {
      if (renaming) {
        setRenaming({ ...renaming, newName });
      }
    },
    [renaming]
  );

  const confirmRename = useCallback(
    async (onSuccess?: () => void) => {
      if (!renaming) return;

      if (!renaming.newName.trim()) {
        toast.error("Name cannot be empty");
        return;
      }

      try {
        if (renaming.type === "file") {
          await api.renameFile(renaming.item.id, renaming.newName);
          toast.success("File renamed successfully!");
        } else {
          // todo: add folder rename when implemented
          toast.error("Folder renaming not yet implemented");
          return;
        }

        setRenaming(null);
        if (onSuccess) onSuccess();
      } catch (error: any) {
        console.error("Failed to rename:", error);
        toast.error(error.message || "Failed to rename item");
      }
    },
    [renaming]
  );

  return {
    renaming,
    startRename,
    cancelRename,
    updateNewName,
    confirmRename,
  };
}
