import { useState, useCallback } from "react";
import { api } from "../services/api";
import toast from "react-hot-toast";

export function useFileOperations() {
  const [loading, setLoading] = useState(true);

  const handleDelete = useCallback(async function (item: any, type: "file" | "folder", onSuccess?: () => void) {
    const confirmDelete = window.confirm(`Are you sure you want to delete "${item.name}"?`);

    if (!confirmDelete) return;

    try {
      if (type === "folder") {
        await api.deleteFolder(item.id);
      } else {
        await api.deleteFile(item.id);
      }

      toast.success(`${type === "folder" ? "Folder" : "File"} deleted successfully!`);

      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(`Failed to delete ${type}:`, err);
      toast.error(`Failed to delete ${type}. Please try again.`);
    }
  }, []);

  const handleUpload = useCallback(async function (
    files: FileList | null,
    folderId: string | undefined,
    onSuccess?: () => void
  ) {
    if (!files || files.length === 0) return;

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const response = await api.uploadFile(file, folderId);
        if (response.success) {
        }
      }
      const folderName = folderId ? "folder" : "files";
      toast.success(`Successfully uploaded ${files.length} file(s) to ${folderName}!`);

      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Failed to upload files:", err);
      toast.error("Failed to upload files. Please try again.");
    }
  },
  []);

  const handleCreateFolder = useCallback(async function (
    folderName: string,
    parentId: string | undefined,
    onSuccess?: () => void
  ) {
    if (!folderName.trim()) {
      toast.error("Please enter a folder name");
      return;
    }

    try {
      const response = await api.createFolder(folderName, parentId);
      if (response.success) {
        const message = parentId
          ? `Subfolder "${response.folder.name}" created successfully!`
          : `Folder "${response.folder.name}" created successfully!`;
        toast.success(message);

        if (onSuccess) onSuccess();
      }
    } catch (err) {
      console.error("Failed to create folder:", err);
      toast.error("Failed to create folder. Please try again.");
    }
  },
  []);

  return {
    loading,
    setLoading,
    handleDelete,
    handleUpload,
    handleCreateFolder,
  };
}
