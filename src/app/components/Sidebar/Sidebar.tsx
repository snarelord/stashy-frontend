"use client";

import styles from "./Sidebar.module.css";
import { useRouter } from "next/navigation";
import ProfileCard from "../ProfileCard/ProfileCard";
import SidebarNavigation from "../SidebarNavigation/SidebarNavigation";

interface SidebarProps {
  showBackToDashboard?: boolean;
}

export default function Sidebar({ showBackToDashboard = false }: SidebarProps) {
  const router = useRouter();

  return (
    <aside className={styles.sidebar}>
      <ProfileCard />
      <SidebarNavigation />

      {/* Sign Out Button */}
      <button
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
