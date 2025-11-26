"use client";

import styles from "./page.module.css";
import Footer from "../../components/Footer/Footer";
import Sidebar from "../../components/Sidebar/Sidebar";
import DashboardHeader from "../../components/DashboardHeader/DashboardHeader";
import RecentFiles from "../../components/RecentFiles/RecentFiles";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { mockApi } from "../../services/mockApi";
import Image from "next/image";
import { useContextMenu } from "../../hooks/useContextMenu";
import { useFileOperations } from "../../hooks/useFileOperations";
import { getFileIcon } from "../../utils/getFileIcons";

export default function DashboardPage() {
  const router = useRouter();
  const [files, setFiles] = useState<any[]>([]);
  const [folders, setFolders] = useState<any[]>([]);
  const { contextMenu, setContextMenu, handleContextMenu } = useContextMenu();
  const { loading, setLoading, handleDelete } = useFileOperations();

  useEffect(function () {
    loadUserFiles();
  }, []);

  async function loadUserFiles() {
    try {
      const data = await mockApi.getUserFiles();
      setFiles(data.files);
      setFolders(data.folders);
    } catch (err) {
      console.error("Failed to load files:", err);
    } finally {
      setLoading(false);
    }
  }

  function handleFolderClick(folderId: string) {
    router.push(`/pages/folder/${folderId}`);
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
              </div>

              {folders.map((folder) => (
                <div
                  key={folder.id}
                  className={styles.tableRow}
                  onClick={() => handleFolderClick(folder.id)}
                  onContextMenu={(e) => handleContextMenu(e, folder, "folder")}
                  style={{ cursor: "pointer" }}
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
                  <div className={styles.tableCell}></div>
                </div>
              ))}

              {files.map((file) => (
                <div
                  key={file.id}
                  className={styles.tableRow}
                  onContextMenu={(e) => handleContextMenu(e, file, "file")}
                >
                  <div className={styles.tableCell}>
                    <span className={styles.fileIcon}>{getFileIcon(file.type)}</span>
                    {file.name}
                  </div>
                  <div className={styles.tableCell}>{file.modified}</div>
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
            <div
              className={styles.contextMenu}
              style={{ top: contextMenu.y, left: contextMenu.x }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className={styles.contextMenuItem}
                onClick={() => {
                  handleDelete(contextMenu.item, contextMenu.item.type, loadUserFiles);
                  setContextMenu(null);
                }}
              >
                🗑️ Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
