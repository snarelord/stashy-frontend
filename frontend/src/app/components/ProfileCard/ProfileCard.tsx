import { useState, useEffect } from "react";
import { api } from "../../services/api";
import styles from "./ProfileCard.module.css";

export default function ProfileCard() {
  const [storageInfo, setStorageInfo] = useState({
    used: 0,
    total: 100,
    usedGB: "0.00",
    totalGB: "10.00",
  });

  useEffect(function () {
    loadStorageInfo();

    const handleRefresh = function () {
      loadStorageInfo();
    };

    window.addEventListener("refreshDashboard", handleRefresh);

    return function () {
      window.removeEventListener("refreshDashboard", handleRefresh);
    };
  }, []);

  async function loadStorageInfo() {
    try {
      const response = await api.getStorageInfo();

      if (response.success) {
        setStorageInfo(response.storage);
      }
    } catch (err) {
      console.error("Failed to load storage info:", err);
    }
  }

  return (
    <div className={styles.profileCard}>
      <div className={styles.avatarContainer}>
        <div
          className={styles.storageRing}
          style={{
            background: `conic-gradient(
                ${storageInfo.used >= 90 ? "#ef4444ff" : "#00d86fff"} ${storageInfo.used * 3.6}deg, 
                #ffffffff 0deg
              )`,
          }}
        >
          <div className={styles.avatar}>
            <span className={styles.avatarIcon}>👤</span>
          </div>
        </div>
      </div>
      <h3 className={styles.userName}>Kit Jones</h3>
      <p className={styles.storageText}>
        {storageInfo.usedGB} GB / {storageInfo.totalGB} GB ({storageInfo.used.toFixed(1)}%)
      </p>
    </div>
  );
}
