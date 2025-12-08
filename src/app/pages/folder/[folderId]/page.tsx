"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import useAuthRedirect from "@/app/hooks/useAuthRedirect";
import { api } from "../../../services/api";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import Sidebar from "@/app/components/Sidebar/Sidebar";
import DashboardHeader from "@/app/components/DashboardHeader/DashboardHeader";
import Footer from "@/app/components/Footer/Footer";
import { useContextMenu } from "../../../hooks/useContextMenu";
import { useFileOperations } from "../../../hooks/useFileOperations";
import Spinner from "../../../components/Spinner/Spinner";
import toast from "react-hot-toast";
import FileTable from "@/app/components/FileTable/FileTable";
import FolderHeader from "@/app/components/FolderHeader/FolderHeader";
import ContextMenu from "@/app/components/ContextMenu/ContextMenu";
import ShareModal from "../../../components/ShareModal/ShareModal";

interface Breadcrumb {
  id: string;
  name: string;
}

export default function FolderPage() {
  const { loading: authLoading, authenticated } = useAuthRedirect();
  const router = useRouter();
  const params = useParams();
  const folderId = Array.isArray(params.folderId) ? params.folderId[0] : params.folderId;
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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [shareModal, setShareModal] = useState<{
    isOpen: boolean;
    fileId?: string;
    folderId?: string;
    fileName?: string;
    folderName?: string;
  }>({
    isOpen: false,
  });

  useEffect(
    function () {
      loadFolderContents();
    },
    [folderId]
  );

  function handleShare(item: any, type: "file" | "folder") {
    console.log("🔍 handleShare called with:", { item, type });
    console.log("🔍 Item ID:", item?.id);
    console.log("🔍 Item name:", item?.original_name || item?.name);

    if (type === "file") {
      const newState = {
        isOpen: true,
        fileId: item.id,
        fileName: item.original_name,
      };
      console.log("🔍 Setting file share state:", newState);
      setShareModal(newState);
    } else {
      const newState = {
        isOpen: true,
        folderId: item.id,
        folderName: item.name,
      };
      console.log("🔍 Setting folder share state:", newState);
      setShareModal(newState);
    }
  }

  async function loadFolderContents() {
    if (!folderId) {
      return;
    }
    try {
      const data = await api.getFolderContents(folderId as string);

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
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const response = await api.uploadFile(file, folderId);
        if (!response.success) {
          console.error("Error uploading: ", response);
        }
      }
      toast.success(`Successfully uploaded ${files.length} file(s)!`);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      loadFolderContents();
      window.dispatchEvent(new Event("refreshDashboard"));
    } catch (err) {
      console.error("Failed to upload files:", err);
      toast.error("Failed to upload files. Please try again.");
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
      await api.downloadFile(file.id);
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Failed to download file");
    }
  }

  async function handleDownloadFolder(folder: any, e: React.MouseEvent) {
    e.stopPropagation();
    try {
      await api.downloadFolder(folder.id);
    } catch (error: any) {
      console.error("Folder download failed:", error);
      toast.error(error.message || "Failed to download folder");
    }
  }

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

  if (!authenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.pageWrapper}>
          <Sidebar collapsed={sidebarCollapsed} onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />
          <div className={styles.mainContent} style={{ marginLeft: sidebarCollapsed ? 0 : 280 }}>
            <DashboardHeader
              collapsed={sidebarCollapsed}
              onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
            />
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
        <Sidebar collapsed={sidebarCollapsed} onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />

        <div className={styles.mainContent} style={{ marginLeft: sidebarCollapsed ? 0 : 280 }}>
          <DashboardHeader
            collapsed={sidebarCollapsed}
            onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          />

          <FolderHeader
            breadcrumbs={breadcrumbs}
            folderName={folder?.name || ""}
            folderId={folderId as string}
            uploading={uploading}
            isCreatingFolder={isCreatingFolder}
            newFolderName={folderName}
            onUploadClick={handleUploadClick}
            onCreateFolderStart={() => setIsCreatingFolder(true)}
            onCreateFolderConfirm={onCreateFolder}
            onCreateFolderCancel={() => {
              setIsCreatingFolder(false);
              setFolderName("");
            }}
            onFolderNameChange={setFolderName}
            fileInputRef={fileInputRef}
            onFileChange={handleFileChange}
          />

          <FileTable
            subfolders={subfolders}
            files={files}
            onFolderClick={handleFolderClick}
            onFileDownload={handleDownload}
            onFolderDownload={handleDownloadFolder}
            onDelete={(item, type) => {
              handleDelete(item, type, function () {
                loadFolderContents();
                window.dispatchEvent(new Event("refreshDashboard"));
              });
            }}
            onContextMenu={handleContextMenu}
            onUploadClick={handleUploadClick}
          />

          <ContextMenu
            contextMenu={contextMenu}
            onDownloadFile={handleDownload}
            onDownloadFolder={handleDownloadFolder}
            onShare={handleShare}
            onDelete={(item, type) => {
              handleDelete(item, type, function () {
                loadFolderContents();
                window.dispatchEvent(new Event("refreshDashboard"));
              });
            }}
            onClose={() => setContextMenu(null)}
          />
        </div>
      </div>
    </div>
  );
}
