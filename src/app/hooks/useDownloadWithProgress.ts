import { useState } from "react";

interface DownloadState {
  isDownloading: boolean;
  progress: number;
  fileName: string;
}

export function useDownloadWithProgress() {
  const [downloadState, setDownloadState] = useState<DownloadState>({
    isDownloading: false,
    progress: 0,
    fileName: "",
  });

  async function downloadWithProgress(url: string, fileName: string) {
    setDownloadState({
      isDownloading: true,
      progress: 0,
      fileName,
    });

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Download failed");
      }

      const contentLength = response.headers.get("content-length");
      const total = contentLength ? parseInt(contentLength, 10) : 0;

      if (!response.body) {
        throw new Error("Response body is empty");
      }

      const reader = response.body.getReader();
      const chunks: Uint8Array<ArrayBuffer>[] = [];
      let receivedLength = 0;

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        chunks.push(value);
        receivedLength += value.length;

        if (total > 0) {
          const progress = (receivedLength / total) * 100;
          setDownloadState((prev) => ({
            ...prev,
            progress,
          }));
        }
      }

      // Combine chunks into a single blob
      const blob = new Blob(chunks);
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();

      window.URL.revokeObjectURL(blobUrl);
      document.body.removeChild(a);

      setDownloadState((prev) => ({
        ...prev,
        progress: 100,
      }));

      return true;
    } catch (error) {
      console.error("Download failed:", error);
      setDownloadState({
        isDownloading: false,
        progress: 0,
        fileName: "",
      });
      throw error;
    }
  }

  function closeDownload() {
    setDownloadState({
      isDownloading: false,
      progress: 0,
      fileName: "",
    });
  }

  return {
    downloadState,
    downloadWithProgress,
    closeDownload,
  };
}
