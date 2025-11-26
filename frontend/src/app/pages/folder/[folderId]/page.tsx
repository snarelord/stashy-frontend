"use client";

import { useState, useEffect, use, useRef } from "react";
import { mockApi } from "../../../services/mockApi";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import Sidebar from "@/app/components/Sidebar/Sidebar";
import DashboardHeader from "@/app/components/DashboardHeader/DashboardHeader";
import Footer from "@/app/components/Footer/Footer";
import Link from "next/link";
import Image from "next/image";
import { useContextMenu } from "../../../hooks/useContextMenu";
import { useFileOperations } from "../../../hooks/useFileOperations";
import { getFileIcon } from "../../../utils/getFileIcons";

interface FolderPageProps {
  params: Promise<{
    folderId: string;
  }>;
}

interface Breadcrumb {
  id: string;
  name: string;
}

export default function FolderPage({ params }: FolderPageProps) {
  const router = useRouter();
  const { folderId } = use(params);
  const [folder, setFolder] = useState<any>(null);
  const [subfolders, setSubfolders] = useState<any[]>([]);
  const [files, setFiles] = useState<any[]>([]);
  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([]);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { contextMenu, setContextMenu, handleContextMenu } = useContextMenu();
  const { loading, setLoading, handleDelete, handleUpload, handleCreateFolder } = useFileOperations();

  useEffect(
    function () {
      loadFolderContents();
    },
    [folderId]
  );

  async function loadFolderContents() {
    try {
      const data = await mockApi.getFolderContents(folderId);
      setFolder(data.folder);
      setSubfolders(data.folders || []);
      setFiles(data.files);
      setBreadcrumbs(data.breadcrumbs || []);
    } catch (err) {
      console.error("Failed to load folder contents:", err);
    } finally {
      setLoading(false);
    }
  }

  function handleUploadClick() {
    fileInputRef.current?.click();
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    await handleUpload(files, folderId, function () {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      loadFolderContents();
    });
    setUploading(false);
  }

  async function onCreateFolder() {
    await handleCreateFolder(folderName, folderId, function () {
      setFolderName("");
      setIsCreatingFolder(false);
      loadFolderContents();
    });
  }

  function handleFolderClick(subfolderId: string) {
    router.push(`/pages/folder/${subfolderId}`);
  }

  if (loading) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.pageWrapper}>
          <Sidebar />
          <div className={styles.mainContent}>
            <DashboardHeader />
            <p style={{ textAlign: "center", padding: "40px" }}>Loading folder...</p>
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

          {/* Folder Header */}
          <section className={styles.folderHeader}>
            <div className={styles.breadcrumb}>
              <Link href="/pages/dashboard" className={styles.breadcrumbLink}>
                Dashboard
              </Link>

              {/* Render breadcrumb trail */}
              {breadcrumbs.map((crumb, index) => (
                <span key={crumb.id}>
                  <span className={styles.breadcrumbSeparator}>/</span>
                  {index === breadcrumbs.length - 1 ? (
                    <span className={styles.breadcrumbCurrent}>{crumb.name}</span>
                  ) : (
                    <Link href={`/pages/folder/${crumb.id}`} className={styles.breadcrumbLink}>
                      {crumb.name}
                    </Link>
                  )}
                </span>
              ))}
            </div>
            <h1 className={styles.folderTitle}>
              <Image
                src="/folder-icon-purple.png"
                alt="Folder"
                width={28}
                height={28}
                className={styles.folderIconImage}
              />
              {folder?.name || folderId}
            </h1>
            <div className={styles.folderActions}>
              {!isCreatingFolder ? (
                <>
                  <button className={styles.actionButton} onClick={handleUploadClick} disabled={uploading}>
                    {uploading ? "Uploading..." : "Upload file"}
                  </button>
                  <button className={styles.actionButton} onClick={() => setIsCreatingFolder(true)}>
                    New folder
                  </button>
                  <input
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

          {/* Folder Contents Table */}
          <section className={styles.folderContents}>
            <p className={styles.fileCount}>
              //Folder contents ({subfolders.length + files.length}{" "}
              {subfolders.length + files.length === 1 ? "item" : "items"})
            </p>
            <div className={styles.fileTable}>
              <div className={styles.tableHeader}>
                <div className={styles.tableHeaderCell}>Name</div>
                <div className={styles.tableHeaderCell}>Size</div>
                <div className={styles.tableHeaderCell}>Modified</div>
              </div>

              {subfolders.map((subfolder) => (
                <div
                  key={subfolder.id}
                  className={styles.tableRow}
                  onClick={() => handleFolderClick(subfolder.id)}
                  onContextMenu={(e) => handleContextMenu(e, subfolder, "folder")}
                >
                  <div className={styles.tableCell}>
                    <Image
                      src="/folder-icon-purple.png"
                      alt="Folder"
                      width={20}
                      height={20}
                      className={styles.fileIcon}
                    />
                    {subfolder.name}
                  </div>
                  <div className={styles.tableCell}>—</div>
                  <div className={styles.tableCell}>—</div>
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
                  <div className={styles.tableCell}>{file.size}</div>
                  <div className={styles.tableCell}>{file.modified}</div>
                </div>
              ))}

              {subfolders.length === 0 && files.length === 0 && (
                <div className={styles.emptyState}>
                  <span className={styles.emptyIcon}>📂</span>
                  <p>This folder is empty</p>
                  <button className={styles.uploadButton} onClick={handleUploadClick}>
                    Upload your first file
                  </button>
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
                  if (!contextMenu || !contextMenu.type) return;
                  handleDelete(contextMenu.item, contextMenu.type, loadFolderContents);
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
