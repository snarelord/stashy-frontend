"use client";

import { useState, useEffect } from "react";
import { mockApi } from "../../services/mockApi";
import styles from "./page.module.css";
import Sidebar from "../../components/Sidebar/Sidebar";
import DashboardHeader from "../../components/DashboardHeader/DashboardHeader";
import Footer from "../../components/Footer/Footer";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useContextMenu } from "../../hooks/useContextMenu";
import { useFileOperations } from "../../hooks/useFileOperations";

export default function AllFoldersPage() {
  const router = useRouter();
  const [folders, setFolders] = useState<any[]>([]);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [folderName, setFolderName] = useState("");
  const { contextMenu, setContextMenu, handleContextMenu } = useContextMenu();
  const { loading, setLoading, handleDelete, handleCreateFolder } = useFileOperations();

  useEffect(function () {
    loadFolders();
  }, []);

  async function loadFolders() {
    try {
      const data = await mockApi.getUserFiles();
      setFolders(data.folders);
    } catch (err) {
      console.error("Failed to load folders:", err);
    } finally {
      setLoading(false);
    }
  }

  function handleFolderClick(folderId: string) {
    router.push(`/pages/folder/${folderId}`);
  }

  async function onCreateFolder() {
    await handleCreateFolder(folderName, undefined, function () {
      setFolderName("");
      setIsCreatingFolder(false);
      loadFolders();
    });
  }

  if (loading) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.pageWrapper}>
          <Sidebar showBackToDashboard={true} />
          <div className={styles.mainContent}>
            <DashboardHeader />
            <p style={{ textAlign: "center", padding: "40px" }}>Loading folders...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageWrapper}>
        <Sidebar showBackToDashboard={true} />

        <div className={styles.mainContent}>
          <DashboardHeader />

          {/* Folders Header */}
          <section className={styles.foldersHeader}>
            <h1 className={styles.pageTitle}>
              <Image src="/folder-icon-purple.png" alt="Folder" width={32} height={32} className={styles.titleIcon} />
              All Folders
            </h1>
            <div className={styles.headerActions}>
              {!isCreatingFolder ? (
                <button className={styles.actionButton} onClick={() => setIsCreatingFolder(true)}>
                  Create folder
                </button>
              ) : (
                <div className={styles.createFolderContainer}>
                  <input
                    type="text"
                    placeholder="Enter folder name..."
                    value={folderName}
                    onChange={(e) => setFolderName(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") onCreateFolder();
                    }}
                    className={styles.folderInput}
                    autoFocus
                  />
                  <button className={styles.confirmButton} onClick={onCreateFolder}>
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

          {/* Folders Grid */}
          <section className={styles.foldersSection}>
            {folders.length > 0 ? (
              <div className={styles.foldersGrid}>
                {folders.map((folder) => (
                  <div
                    key={folder.id}
                    className={styles.folderCard}
                    onClick={() => handleFolderClick(folder.id)}
                    onContextMenu={(e) => handleContextMenu(e, folder, "folder")}
                  >
                    <Image
                      src="/folder-icon-purple.png"
                      alt="Folder"
                      width={64}
                      height={64}
                      className={styles.folderIconLarge}
                    />
                    <h3 className={styles.folderName}>{folder.name}</h3>
                    <p className={styles.folderInfo}>{folder.fileCount} files</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <span className={styles.emptyIcon}>📁</span>
                <p>No folders yet</p>
                <p className={styles.emptySubtext}>Create a folder to get started</p>
              </div>
            )}
          </section>

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
                  handleDelete(contextMenu.item, "folder", loadFolders);
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
