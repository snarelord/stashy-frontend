"use client";

import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { api } from "../../services/api";
import useAuthRedirect from "../../hooks/useAuthRedirect";
import { useContextMenu } from "../../hooks/useContextMenu";
import { useFileOperations } from "../../hooks/useFileOperations";
import toast from "react-hot-toast";
import Spinner from "../../components/Spinner/Spinner";
import AllFiles from "../../components/AllFiles/AllFiles";
import Footer from "../../components/Footer/Footer";
import Sidebar from "../../components/Sidebar/Sidebar";
import DashboardHeader from "../../components/DashboardHeader/DashboardHeader";
import RecentFolders from "../../components/RecentFolders/RecentFolders";
import ContextMenu from "../../components/ContextMenu/ContextMenu";
import ShareModal from "../../components/ShareModal/ShareModal";

export default function DashboardPage() {
  const { loading: authLoading, authenticated } = useAuthRedirect();
  const router = useRouter();
  const [files, setFiles] = useState<any[]>([]);
  const [folders, setFolders] = useState<any[]>([]);
  const { contextMenu, setContextMenu, handleContextMenu } = useContextMenu();
  const { loading, setLoading, handleDelete } = useFileOperations();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Share modal state
  const [shareModal, setShareModal] = useState<{
    isOpen: boolean;
    fileId?: string;
    folderId?: string;
    fileName?: string;
    folderName?: string;
  }>({
    isOpen: false,
  });

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

  function closeShareModal() {
    console.log("🔍 Closing share modal");
    setShareModal({ isOpen: false });
  }

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
          <div className={styles.mainContent} style={{ marginLeft: sidebarCollapsed ? 56 : 280 }}>
            <DashboardHeader
              collapsed={sidebarCollapsed}
              onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
            />
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
        <Sidebar collapsed={sidebarCollapsed} onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />
        <div className={styles.mainContent} style={{ marginLeft: sidebarCollapsed ? 0 : 280 }}>
          <DashboardHeader
            collapsed={sidebarCollapsed}
            onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          />
          <RecentFolders onContextMenu={handleContextMenu} />
          <AllFiles onContextMenu={handleContextMenu} />

          <ShareModal
            isOpen={shareModal.isOpen}
            onClose={closeShareModal}
            fileId={shareModal.fileId}
            folderId={shareModal.folderId}
            fileName={shareModal.fileName}
            folderName={shareModal.folderName}
          />

          <ContextMenu
            contextMenu={contextMenu}
            onDownloadFile={handleDownload}
            onDownloadFolder={handleDownloadFolder}
            onShare={handleShare}
            onDelete={(item, type) => {
              handleDelete(item, type, function () {
                loadUserFiles();
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
