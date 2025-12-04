"use client";

import styles from "./FolderHeader.module.css";
import Link from "next/link";
import Image from "next/image";
import { RefObject, ChangeEvent } from "react";

interface Breadcrumb {
  id: string;
  name: string;
}

interface FolderHeaderProps {
  breadcrumbs: Breadcrumb[];
  folderName: string;
  folderId: string;
  uploading: boolean;
  isCreatingFolder: boolean;
  newFolderName: string;
  onUploadClick: () => void;
  onCreateFolderStart: () => void;
  onCreateFolderConfirm: () => void;
  onCreateFolderCancel: () => void;
  onFolderNameChange: (name: string) => void;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function FolderHeader({
  breadcrumbs,
  folderName,
  folderId,
  uploading,
  isCreatingFolder,
  newFolderName,
  onUploadClick,
  onCreateFolderStart,
  onCreateFolderConfirm,
  onCreateFolderCancel,
  onFolderNameChange,
  fileInputRef,
  onFileChange,
}: FolderHeaderProps) {
  return (
    <section className={styles.folderHeader}>
      <div className={styles.breadcrumb}>
        <Link href="/pages/dashboard" className={styles.breadcrumbLink}>
          Dashboard
        </Link>

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
        <Image src="/folder-icon-white.svg" alt="Folder" width={28} height={28} className={styles.folderIcon} />
        {folderName || folderId}
      </h1>

      <div className={styles.folderActions}>
        {!isCreatingFolder ? (
          <>
            <button className={styles.actionButton} onClick={onUploadClick} disabled={uploading}>
              {uploading ? "Uploading..." : "Upload file"}
            </button>
            <button className={styles.actionButton} onClick={onCreateFolderStart}>
              New folder
            </button>
            <input ref={fileInputRef} type="file" multiple onChange={onFileChange} style={{ display: "none" }} />
          </>
        ) : (
          <div className={styles.createFolderContainer}>
            <input
              type="text"
              placeholder="Enter folder name..."
              value={newFolderName}
              onChange={(e) => onFolderNameChange(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") onCreateFolderConfirm();
              }}
              className={styles.folderInput}
              autoFocus
            />
            <button className={styles.confirmButton} onClick={onCreateFolderConfirm}>
              Create
            </button>
            <button className={styles.cancelButton} onClick={onCreateFolderCancel}>
              Cancel
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
