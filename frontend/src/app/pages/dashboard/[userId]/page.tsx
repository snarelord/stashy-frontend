"use client";

import styles from "./page.module.css";
import Footer from "../../../components/Footer/Footer";
import Sidebar from "../../../components/Sidebar/Sidebar";
import DashboardHeader from "../../../components/DashboardHeader/DashboardHeader";
import RecentFiles from "../../../components/RecentFiles/RecentFiles";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { api } from "../../../services/api";
import Image from "next/image";
import { useContextMenu } from "../../../hooks/useContextMenu";
import { useFileOperations } from "../../../hooks/useFileOperations";
import { getFileIcon } from "../../../utils/getFileIcons";

export default function DashboardPage() {
  const router = useRouter();
  const [files, setFiles] = useState<any[]>([]);
  const [folders, setFolders] = useState<any[]>([]);
  const { contextMenu, setContextMenu, handleContextMenu } = useContextMenu();
  const { loading, setLoading, handleDelete } = useFileOperations();

  function isAudioFile(mimeType: string): boolean {
    return mimeType?.startsWith("audio/");
  }

  async function loadUserFiles() {
    try {
      const foldersResponse = await api.getFolders();

      console.log("Folders from API:", foldersResponse); // FIXED

      setFolders(foldersResponse.folders || []);
      const filesResponse = await api.getFiles();

      setFiles(filesResponse.files || []);

      console.log("Data loaded successfully");
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
      console.log("Dashboard refresh triggered");
      loadUserFiles();
    };

    window.addEventListener("focus", handleFocus);

    return function () {
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  function handleFolderClick(folderId: string) {
    router.push(`/pages/folder/${folderId}`);
  }

  // function handleFileClick(fileId: string) {
  //   router.push(`/pages/folder/${fileId}`);
  // }

  async function handleDownload(file: any, e: React.MouseEvent) {
    e.stopPropagation();
    try {
      console.log("Downloading:", file.original_name);
      await api.downloadFile(file.id);
      console.log("Download started");
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download file");
    }
  }

  async function handleDownloadFolder(folder: any, e: React.MouseEvent) {
    e.stopPropagation();
    try {
      console.log("Downloading folder:", folder.name);
      await api.downloadFolder(folder.id);
      console.log("Folder download started");
    } catch (error: any) {
      console.error("Folder download failed:", error);
      alert(error.message || "Failed to download folder");
    }
  }

  if (loading) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.pageWrapper}>
          <Sidebar />
          <div className={styles.mainContent}>
            <DashboardHeader />
            <p style={{ textAlign: "center", padding: "40px" }}>Loading...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageWrapper}>
        <Sidebar />

        <div className={styles.mainContent}>
          <DashboardHeader />
          <RecentFiles />

          <section className={styles.fileListSection}>
            <p className={styles.fileCount}>//All files</p>
            <div className={styles.fileTable}>
              <div className={styles.tableHeader}>
                <div className={styles.tableHeaderCell}>File Name</div>
                <div className={styles.tableHeaderCell}>Modified</div>
                <div className={styles.tableHeaderCell}>Actions</div>
              </div>

              {folders.map((folder) => (
                <div
                  key={folder.id}
                  className={styles.tableRow}
                  onClick={() => handleFolderClick(folder.id)}
                  onContextMenu={(e) => handleContextMenu(e, folder, "folder")}
                >
                  <div className={styles.tableCell}>
                    <Image
                      src="/folder-icon-purple.png"
                      alt="Folder"
                      width={20}
                      height={20}
                      className={styles.fileIcon}
                    />
                    {folder.name}
                  </div>
                  <div className={styles.tableCell}>
                    {folder.createdAt ? new Date(folder.createdAt).toLocaleDateString() : "—"}
                  </div>
                  <div className={styles.tableCell}>
                    <button
                      onClick={(e) => handleDownloadFolder(folder, e)}
                      className={styles.actionButton}
                      title="Download folder as ZIP"
                    >
                      📥
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(folder, "folder", function () {
                          loadUserFiles();
                          window.dispatchEvent(new Event("refreshDashboard"));
                        });
                      }}
                      className={styles.actionButton}
                      title="Delete folder"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
              {files.map((file) => (
                <div
                  key={file.id}
                  className={styles.tableRow}
                  onClick={() => {
                    // If audio file, go to audio preview page
                    if (isAudioFile(file.mimeType)) {
                      router.push(`/pages/audio-preview/${file.id}`);
                    }
                  }}
                  onContextMenu={(e) => handleContextMenu(e, file, "file")}
                  style={{ cursor: isAudioFile(file.mimeType) ? "pointer" : "default" }}
                >
                  <div className={styles.tableCell}>
                    <span className={styles.fileIcon}>{getFileIcon(file.mimeType)}</span>
                    {file.name}
                  </div>
                  <div className={styles.tableCell}>
                    {file.createdAt ? new Date(file.createdAt).toLocaleDateString() : ""}
                  </div>
                  <div className={styles.tableCell}>
                    <button
                      onClick={(e) => handleDownload(file, e)}
                      className={styles.actionButton}
                      title="Download file"
                    >
                      📥
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(file, "file", function () {
                          loadUserFiles();
                          window.dispatchEvent(new Event("refreshDashboard"));
                        });
                      }}
                      className={styles.actionButton}
                      title="Delete file"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
              {folders.length === 0 && files.length === 0 && (
                <div className={styles.tableRow}>
                  <div className={styles.tableCell} style={{ textAlign: "center", color: "#999" }}>
                    No files or folders yet
                  </div>
                </div>
              )}
            </div>
          </section>

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
      </div>

      <Footer />
    </div>
  );
}
