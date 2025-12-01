import styles from "./ContextMenu.module.css";
import { useContextMenu } from "../../hooks/useContextMenu";
import { api } from "@/app/services/api";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFileOperations } from "@/app/hooks/useFileOperations";

export default function ContextMenu() {
  const { contextMenu, setContextMenu, handleContextMenu } = useContextMenu();
  const router = useRouter();
  const [files, setFiles] = useState<any[]>([]);
  const [folders, setFolders] = useState<any[]>([]);
  const { loading, setLoading, handleDelete } = useFileOperations();

  async function loadUserFiles() {
    try {
      const foldersResponse = await api.getFolders();

      setFolders(foldersResponse.folders || []);
      const filesResponse = await api.getFiles();

      setFiles(filesResponse.files || []);
    } catch (err) {
      console.error("Failed to load files:", err);
      setFiles([]);
      setFolders([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(function () {
    loadUserFiles();

    const handleFocus = function () {
      loadUserFiles();
    };

    window.addEventListener("focus", handleFocus);

    return function () {
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  async function handleDownload(file: any, e: React.MouseEvent) {
    e.stopPropagation();
    try {
      await api.downloadFile(file.id);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download file");
    }
  }

  async function handleDownloadFolder(folder: any, e: React.MouseEvent) {
    e.stopPropagation();
    try {
      await api.downloadFolder(folder.id);
    } catch (error: any) {
      console.error("Folder download failed:", error);
      alert(error.message || "Failed to download folder");
    }
  }

  if (!contextMenu) return null;

  return (
    <div>
      {contextMenu && (
        <div className={styles.contextMenu} style={{ top: contextMenu.y, left: contextMenu.x }}>
          {contextMenu.type === "file" && (
            <>
              <button
                className={styles.contextMenuItem}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownload(contextMenu.item, e);
                  setContextMenu(null);
                }}
              >
                📥 Download
              </button>
              <button
                className={styles.contextMenuItem}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(contextMenu.item, "file", function () {
                    loadUserFiles();
                    window.dispatchEvent(new Event("refreshDashboard"));
                  });
                  setContextMenu(null);
                }}
              >
                🗑️ Delete
              </button>
            </>
          )}
          {contextMenu.type === "folder" && (
            <>
              <button
                className={styles.contextMenuItem}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownloadFolder(contextMenu.item, e);
                  setContextMenu(null);
                }}
              >
                📥 Download as ZIP
              </button>
              <button
                className={styles.contextMenuItem}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(contextMenu.item, "folder", function () {
                    loadUserFiles();
                    window.dispatchEvent(new Event("refreshDashboard"));
                  });
                  setContextMenu(null);
                }}
              >
                🗑️ Delete
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
