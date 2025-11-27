"use client";

import { useState, useEffect, use, useRef } from "react";
import useAuthRedirect from "@/app/hooks/useAuthRedirect";
import { api } from "../../../services/api";
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
import Spinner from "../../../components/Spinner/Spinner";

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
  const { loading: authLoading, authenticated } = useAuthRedirect();
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
  const { loading, setLoading, handleDelete, handleCreateFolder } = useFileOperations();

  useEffect(
    function () {
      loadFolderContents();
    },
    [folderId]
  );

  async function loadFolderContents() {
    try {
      const data = await api.getFolderContents(folderId);

      setFolder(data.folder);
      setSubfolders(data.folders || []);
      setFiles(data.files || []);
      setBreadcrumbs(data.breadcrumbs || []);
    } catch (err) {
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
    try {
      // Upload each file to this folder
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const response = await api.uploadFile(file, folderId);
        if (response.success) {
          console.log(`✅ Uploaded: ${response.file.name}`);
        }
      }
      alert(`Successfully uploaded ${files.length} file(s)!`);

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Reload folder contents
      loadFolderContents();
      window.dispatchEvent(new Event("refreshDashboard"));
    } catch (err) {
      console.error("Failed to upload files:", err);
      alert("Failed to upload files. Please try again.");
    } finally {
      setUploading(false);
    }
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

  async function handleDownload(file: any, e: React.MouseEvent) {
    e.stopPropagation();
    try {
      console.log("📥 Downloading:", file.name);
      await api.downloadFile(file.id);
      console.log("✅ Download started");
    } catch (error) {
      console.error("❌ Download failed:", error);
      alert("Failed to download file");
    }
  }

  async function handleDownloadFolder(folder: any, e: React.MouseEvent) {
    e.stopPropagation();
    try {
      console.log("📦 Downloading folder:", folder.name);
      await api.downloadFolder(folder.id);
      console.log("✅ Folder download started");
    } catch (error: any) {
      console.error("❌ Folder download failed:", error);
      alert(error.message || "Failed to download folder");
    }
  }

  // Helper function to format file size
  function formatFileSize(bytes: number): string {
    if (!bytes) return "—";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + " MB";
    return (bytes / (1024 * 1024 * 1024)).toFixed(1) + " GB";
  }

  if (authLoading) {
    return <Spinner />;
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
                <div className={styles.tableHeaderCell}>Actions</div>
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
                  <div className={styles.tableCell}>
                    {subfolder.createdAt ? new Date(subfolder.createdAt).toLocaleDateString() : "—"}
                  </div>
                  <div className={styles.tableCell}>
                    <button
                      onClick={(e) => handleDownloadFolder(subfolder, e)}
                      className={styles.actionButtonIcon}
                      title="Download folder as ZIP"
                    >
                      📥
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(subfolder, "folder", function () {
                          loadFolderContents();
                          window.dispatchEvent(new Event("refreshDashboard"));
                        });
                      }}
                      className={styles.actionButtonIcon}
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
                  onContextMenu={(e) => handleContextMenu(e, file, "file")}
                >
                  <div className={styles.tableCell}>
                    <span className={styles.fileIcon}>{getFileIcon(file.mimeType)}</span>
                    {file.name}
                  </div>
                  <div className={styles.tableCell}>{formatFileSize(file.size)}</div>
                  <div className={styles.tableCell}>
                    {file.createdAt ? new Date(file.createdAt).toLocaleDateString() : "—"}
                  </div>
                  <div className={styles.tableCell}>
                    <button
                      onClick={(e) => handleDownload(file, e)}
                      className={styles.actionButtonIcon}
                      title="Download file"
                    >
                      📥
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(file, "file", function () {
                          loadFolderContents();
                          window.dispatchEvent(new Event("refreshDashboard"));
                        });
                      }}
                      className={styles.actionButtonIcon}
                      title="Delete file"
                    >
                      🗑️
                    </button>
                  </div>
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
                    onClick={() => {
                      if (!contextMenu || !contextMenu.type) return;
                      handleDelete(contextMenu.item, contextMenu.type, function () {
                        loadFolderContents();
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
                    onClick={() => {
                      if (!contextMenu || !contextMenu.type) return;
                      handleDelete(contextMenu.item, contextMenu.type, function () {
                        loadFolderContents();
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
