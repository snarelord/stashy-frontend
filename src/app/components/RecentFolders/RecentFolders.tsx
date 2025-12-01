"use client";

import styles from "./RecentFolders.module.css";
import { useState, useRef, useEffect } from "react";
import { api } from "../../services/api";
import { useRouter } from "next/navigation";
import Image from "next/image";
import AudioIcon from "../Icons/AudioIcon/AudioIcon";
import ImageIcon from "../Icons/ImageIcon/ImageIcon";
import VideoIcon from "../Icons/VideoIcon/VideoIcon";
import FileIcon from "../Icons/FileIcon/FileIcon";
import ContextMenu from "../ContextMenu/ContextMenu";

export default function RecentFolders() {
  const router = useRouter();
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [recentItems, setRecentItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; item: any; type: "file" | "folder" } | null>(
    null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(function () {
    loadRecentItems();

    const handleRefresh = function () {
      loadRecentItems();
    };

    window.addEventListener("refreshDashboard", handleRefresh);

    return function () {
      window.removeEventListener("refreshDashboard", handleRefresh);
    };
  }, []);

  // close context menu when clicking anywhere
  useEffect(function () {
    const handleClick = function () {
      setContextMenu(null);
    };
    document.addEventListener("click", handleClick);
    return function () {
      document.removeEventListener("click", handleClick);
    };
  }, []);

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

        // Reload recent items
        await loadRecentItems();

        // Trigger dashboard refresh by dispatching custom event
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

  function handleItemClick(item: any) {
    if (item.type === "folder") {
      router.push(`/pages/folder/${item.id}`);
    } else {
      // todo: handle file click (preview, download, etc.)
      console.log("File clicked:", item.name);
    }
  }

  function handleContextMenu(e: React.MouseEvent, item: any, type: "file" | "folder") {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ x: e.clientX, y: e.clientY, item, type });
  }

  async function handleDelete(item: any, type: "file" | "folder") {
    const confirmDelete = window.confirm(`Are you sure you want to delete "${item.name}"?`);

    if (!confirmDelete) return;

    try {
      if (type === "folder") {
        await api.deleteFolder(item.id);
      } else {
        await api.deleteFile(item.id);
      }

      alert(`${type === "folder" ? "Folder" : "File"} deleted successfully!`);

      // Reload recent items
      await loadRecentItems();

      // Trigger dashboard refresh
      window.dispatchEvent(new Event("refreshDashboard"));
    } catch (err) {
      console.error("Failed to delete item:", err);
      alert("Failed to delete item. Please try again.");
    }
  }

  // helper function to get file icon based on type
  function getFileIcon(item: any) {
    if (item.type === "folder") {
      return <Image src="/folder-icon-white.svg" alt="Folder" width={36} height={36} className={styles.folderIcon} />;
    }

    // file type icons based on mimeType
    const mimeType = item.mimeType || "";

    if (mimeType.startsWith("audio/")) return <AudioIcon className={styles.folderIcon} size={36} />;
    if (mimeType.startsWith("image/")) return <ImageIcon className={styles.folderIcon} size={36} />;
    if (mimeType.startsWith("video/")) return <VideoIcon className={styles.folderIcon} size={36} />;
    if (mimeType.startsWith("text/") || mimeType.includes("document"))
      return <FileIcon className={styles.folderIcon} size={36} />;

    return <FileIcon className={styles.folderIcon} size={36} />;
  }

  return (
    <section className={styles.recentSection}>
      <h2 className={styles.sectionTitle}>Recent Folders</h2>
      <div className={styles.recentFoldersGrid}>
        {loading ? (
          <p style={{ gridColumn: "1 / -1", textAlign: "center", color: "#999" }}>Loading...</p>
        ) : recentItems.length > 0 ? (
          recentItems.map((item) => (
            <div
              key={item.id}
              className={styles.fileCard}
              onClick={() => handleItemClick(item)}
              onContextMenu={(e) => handleContextMenu(e, item, "folder")}
            >
              {getFileIcon(item)}
              <p className={styles.fileName}>{item.name}</p>
            </div>
          ))
        ) : (
          <p style={{ gridColumn: "1 / -1", textAlign: "center", color: "#999" }}>No recent folders</p>
        )}
      </div>

      {/* Context Menu */}
      <ContextMenu />
    </section>
  );
}
