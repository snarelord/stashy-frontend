import { useEffect, useState } from "react";
import styles from "./VideoPreview.module.css";
import { api } from "../../services/api";
import Image from "next/image";
import { useRouter } from "next/navigation";

type VideoPreviewProps = {
  fileId: string;
};

export default function VideoPreview({ fileId }: VideoPreviewProps) {
  const [file, setFile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchFile() {
      setLoading(true);
      setError(null);
      try {
        const response = await api.getFile(fileId);
        setFile(response.file);
      } catch (err: any) {
        setError("Failed to load image file");
      } finally {
        setLoading(false);
      }
    }
    fetchFile();
  }, [fileId]);

  if (loading) {
    return <div className={styles.loadingText}>Loading video...</div>;
  }
  if (error || !file) {
    return <div className={styles.loadingText}>{error || "Video not found"}</div>;
  }

  const videoUrl = `${process.env.NEXT_PUBLIC_API_URL}/files/stream/${file.id}`;

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <button className={styles.backButton} onClick={() => router.back()} title="Back">
          ✕
        </button>
        <div className={styles.fileInfo}>
          <h2 className={styles.fileName}>{file.name}</h2>
          <p className={styles.fileDetails}>{file.size ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : ""}</p>
        </div>
        <a className={styles.downloadButton} href={videoUrl} download={file.name} title="Download image">
          Download
        </a>
      </header>
      <main className={styles.videoMain}>
        <div className={styles.videoPreviewContainer}>
          {file.mimeType && file.mimeType.startsWith("video/") ? (
            <video src={videoUrl} width={600} height={400} className={styles.previewVideo} />
          ) : (
            <div>Not a video file</div>
          )}
        </div>
      </main>
      <footer className={styles.footer}>
        <div className={styles.footerContent}></div>
      </footer>
    </div>
  );
}
