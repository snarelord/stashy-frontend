import { useEffect } from "react";
import styles from "./DownloadProgress.module.css";

interface DownloadProgressProps {
  fileName: string;
  progress: number;
  isVisible: boolean;
  onClose: () => void;
}

export default function DownloadProgress({ fileName, progress, isVisible, onClose }: DownloadProgressProps) {
  useEffect(() => {
    if (progress >= 100) {
      const timer = setTimeout(() => {
        onClose();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [progress, onClose]);

  if (!isVisible) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h3>Downloading {fileName}</h3>
          <button className={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>

        <div className={styles.progressContainer}>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${progress}%` }} />
          </div>
          <div className={styles.progressText}>
            {progress < 100 ? `${Math.round(progress)}%` : "✓ Download Complete"}
          </div>
        </div>

        {progress >= 100 && <div className={styles.successMessage}>File saved to your downloads folder</div>}
      </div>
    </div>
  );
}
