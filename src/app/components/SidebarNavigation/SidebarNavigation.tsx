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
        <button name="back-to-dashboard" className={styles.backButton} onClick={() => router.push("/pages/dashboard")}>
          <span className={styles.backArrow}>←</span>
          Back to Dashboard
        </button>
      )}
      <button className={styles.navItem}>Upload file</button>
      <button name="dashboard" className={styles.navItem} onClick={() => router.push("/pages/dashboard")}>
        Dashboard
      </button>
      <button name="all-folders" className={styles.navItem} onClick={() => router.push("/pages/all-folders")}>
        Folders
      </button>
      <button className={styles.navItem}>Shared files</button>
    </nav>
  );
}
