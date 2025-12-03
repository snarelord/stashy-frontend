"use client";

import { useState, useEffect } from "react";
import useAuthRedirect from "../../hooks/useAuthRedirect";
import { api } from "../../services/api";
import styles from "./page.module.css";
import Sidebar from "../../components/Sidebar/Sidebar";
import DashboardHeader from "../../components/DashboardHeader/DashboardHeader";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useContextMenu } from "../../hooks/useContextMenu";
import { useFileOperations } from "../../hooks/useFileOperations";
import Spinner from "@/app/components/Spinner/Spinner";

export default function AllFoldersPage() {
  const { loading: authLoading, authenticated } = useAuthRedirect();
  const router = useRouter();
  const [folders, setFolders] = useState<any[]>([]);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [folderName, setFolderName] = useState("");
  const { contextMenu, setContextMenu, handleContextMenu } = useContextMenu();
  const { loading, setLoading, handleDelete, handleCreateFolder } = useFileOperations();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(function () {
    loadFolders();

    function handleFocus() {
      loadFolders();
    }

    window.addEventListener("focus", handleFocus);

    return function () {
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  async function loadFolders() {
    try {
      const foldersResponse = await api.getFolders();
      setFolders(foldersResponse.folders || []);
    } catch (err) {
      setFolders([]);
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

  if (authLoading) {
    return <Spinner />;
  }

  if (!authenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className={styles.pageContainer} style={{ marginLeft: sidebarCollapsed ? 0 : 280 }}>
        <div className={styles.pageWrapper}>
          <Sidebar showBackToDashboard={true} collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
          <div className={styles.mainContent}>
            <DashboardHeader />
            <p style={{ textAlign: "center", padding: "40px" }}>Loading folders...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer} style={{ marginLeft: sidebarCollapsed ? 0 : 280 }}>
      <div className={styles.pageWrapper}>
        <Sidebar showBackToDashboard={true} collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />

        <div className={styles.mainContent}>
          <DashboardHeader />

          {/* Folders Header */}
          <section className={styles.foldersHeader}>
            <h1 className={styles.pageTitle}>
              <Image src="/folder-icon-white.svg" alt="Folder" width={32} height={32} className={styles.titleIcon} />
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
                      src="/folder-icon-white.svg"
                      alt="Folder"
                      width={64}
                      height={64}
                      className={styles.folderIconLarge}
                    />
                    <h3 className={styles.folderName}>{folder.name}</h3>
                    <p className={styles.folderInfo}>
                      {folder.fileCount !== undefined ? `${folder.fileCount} files` : ""}
                    </p>
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
                  if (!contextMenu.type) return;
                  handleDelete(contextMenu.item, contextMenu.type, function () {
                    loadFolders();
                    window.dispatchEvent(new Event("refreshDashboard"));
                  });
                  setContextMenu(null);
                }}
              >
                🗑️ Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
