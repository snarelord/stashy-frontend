"use client";

import styles from "./page.module.css";
import Footer from "../../components/Footer/Footer";
import Sidebar from "../../components/Sidebar/Sidebar";
import DashboardHeader from "../../components/DashboardHeader/DashboardHeader";
import RecentFiles from "../../components/RecentFiles/RecentFiles";
import { useRouter } from "next/navigation";
import Image from "next/image";

// backend would look something like this for folders:
// {folders.map(folder => (
//   <div
//     key={folder.id}
//     className={styles.tableRow}
//     onClick={() => handleFolderClick(folder.id)}
//   >
//     <div className={styles.tableCell}>
//       <Image src="/folder-icon-purple.png" alt="Folder" width={20} height={20} className={styles.fileIcon} />
//       {folder.name}
//     </div>
//     ...
//   </div>
// ))}

export default function DashboardPage() {
  const router = useRouter();

  const handleFolderClick = (folderId: string) => {
    router.push(`/pages/folder/${folderId}`);
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageWrapper}>
        <Sidebar />

        {/* Main Content */}
        <div className={styles.mainContent}>
          <DashboardHeader />

          <RecentFiles />

          {/* File List Table */}
          <section className={styles.fileListSection}>
            <p className={styles.fileCount}>//All files</p>
            <div className={styles.fileTable}>
              {/* Table Header */}
              <div className={styles.tableHeader}>
                <div className={styles.tableHeaderCell}>File Name</div>
                <div className={styles.tableHeaderCell}>Modified</div>
              </div>

              {/* Table Rows */}
              <div className={styles.tableRow} onClick={() => handleFolderClick("new-music")}>
                <div className={styles.tableCell}>
                  <Image
                    src="/folder-icon-purple.png"
                    alt="Folder"
                    width={20}
                    height={20}
                    className={styles.fileIcon}
                  />
                  New Music
                </div>
                <div className={styles.tableCell}></div>
              </div>

              <div className={styles.tableRow} onClick={() => handleFolderClick("video-bits")}>
                <div className={styles.tableCell}>
                  <Image
                    src="/folder-icon-purple.png"
                    alt="Folder"
                    width={20}
                    height={20}
                    className={styles.fileIcon}
                  />
                  Video Bits
                </div>
                <div className={styles.tableCell}></div>
              </div>

              <div className={styles.tableRow}>
                <div className={styles.tableCell}>
                  <span className={styles.fileIcon}>🎵</span>
                  File name with spaces.mp3
                </div>
                <div className={styles.tableCell}></div>
              </div>

              <div className={styles.tableRow}>
                <div className={styles.tableCell}>
                  <span className={styles.fileIcon}>🎵</span>
                  FILE_NAME.mp3
                </div>
                <div className={styles.tableCell}></div>
              </div>

              <div className={styles.tableRow}>
                <div className={styles.tableCell}>
                  <span className={styles.fileIcon}>🎵</span>
                  file.mp3
                </div>
                <div className={styles.tableCell}></div>
              </div>

              <div className={styles.tableRow}>
                <div className={styles.tableCell}>
                  <span className={styles.fileIcon}>🖼️</span>
                  image.jpeg
                </div>
                <div className={styles.tableCell}></div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
