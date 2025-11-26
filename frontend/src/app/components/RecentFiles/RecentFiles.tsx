"use client";

import { useState, useRef, useEffect } from "react";
import { mockApi } from "../../services/mockApi";
import { useRouter } from "next/navigation";
import styles from "./RecentFiles.module.css";
import Image from "next/image";

export default function RecentFiles() {
  const router = useRouter();
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [recentItems, setRecentItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; item: any } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadRecentItems();
  }, []);

  // close context menu when clicking anywhere
  useEffect(() => {
    const handleClick = () => setContextMenu(null);
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  const loadRecentItems = async () => {
    try {
      const data = await mockApi.getUserFiles();
      // combine folders and files, take first 5 items
      const combined = [...data.folders.map((f: any) => ({ ...f, type: "folder" })), ...data.files].slice(0, 5);
      setRecentItems(combined);
    } catch (err) {
      console.error("Failed to load recent items:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFolder = async () => {
    if (!folderName.trim()) {
      alert("Please enter a folder name");
      return;
    }

    try {
      const response = await mockApi.createFolder(folderName);
      if (response.success) {
        alert(`Folder "${response.folder.name}" created successfully!`);
        setFolderName("");
        setIsCreatingFolder(false);

        // reload recent items
        await loadRecentItems();
        // refresh the page to show the new folder
        router.refresh();
      }
    } catch (err) {
      console.error("Failed to create folder:", err);
      alert("Failed to create folder. Please try again.");
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      // upload each file
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const response = await mockApi.uploadFile(file);
        if (response.success) {
          console.log(`Uploaded: ${response.file.name} (${response.file.size})`);
        }
      }
      alert(`Successfully uploaded ${files.length} file(s)!`);

      // reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // reload recent items
      await loadRecentItems();
      // refresh the page to show the new files
      router.refresh();
    } catch (err) {
      console.error("Failed to upload files:", err);
      alert("Failed to upload files. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleItemClick = (item: any) => {
    if (item.type === "folder") {
      router.push(`/pages/folder/${item.id}`);
    } else {
      // todo: handle file click (preview, download, etc.)
      console.log("File clicked:", item.name);
    }
  };

  const handleContextMenu = (e: React.MouseEvent, item: any) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ x: e.clientX, y: e.clientY, item });
  };

  const handleDelete = async (item: any) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete "${item.name}"?`);

    if (!confirmDelete) return;

    try {
      const response = await mockApi.deleteItem(item.id, item.type);
      if (response.success) {
        alert(`${item.type === "folder" ? "Folder" : "File"} deleted successfully!`);

        // reload recent items
        await loadRecentItems();
        // refresh the page to update the main file list
        router.refresh();
      }
    } catch (err) {
      console.error("Failed to delete item:", err);
      alert("Failed to delete item. Please try again.");
    }
  };

  // helper function to get file icon based on type
  const getFileIcon = (item: any) => {
    if (item.type === "folder") {
      return <Image src="/folder-icon-purple.png" alt="Folder" width={36} height={36} className={styles.folderIcon} />;
    }

    // file type icons
    switch (item.type) {
      case "audio":
        return <span className={styles.folderIcon}>🎵</span>;
      case "image":
        return <span className={styles.folderIcon}>🖼️</span>;
      case "video":
        return <span className={styles.folderIcon}>🎬</span>;
      case "document":
        return <span className={styles.folderIcon}>📄</span>;
      default:
        return <span className={styles.folderIcon}>📄</span>;
    }
  };

  return (
    <section className={styles.recentSection}>
      <h2 className={styles.sectionTitle}>Recent Files</h2>
      <div className={styles.recentFilesGrid}>
        {loading ? (
          <p style={{ gridColumn: "1 / -1", textAlign: "center", color: "#999" }}>Loading...</p>
        ) : recentItems.length > 0 ? (
          recentItems.map((item) => (
            <div
              key={item.id}
              className={styles.fileCard}
              onClick={() => handleItemClick(item)}
              onContextMenu={(e) => handleContextMenu(e, item)}
            >
              {getFileIcon(item)}
              <p className={styles.fileName}>{item.name}</p>
            </div>
          ))
        ) : (
          <p style={{ gridColumn: "1 / -1", textAlign: "center", color: "#999" }}>No recent files or folders</p>
        )}
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <div
          className={styles.contextMenu}
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className={styles.contextMenuItem}
            onClick={() => {
              handleDelete(contextMenu.item);
              setContextMenu(null);
            }}
          >
            🗑️ Delete
          </button>
        </div>
      )}

      {/* Action Buttons */}
      <div className={styles.actionButtons}>
        {!isCreatingFolder ? (
          <>
            <button className={styles.actionButton} onClick={() => setIsCreatingFolder(true)}>
              Create folder
            </button>
            <button className={styles.actionButtonPrimary} onClick={handleUploadClick} disabled={uploading}>
              {uploading ? "Uploading..." : "Upload"} <span className={styles.uploadIcon}>📤</span>
            </button>
            {/* Hidden file input */}
            <input ref={fileInputRef} type="file" multiple onChange={handleFileChange} style={{ display: "none" }} />
          </>
        ) : (
          /* Create Folder Input */
          <div className={styles.createFolderContainer}>
            <input
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
            <button className={styles.confirmButton} onClick={handleCreateFolder}>
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
    </section>
  );
}
