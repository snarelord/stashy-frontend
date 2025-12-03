"use client";

import styles from "./Sidebar.module.css";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ProfileCard from "../ProfileCard/ProfileCard";
import SidebarNavigation from "../SidebarNavigation/SidebarNavigation";

interface SidebarProps {
  showBackToDashboard?: boolean;
  collapsed?: boolean;
  setCollapsed?: (collapsed: boolean) => void;
}

export default function Sidebar({ showBackToDashboard = false, collapsed, setCollapsed }: SidebarProps) {
  const router = useRouter();
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const isControlled = typeof collapsed === "boolean" && typeof setCollapsed === "function";
  const actualCollapsed = isControlled ? collapsed : internalCollapsed;
  const handleToggle = () => {
    if (isControlled) {
      setCollapsed && setCollapsed(!collapsed);
    } else {
      setInternalCollapsed((prev) => !prev);
    }
  };

  return (
    <>
      <button
        className={styles.collapseButton}
        aria-label={actualCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        onClick={handleToggle}
      >
        {actualCollapsed ? (
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
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        )}
      </button>
      <aside className={styles.sidebar + (actualCollapsed ? " " + styles.collapsed : "")}>
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
    </>
  );
}
