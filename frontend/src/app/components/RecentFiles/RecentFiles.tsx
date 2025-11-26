import styles from "./RecentFiles.module.css";
import Image from "next/image";

export default function RecentFiles() {
  return (
    <section className={styles.recentSection}>
      <h2 className={styles.sectionTitle}>Recent Files</h2>
      <div className={styles.recentFilesGrid}>
        {/* File Card 1 */}
        <div className={styles.fileCard}>
          <Image src="/folder-icon-purple.png" alt="Folder" width={36} height={36} className={styles.folderIcon} />
          <p className={styles.fileName}>FILE_NAME.mp3</p>
        </div>

        {/* File Card 2 */}
        <div className={styles.fileCard}>
          <Image src="/folder-icon-purple.png" alt="Folder" width={36} height={36} className={styles.folderIcon} />
          <p className={styles.fileName}>LONGER_EXAMPLE_FILE_NAME.mp4</p>
        </div>

        {/* File Card 3 */}
        <div className={styles.fileCard}>
          <Image src="/folder-icon-purple.png" alt="Folder" width={36} height={36} className={styles.folderIcon} />
          <p className={styles.fileName}>file name with spaces.wav</p>
        </div>

        {/* File Card 4 */}
        <div className={styles.fileCard}>
          <Image src="/folder-icon-purple.png" alt="Folder" width={36} height={36} className={styles.folderIcon} />
          <p className={styles.fileName}>FILE_NAME.mp3</p>
        </div>

        {/* File Card 5 */}
        <div className={styles.fileCard}>
          <Image src="/folder-icon-purple.png" alt="Folder" width={36} height={36} className={styles.folderIcon} />
          <p className={styles.fileName}>file.wav</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className={styles.actionButtons}>
        <button className={styles.actionButton}>Create folder</button>
        <button className={styles.actionButtonPrimary}>
          Upload <span className={styles.uploadIcon}>📤</span>
        </button>
      </div>
    </section>
  );
}
