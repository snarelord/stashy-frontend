"use client";

import styles from "./Sidebar.module.css";
import { useRouter } from "next/navigation";
import ProfileCard from "../ProfileCard/ProfileCard";
import SidebarNavigation from "../SidebarNavigation/SidebarNavigation";

interface SidebarProps {
  showBackToDashboard?: boolean;
  collapsed?: boolean;
  onToggleSidebar?: () => void;
}

export default function Sidebar({ showBackToDashboard = false, collapsed, onToggleSidebar }: SidebarProps) {
  const router = useRouter();

  return (
    <aside className={styles.sidebar + (collapsed ? " " + styles.collapsed : "")}>
      {onToggleSidebar && (
        <button className={styles.mobileCloseButton} aria-label="Close sidebar" onClick={onToggleSidebar}>
          ✕
        </button>
      )}
      <ProfileCard />
      <SidebarNavigation />
      <button
        name="sign-out"
        className={styles.signOutButton}
        onClick={() => {
          if (typeof window !== "undefined") {
            localStorage.removeItem("token");
            window.location.href = "/pages/sign-in";
          }
        }}
      >
        Sign out
      </button>
    </aside>
  );
}
