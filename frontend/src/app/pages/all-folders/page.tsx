"use client";

import styles from "./page.module.css";
import Sidebar from "../../components/Sidebar/Sidebar";
import DashboardHeader from "../../components/DashboardHeader/DashboardHeader";
import Footer from "../../components/Footer/Footer";
import { useRouter } from "next/navigation";

export default function FoldersPage() {
  const router = useRouter();

  const handleFolderClick = (folderId: string) => {
    router.push(`/pages/folder/${folderId}`);
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageWrapper}>
        <Sidebar />

        <div className={styles.mainContent}>
          <DashboardHeader />

          {/* Folders Header */}
          <section className={styles.foldersHeader}>
            <h1 className={styles.pageTitle}>
              <span className={styles.titleIcon}>📁</span>
              All Folders
            </h1>
            <div className={styles.headerActions}>
              <button className={styles.actionButton}>Create folder</button>
            </div>
          </section>

          {/* Folders Grid */}
          <section className={styles.foldersSection}>
            <div className={styles.foldersGrid}>
              {/* Folder Card 1 */}
              <div className={styles.folderCard} onClick={() => handleFolderClick("new-music")}>
                <div className={styles.folderIconLarge}>📁</div>
                <h3 className={styles.folderName}>New Music</h3>
                <p className={styles.folderInfo}>12 files</p>
              </div>

              {/* Folder Card 2 */}
              <div className={styles.folderCard} onClick={() => handleFolderClick("video-bits")}>
                <div className={styles.folderIconLarge}>📁</div>
                <h3 className={styles.folderName}>Video Bits</h3>
                <p className={styles.folderInfo}>8 files</p>
              </div>

              {/* Folder Card 3 */}
              <div className={styles.folderCard} onClick={() => handleFolderClick("documents")}>
                <div className={styles.folderIconLarge}>📁</div>
                <h3 className={styles.folderName}>Documents</h3>
                <p className={styles.folderInfo}>24 files</p>
              </div>

              {/* Folder Card 4 */}
              <div className={styles.folderCard} onClick={() => handleFolderClick("photos")}>
                <div className={styles.folderIconLarge}>📁</div>
                <h3 className={styles.folderName}>Photos</h3>
                <p className={styles.folderInfo}>156 files</p>
              </div>

              {/* Folder Card 5 */}
              <div className={styles.folderCard} onClick={() => handleFolderClick("projects")}>
                <div className={styles.folderIconLarge}>📁</div>
                <h3 className={styles.folderName}>Projects</h3>
                <p className={styles.folderInfo}>32 files</p>
              </div>
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}
