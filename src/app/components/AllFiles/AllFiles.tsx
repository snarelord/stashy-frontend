import { useState, useEffect } from "react";
import styles from "./AllFiles.module.css";
import { useRouter } from "next/navigation";
import { useContextMenu } from "../../hooks/useContextMenu";
import { useFileOperations } from "../../hooks/useFileOperations";
import { useQuickShare } from "../../hooks/useQuickShare";
import { api } from "../../services/api";
import toast from "react-hot-toast";
import AudioIcon from "../Icons/AudioIcon/AudioIcon";
import Image from "next/image";
import VideoIcon from "../Icons/VideoIcon/VideoIcon";
import FileIcon from "../Icons/FileIcon/FileIcon";
import CreateFolderButton from "../ActionButtons/CreateFolder/CreateFolderButton";

function getFileIconComponent(file: any) {
  if (file.type === "folder") {
    return <Image src="/folder-icon-white.svg" alt="Folder" width={20} height={20} className={styles.fileIcon} />;
  }
  const mime = file.mimeType || "";
  if (mime.startsWith("audio/")) return <AudioIcon className={styles.fileIcon} size={20} />;
  if (mime.startsWith("image/")) {
    const imageUrl = `${process.env.NEXT_PUBLIC_API_URL}/files/stream/${file.id}`;
    return (
      <Image
        src={imageUrl}
        alt={file.name}
        width={20}
        height={20}
        className={styles.fileIcon}
        style={{ objectFit: "cover" }}
        unoptimized
      />
    );
  }
  if (mime.startsWith("video/")) return <VideoIcon className={styles.fileIcon} size={20} />;
  if (mime.startsWith("text/") || mime.includes("document")) return <FileIcon className={styles.fileIcon} size={20} />;
  return <FileIcon className={styles.fileIcon} size={20} />;
}

function shortenFileName(name: string, maxLength = 20) {
  if (typeof window !== "undefined" && window.innerWidth <= 768 && name.length > maxLength) {
    const first = name.slice(0, 8);
    const last = name.slice(-8);
    return `${first}...${last}`;
  }
  return name;
}

interface AllFilesProps {
  onContextMenu?: (e: React.MouseEvent, item: any, type: "file" | "folder") => void;
}

export default function AllFiles({ onContextMenu: onContextMenuProp }: AllFilesProps) {
  const router = useRouter();
  const [files, setFiles] = useState<any[]>([]);
  const [folders, setFolders] = useState<any[]>([]);
  const { contextMenu, setContextMenu, handleContextMenu } = useContextMenu();
  const { loading, setLoading, handleDelete } = useFileOperations();
  const { quickShareFile, quickShareFolder, loading: quickShareLoading } = useQuickShare();

  const contextMenuHandler = onContextMenuProp || handleContextMenu;

  function isAudioFile(mimeType: string): boolean {
    return mimeType?.startsWith("audio/");
  }

  function isImageFile(mimeType: string): boolean {
    return mimeType?.startsWith("image/");
  }

  function isVideoFile(mimeType: string): boolean {
    return mimeType?.startsWith("video/");
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

    const handleRefresh = function () {
      loadUserFiles();
    };

    window.addEventListener("focus", handleRefresh);
    window.addEventListener("refreshDashboard", handleRefresh);

    return function () {
      window.removeEventListener("focus", handleRefresh);
      window.removeEventListener("refreshDashboard", handleRefresh);
    };
  }, []);

  function handleFolderClick(folderId: string) {
    router.push(`/pages/folder/${folderId}`);
  }

  async function handleDownload(file: any, e: React.MouseEvent) {
    e.stopPropagation();
    try {
      await api.downloadFile(file.id);
      toast.success("Download started!");
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Failed to download file");
    }
  }

  async function handleDownloadFolder(folder: any, e: React.MouseEvent) {
    e.stopPropagation();
    try {
      await api.downloadFolder(folder.id);
      toast.success("Download started!");
    } catch (error: any) {
      console.error("Folder download failed:", error);
      toast.error(error.message || "Failed to download folder");
    }
  }

  return (
    <section className={styles.fileListSection}>
      <CreateFolderButton />
      <p className={styles.fileCount}>// All files</p>
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
            onContextMenu={(e) => contextMenuHandler(e, folder, "folder")}
          >
            <div className={styles.tableCell}>
              {getFileIconComponent({ ...folder, type: "folder" })}
              {folder.name}
            </div>
            <div className={styles.tableCell}>
              {folder.createdAt ? new Date(folder.createdAt).toLocaleDateString() : "—"}
            </div>
            <div className={styles.tableCell}>
              <button
                className={styles.quickShareButton}
                onClick={(e) => {
                  e.stopPropagation();
                  quickShareFolder(folder.id, folder.name);
                }}
                disabled={quickShareLoading}
                title="Quick share (30 days)"
              >
                Share
              </button>
              <button
                onClick={(e) => handleDownloadFolder(folder, e)}
                className={styles.actionButton}
                title="Download folder as ZIP"
              >
                Download
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
                Delete
              </button>
            </div>
          </div>
        ))}
        {files.map((file) => (
          <div
            key={file.id}
            className={styles.tableRow}
            onClick={() => {
              if (isAudioFile(file.mimeType)) {
                router.push(`/pages/audio-preview/${file.id}`);
              } else if (isImageFile(file.mimeType)) {
                router.push(`/pages/image-preview/${file.id}`);
              } else if (isVideoFile(file.mimeType)) {
                router.push(`/pages/video-preview/${file.id}`);
              }
            }}
            onContextMenu={(e) => contextMenuHandler(e, file, "file")}
            style={{
              cursor:
                isAudioFile(file.mimeType) || isImageFile(file.mimeType) || isVideoFile(file.mimeType)
                  ? "pointer"
                  : "default",
            }}
          >
            <div className={styles.tableCell}>
              {getFileIconComponent(file)}
              {shortenFileName(file.name)}
            </div>
            <div className={styles.tableCell}>
              {file.createdAt ? new Date(file.createdAt).toLocaleDateString() : ""}
            </div>
            <div className={styles.tableCell}>
              <button
                className={styles.quickShareButton}
                onClick={(e) => {
                  e.stopPropagation();
                  quickShareFile(file.id, file.original_name);
                }}
                disabled={quickShareLoading}
                title="Quick share (30 days)"
              >
                Share
              </button>

              <button onClick={(e) => handleDownload(file, e)} className={styles.actionButton} title="Download file">
                Download
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
                name="delete-button"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {folders.length === 0 && files.length === 0 && <div className={styles.emptyState}>No files or folders yet</div>}
      </div>
    </section>
  );
}
