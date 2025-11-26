import { useState, useCallback } from "react";
import { mockApi } from "../services/mockApi";

export function useFileOperations() {
  const [loading, setLoading] = useState(true);

  const handleDelete = useCallback(async function (item: any, type: "file" | "folder", onSuccess?: () => void) {
    const confirmDelete = window.confirm(`Are you sure you want to delete "${item.name}"?`);

    if (!confirmDelete) return;

    try {
      const response = await mockApi.deleteItem(item.id, type);
      if (response.success) {
        alert(`${type === "folder" ? "Folder" : "File"} deleted successfully!`);
        if (onSuccess) onSuccess();
      }
    } catch (err) {
      console.error("Failed to delete item:", err);
      alert("Failed to delete item. Please try again.");
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
        const response = await mockApi.uploadFile(file, folderId);
        if (response.success) {
          console.log(`Uploaded: ${response.file.name} (${response.file.size})`);
        }
      }
      const folderName = folderId ? "folder" : "files";
      alert(`Successfully uploaded ${files.length} file(s) to ${folderName}!`);

      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Failed to upload files:", err);
      alert("Failed to upload files. Please try again.");
    }
  },
  []);

  const handleCreateFolder = useCallback(async function (
    folderName: string,
    parentId: string | undefined,
    onSuccess?: () => void
  ) {
    if (!folderName.trim()) {
      alert("Please enter a folder name");
      return;
    }

    try {
      const response = await mockApi.createFolder(folderName, parentId);
      if (response.success) {
        const message = parentId
          ? `Subfolder "${response.folder.name}" created successfully!`
          : `Folder "${response.folder.name}" created successfully!`;
        alert(message);

        if (onSuccess) onSuccess();
      }
    } catch (err) {
      console.error("Failed to create folder:", err);
      alert("Failed to create folder. Please try again.");
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
