"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./FileTable.module.css";
import { getFileIcon } from "../../utils/getFileIcons";

interface FileTableProps {
  subfolders: any[];
  files: any[];
  onFolderClick: (folderId: string) => void;
  onFileDownload: (file: any, e: React.MouseEvent) => void;
  onFolderDownload: (folder: any, e: React.MouseEvent) => void;
  onDelete: (item: any, type: "file" | "folder") => void;
  onContextMenu: (e: React.MouseEvent, item: any, type: "file" | "folder") => void;
  onUploadClick?: () => void;
}

export default function FileTable({
  subfolders,
  files,
  onFolderClick,
  onFileDownload,
  onFolderDownload,
  onDelete,
  onContextMenu,
  onUploadClick,
}: FileTableProps) {
  const router = useRouter();

  return (
    <section className={styles.folderContents}>
      <p className={styles.fileCount}>
        //Folder contents ({subfolders.length + files.length}{" "}
        {subfolders.length + files.length === 1 ? "item" : "items"})
      </p>
      <div className={styles.fileTable}>
        <div className={styles.tableHeader}>
          <div className={styles.tableHeaderCell}>Name</div>
          <div className={styles.tableHeaderCell}>Modified</div>
          <div className={styles.tableHeaderCell}>Actions</div>
        </div>

        {subfolders.map((subfolder) => (
          <div
            key={subfolder.id}
            className={styles.tableRow}
            onClick={() => onFolderClick(subfolder.id)}
            onContextMenu={(e) => onContextMenu(e, subfolder, "folder")}
          >
            <div className={styles.tableCell}>
              <Image src="/folder-icon-white.svg" alt="Folder" width={20} height={20} className={styles.fileIcon} />
              {subfolder.name}
            </div>
            <div className={styles.tableCell}>
              {subfolder.createdAt ? new Date(subfolder.createdAt).toLocaleDateString() : "—"}
            </div>
            <div className={styles.tableCell}>
              <button
                onClick={(e) => onFolderDownload(subfolder, e)}
                className={styles.actionButtonIcon}
                title="Download folder as ZIP"
              >
                📥
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(subfolder, "folder");
                }}
                className={styles.actionButtonIcon}
                title="Delete folder"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}

        {files.map((file) => {
          const isAudio = file.mimeType?.startsWith("audio/");
          const isImage = file.mimeType?.startsWith("image/");
          return (
            <div
              key={file.id}
              className={styles.tableRow}
              onClick={() => {
                if (isAudio) {
                  router.push(`/pages/audio-preview/${file.id}`);
                } else if (isImage) {
                  router.push(`/pages/image-preview/${file.id}`);
                }
              }}
              onContextMenu={(e) => onContextMenu(e, file, "file")}
              style={{ cursor: isAudio || isImage ? "pointer" : "default" }}
            >
              <div className={styles.tableCell}>
                <span className={styles.fileIcon}>{getFileIcon(file.mimeType)}</span>
                {file.name}
              </div>
              <div className={styles.tableCell}>
                {file.createdAt ? new Date(file.createdAt).toLocaleDateString() : "—"}
              </div>
              <div className={styles.tableCell}>
                <button
                  onClick={(e) => onFileDownload(file, e)}
                  className={styles.actionButtonIcon}
                  title="Download file"
                >
                  📥
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(file, "file");
                  }}
                  className={styles.actionButtonIcon}
                  title="Delete file"
                >
                  🗑️
                </button>
              </div>
            </div>
          );
        })}

        {subfolders.length === 0 && files.length === 0 && (
          <div className={styles.emptyState}>
            <span className={styles.emptyIcon}>📂</span>
            <p>This folder is empty</p>
            {onUploadClick && (
              <button className={styles.uploadButton} onClick={onUploadClick}>
                Upload your first file
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
