import styles from "./SidebarNavigation.module.css";
import { useRouter } from "next/navigation";

interface SidebarProps {
  showBackToDashboard?: boolean;
}

export default function SidebarNavigation({ showBackToDashboard = false }: SidebarProps) {
  const router = useRouter();

  return (
    <nav className={styles.nav}>
      {showBackToDashboard && (
        <button className={styles.backButton} onClick={() => router.push("/pages/dashboard")}>
          <span className={styles.backArrow}>←</span>
          Back to Dashboard
        </button>
      )}
      <button className={styles.navItem}>
        <span className={styles.navIcon}>📤</span>
        Upload file
      </button>
      <button className={styles.navItem} onClick={() => router.push("/pages/dashboard")}>
        <span className={styles.navIcon}>📄</span>
        All files
      </button>
      <button className={styles.navItem} onClick={() => router.push("/pages/all-folders")}>
        <span className={styles.navIcon}>📁</span>
        Folders
      </button>
      <button className={styles.navItem}>
        <span className={styles.navIcon}>👥</span>
        Shared files
      </button>
    </nav>
  );
}
