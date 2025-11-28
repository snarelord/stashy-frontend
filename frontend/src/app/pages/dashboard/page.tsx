"use client";

import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { api } from "../../services/api";
import useAuthRedirect from "../../hooks/useAuthRedirect";
import { useContextMenu } from "../../hooks/useContextMenu";
import { useFileOperations } from "../../hooks/useFileOperations";
import Spinner from "../../components/Spinner/Spinner";
import AllFiles from "../../components/AllFiles/AllFiles";
import Footer from "../../components/Footer/Footer";
import Sidebar from "../../components/Sidebar/Sidebar";
import DashboardHeader from "../../components/DashboardHeader/DashboardHeader";
import ContextMenu from "@/app/components/ContextMenu/ContextMenu";
import RecentFolders from "../../components/RecentFolders/RecentFolders";

export default function DashboardPage() {
  const { loading: authLoading, authenticated } = useAuthRedirect();
  const router = useRouter();
  const [files, setFiles] = useState<any[]>([]);
  const [folders, setFolders] = useState<any[]>([]);
  const { contextMenu, setContextMenu, handleContextMenu } = useContextMenu();
  const { loading, setLoading, handleDelete } = useFileOperations();

  async function loadUserFiles() {
    try {
      const foldersResponse = await api.getFolders();

      setFolders(foldersResponse.folders || []);
      const filesResponse = await api.getFiles();

      setFiles(filesResponse.files || []);

      console.log("Data loaded successfully");
    } catch (err) {
      console.error("Failed to load files:", err);
      setFiles([]);
      setFolders([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(function () {
    loadUserFiles();

    const handleFocus = function () {
      console.log("Dashboard refresh triggered");
      loadUserFiles();
    };

    window.addEventListener("focus", handleFocus);

    return function () {
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  if (authLoading) {
    return <Spinner />;
  }

  if (!authenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.pageWrapper}>
          <Sidebar />
          <div className={styles.mainContent}>
            <DashboardHeader />
            <p style={{ textAlign: "center", padding: "40px" }}>Loading...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageWrapper}>
        <Sidebar />

        <div className={styles.mainContent}>
          <DashboardHeader />
          <RecentFolders />
          <AllFiles />
          <ContextMenu />
        </div>
      </div>

      <Footer />
    </div>
  );
}
