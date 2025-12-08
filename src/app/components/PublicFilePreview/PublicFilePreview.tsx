"use client";

import styles from "./PublicFilePreview.module.css";
import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Spinner from "@/app/components/Spinner/Spinner";
import toast from "react-hot-toast";
import { shareService } from "../../services/shares";
import Image from "next/image";
import FileIcon from "../Icons/FileIcon/FileIcon";
import AudioIcon from "../Icons/AudioIcon/AudioIcon";
import VideoIcon from "../Icons/VideoIcon/VideoIcon";
import { useNativeDownload } from "../../hooks/useNativeDownload";

export default function PublicFilePreview() {
  const params = useParams();
  const token = params.token as string;

  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  const { downloadState, downloadFile } = useNativeDownload();

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
    if (mime.startsWith("text/") || mime.includes("document"))
      return <FileIcon className={styles.fileIcon} size={20} />;
    return <FileIcon className={styles.fileIcon} size={20} />;
  }

  useEffect(() => {
    function checkMobile() {
      setIsMobile(window.matchMedia("(max-width: 700px)").matches);
    }
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (token) {
      loadSharedContent();
    }
  }, [token]);

  async function loadSharedContent() {
    try {
      setLoading(true);
      const data = await shareService.accessShared(token);
      setContent(data);
    } catch (error: any) {
      setError(error.message || "Failed to load shared content");
    } finally {
      setLoading(false);
    }
  }

  function handleDownload() {
    try {
      const downloadUrl = `${process.env.NEXT_PUBLIC_API_URL}/shares/download/${token}`;
      downloadFile(downloadUrl, content.file.name);
      toast.success("Download started!");
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Failed to download file");
    }
  }

  function handleDownloadFile(fileId: string, fileName: string) {
    try {
      const downloadUrl = `${process.env.NEXT_PUBLIC_API_URL}/shares/download-folder/${token}/file/${fileId}`;
      downloadFile(downloadUrl, fileName);
      toast.success(`Download started: ${fileName}`);
    } catch (error) {
      console.error("Download failed:", error);
      toast.error(`Failed to download ${fileName}`);
    }
  }

  function handleDownloadFolder() {
    try {
      if (!content.folder) return;
      const downloadUrl = `${process.env.NEXT_PUBLIC_API_URL}/shares/download-folder/${token}`;
      downloadFile(downloadUrl, `${content.folder.name}.zip`);
      toast.success("Download started!");
    } catch (error) {
      console.error("Folder download failed:", error);
      toast.error("Failed to download folder");
    }
  }

  if (loading) {
    return (
      <div className={styles.pageContainer}>
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.error}>
          <h1>Error</h1>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.error}>
          <h1>Not Found</h1>
          <p>This share link does not exist or has expired.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.filePageContainer}>
      <div className={styles.card}>
        <div className={styles.fileHeader}>
          {content.sharedBy && (
            <p className={styles.sharedByText}>
              <strong>{content.sharedBy}</strong> shared with you
            </p>
          )}
          <h1 className={styles.header}>{content.folder?.name || content.file?.name}</h1>
        </div>

        <div className={styles.expiryInfo}>
          <p>Expires: {content.expiresAtFormatted}</p>
          <p>{content.remainingTime}</p>
        </div>

        {content.type === "file" && content.file && (
          <div className={styles.fileInfoFile}>
            <button className={styles.downloadBtn} onClick={handleDownload}>
              📥 Download File
            </button>
            <p className={styles.fileSizeFile}>Size: {(content.file.size / 1024 / 1024).toFixed(2)} MB</p>
            <p className={styles.mimeTypeFile}>Type: {content.file.mimeType}</p>
          </div>
        )}

        {content.type === "folder" && content.folder && (
          <div className={styles.folderContent}>
            <button className={styles.downloadBtn} onClick={handleDownloadFolder}>
              Download Folder as ZIP
            </button>
            <p className={styles.folderStats}>
              {content.folder.fileCount} files, {content.folder.folderCount} folders
            </p>

            {content.files && content.files.length > 0 && (
              <div className={styles.section}>
                <h3>Files:</h3>
                <ul className={styles.fileList}>
                  {content.files.map((file: any) => (
                    <li key={file.id} className={styles.fileItem}>
                      <div className={styles.fileItemInfo}>
                        <span className={styles.fileName}>
                          {getFileIconComponent(file)}
                          {file.name}
                        </span>
                        <span className={styles.fileSize}>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                      </div>
                      <button className={styles.fileDownloadBtn} onClick={() => handleDownloadFile(file.id, file.name)}>
                        📥
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {content.folders && content.folders.length > 0 && (
              <div className={styles.section}>
                <h3>Subfolders:</h3>
                <ul className={styles.folderList}>
                  {content.folders.map((folder: any) => (
                    <li key={folder.id} className={styles.fileItem}>
                      <div className={styles.fileItemInfo}>
                        <span className={styles.fileName}>
                          <Image
                            src="/folder-icon-white.svg"
                            alt="Folder"
                            width={20}
                            height={20}
                            className={styles.fileIcon}
                          />
                          {folder.name}
                        </span>
                      </div>
                      <button className={styles.fileDownloadBtn} onClick={() => handleDownloadFolder}>
                        📥
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Simple download status - browser will show native progress */}
      {downloadState.isDownloading && (
        <div
          style={{
            position: "fixed",
            bottom: "2rem",
            right: "2rem",
            background: "white",
            padding: "1rem",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            zIndex: 9999,
          }}
        >
          ⏳ Preparing download...
        </div>
      )}
    </div>
  );
}
