import styles from "./CreateFolderButton.module.css";
import { useState, useRef } from "react";
import { api } from "../../../services/api";

export default function CreateFolderButton() {
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [recentItems, setRecentItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function loadRecentItems() {
    try {
      const foldersResponse = await api.getFolders();
      const folders = (foldersResponse.folders || []).map((f: any) => ({
        ...f,
        type: "folder",
        createdAt: f.createdAt || Date.now(),
      }));
      // sort by createdAt descending and take up to 5
      const recentFolders = folders.sort((a: any, b: any) => b.createdAt - a.createdAt).slice(0, 5);
      setRecentItems(recentFolders);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateFolder() {
    if (!folderName.trim()) {
      alert("Please enter a folder name");
      return;
    }

    try {
      const response = await api.createFolder(folderName);
      if (response.success) {
        alert(`Folder "${response.folder.name}" created successfully!`);
        setFolderName("");
        setIsCreatingFolder(false);

        await loadRecentItems();
        window.dispatchEvent(new Event("refreshDashboard"));
      }
    } catch (err) {
      console.error("Failed to create folder:", err);
      alert("Failed to create folder. Please try again.");
    }
  }

  function handleUploadClick() {
    fileInputRef.current?.click();
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      // Upload each file
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const response = await api.uploadFile(file);
        if (response.success) {
        }
      }
      alert(`Successfully uploaded ${files.length} file(s)!`);

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Reload recent items
      await loadRecentItems();

      // Trigger dashboard refresh
      window.dispatchEvent(new Event("refreshDashboard"));
    } catch (err) {
      console.error("Failed to upload files:", err);
      alert("Failed to upload files. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className={styles.actionButtons}>
      {!isCreatingFolder ? (
        <>
          <button name="create-folder-button" className={styles.actionButton} onClick={() => setIsCreatingFolder(true)}>
            Create folder
          </button>
          <button
            name="upload-button"
            className={styles.actionButtonPrimary}
            onClick={handleUploadClick}
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Upload"} <span className={styles.uploadIcon}>📤</span>
          </button>
          <input
            name="file-input"
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </>
      ) : (
        <div className={styles.createFolderContainer}>
          <input
            name="folder-input"
            type="text"
            placeholder="Enter folder name..."
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") handleCreateFolder();
            }}
            className={styles.folderInput}
            autoFocus
          />
          <button name="confirm-create" className={styles.confirmButton} onClick={handleCreateFolder}>
            Create
          </button>
          <button
            className={styles.cancelButton}
            onClick={() => {
              setIsCreatingFolder(false);
              setFolderName("");
            }}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
