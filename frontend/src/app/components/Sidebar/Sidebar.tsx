"use client";

import { useState, useEffect } from "react";
import { mockApi } from "../../services/mockApi";
import styles from "./Sidebar.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface SidebarProps {
  showBackToDashboard?: boolean;
}

export default function Sidebar({ showBackToDashboard = false }: SidebarProps) {
  const router = useRouter();
  const [storageInfo, setStorageInfo] = useState({ used: 82, usedGB: 8.2, totalGB: 10 });

  useEffect(() => {
    loadStorageInfo();
  }, []);

  const loadStorageInfo = async () => {
    try {
      const data = await mockApi.getStorageInfo();
      setStorageInfo(data);
    } catch (err) {
      console.error("Failed to load storage info:", err);
    }
  };

  return (
    <aside className={styles.sidebar}>
      {/* Profile Card */}
      <div className={styles.profileCard}>
        <div className={styles.avatarContainer}>
          <div
            className={styles.storageRing}
            style={{ background: `conic-gradient(#00d86fff ${storageInfo.used * 3.6}deg, #ffffffff 0deg)` }}
          >
            <div className={styles.avatar}>
              <span className={styles.avatarIcon}>👤</span>
            </div>
          </div>
        </div>
        <h3 className={styles.userName}>Kit Jones</h3>
        <p className={styles.storageText}>{storageInfo.used}% of Storage Used</p>
      </div>

      {/* Navigation Items */}
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

      {/* Sign Out Button */}
      <Link href="/" className={styles.signOutButton}>
        Sign out
      </Link>
    </aside>
  );
}
