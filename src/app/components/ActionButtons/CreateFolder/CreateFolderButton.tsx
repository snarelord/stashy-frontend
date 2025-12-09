import styles from "./CreateFolderButton.module.css";
import { useState, useRef } from "react";
import { api } from "../../../services/api";
import toast from "react-hot-toast";

export default function CreateFolderButton() {
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [recentItems, setRecentItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  async function loadRecentItems() {
    try {
      const foldersResponse = await api.getFolders();
      const folders = (foldersResponse.folders || []).map((f: any) => ({
        ...f,
        type: "folder",
        createdAt: f.createdAt || Date.now(),
      }));
      // sort by createdAt descending and take up to 5
      // todo: only show folders not subfolders
      const recentFolders = folders.sort((a: any, b: any) => b.createdAt - a.createdAt).slice(0, 5);
      setRecentItems(recentFolders);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateFolder() {
    if (!folderName.trim()) {
      toast.error("Please enter a folder name");
      return;
    }

    try {
      const response = await api.createFolder(folderName);
      if (response.success) {
        toast.success(`Folder "${response.folder.name}" created successfully!`);
        setFolderName("");
        setIsCreatingFolder(false);

        await loadRecentItems();
        window.dispatchEvent(new Event("refreshDashboard"));
      }
    } catch (err) {
      console.error("Failed to create folder:", err);
      toast.error("Failed to create folder. Please try again.");
    }
  }

  function handleUploadClick() {
    fileInputRef.current?.click();
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadProgress(0);
    setUploading(true);

    try {
      const totalFiles = files.length;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const response = await api.uploadFile(file);

        const progress = ((i + 1) / totalFiles) * 100;
        setUploadProgress(progress);
        if (response.success) {
        }
      }
      toast.success(`Successfully uploaded ${files.length} file(s)!`);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      await loadRecentItems();

      window.dispatchEvent(new Event("refreshDashboard"));
    } catch (err) {
      console.error("Failed to upload files:", err);
      toast.error("Failed to upload files. Please try again.");
    } finally {
      setUploading(false);
      setUploadProgress(0);
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
            {uploading ? (
              <>
                <span className={styles.uploadingText}>Uploading...</span>
                <div className={styles.progressCircle}>
                  <svg width="20" height="20" viewBox="0 0 20 20">
                    <circle cx="10" cy="10" r="8" fill="none" stroke="#e0e0e0" strokeWidth="2" />
                    <circle
                      cx="10"
                      cy="10"
                      r="8"
                      fill="none"
                      stroke="#fff"
                      strokeWidth="2"
                      strokeDasharray={`${2 * Math.PI * 8}`}
                      strokeDashoffset={`${2 * Math.PI * 8 * (1 - uploadProgress / 100)}`}
                      strokeLinecap="round"
                      transform="rotate(-90 10 10)"
                      style={{ transition: "stroke-dashoffset 0.3s ease" }}
                    />
                  </svg>
                  <span className={styles.progressText}>{Math.round(uploadProgress)}%</span>
                </div>
              </>
            ) : (
              <>Upload</>
            )}
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
