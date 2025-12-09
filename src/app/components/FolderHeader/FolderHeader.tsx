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
}

export default function FolderHeader({ breadcrumbs, folderName, folderId }: FolderHeaderProps) {
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
    </section>
  );
}
