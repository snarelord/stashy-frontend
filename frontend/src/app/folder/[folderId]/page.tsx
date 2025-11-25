import styles from "./page.module.css";
import Sidebar from "@/app/components/Sidebar/Sidebar";
import DashboardHeader from "@/app/components/DashboardHeader/DashboardHeader";
import Footer from "@/app/components/Footer/Footer";

interface FolderPageProps {
  params: {
    folderId: string;
  };
}

export default function FolderPage({ params }: FolderPageProps) {
  const { folderId } = params;

  // TODO: Fetch folder data from backend using folderId
  // For now, using mock data
  const folderName = `Folder ${folderId}`;

  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageWrapper}>
        <Sidebar />

        <div className={styles.mainContent}>
          <DashboardHeader />

          {/* Folder Header */}
          <section className={styles.folderHeader}>
            <div className={styles.breadcrumb}>
              <a href="/dashboard" className={styles.breadcrumbLink}>
                Dashboard
              </a>
              <span className={styles.breadcrumbSeparator}>/</span>
              <span className={styles.breadcrumbCurrent}>{folderName}</span>
            </div>
            <h1 className={styles.folderTitle}>
              <span className={styles.folderIcon}>📁</span>
              {folderName}
            </h1>
            <div className={styles.folderActions}>
              <button className={styles.actionButton}>Upload file</button>
              <button className={styles.actionButton}>New folder</button>
            </div>
          </section>

          {/* Folder Contents Table */}
          <section className={styles.folderContents}>
            <p className={styles.fileCount}>//Folder contents</p>
            <div className={styles.fileTable}>
              {/* Table Header */}
              <div className={styles.tableHeader}>
                <div className={styles.tableHeaderCell}>File Name</div>
                <div className={styles.tableHeaderCell}>Size</div>
                <div className={styles.tableHeaderCell}>Modified</div>
              </div>

              {/* Mock Table Rows - Replace with real data */}

              {/* Empty State - Show when no files */}
              <div className={styles.emptyState}>
                <span className={styles.emptyIcon}>📂</span>
                <p>This folder is empty</p>
                <button className={styles.uploadButton}>Upload your first file</button>
              </div>
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}
