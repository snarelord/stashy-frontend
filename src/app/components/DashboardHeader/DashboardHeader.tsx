"use client";

import styles from "./DashboardHeader.module.css";
import Image from "next/image";

interface DashboardHeaderProps {
  collapsed?: boolean;
  onToggleSidebar?: () => void;
}

export default function DashboardHeader({ collapsed, onToggleSidebar }: DashboardHeaderProps) {
  return (
    <header className={styles.header}>
      <button
        className={styles.collapseButton}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        onClick={onToggleSidebar}
      >
        {collapsed ? (
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        ) : (
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ transform: "rotate(180deg)" }}
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        )}
      </button>
      <div className={styles.searchContainer}>
        <input type="text" placeholder="Search" className={styles.searchInput} />
        <span className={styles.searchIcon}>🔍</span>
      </div>
      <div className={styles.logoContainer}>
        <Image src="/stashy-white.svg" alt="Stashy Logo" width={150} height={45} loading="eager" />
      </div>
    </header>
  );
}
