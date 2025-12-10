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

interface RecentFoldersProps {
  onContextMenu?: (e: React.MouseEvent, item: any, type: "file" | "folder") => void;
}

export default function RecentFolders({ onContextMenu: onContextMenuProp }: RecentFoldersProps) {
  const router = useRouter();
  const [recentItems, setRecentItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; item: any; type: "file" | "folder" } | null>(
    null
  );

  const hasContextMenuProp = !!onContextMenuProp;

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

  function handleItemClick(item: any) {
    if (item.type === "folder") {
      router.push(`/pages/folder/${item.id}`);
    } else {
      // console.log("File clicked:", item.name);
    }
  }

  function handleContextMenu(e: React.MouseEvent, item: any, type: "file" | "folder") {
    e.preventDefault();
    e.stopPropagation();
    if (onContextMenuProp) {
      onContextMenuProp(e, item, type);
    } else {
      setContextMenu({ x: e.clientX, y: e.clientY, item, type });
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
          <p style={{ gridColumn: "1 / -1", textAlign: "center", color: "rgba(255, 255, 255, 0.5)" }}>Loading...</p>
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
          <p style={{ gridColumn: "1 / -1", textAlign: "center", color: "rgba(255, 255, 255, 0.5)" }}>
            No recent folders
          </p>
        )}
      </div>
    </section>
  );
}
