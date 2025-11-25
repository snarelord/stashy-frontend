import styles from "./DashboardHeader.module.css";
import Image from "next/image";

export default function DashboardHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.logoContainer}>
        <Image src="/stashy-black.png" alt="Stashy Logo" width={150} height={45} />
      </div>
      <div className={styles.searchContainer}>
        <input type="text" placeholder="Search" className={styles.searchInput} />
        <span className={styles.searchIcon}>🔍</span>
      </div>
    </header>
  );
}
