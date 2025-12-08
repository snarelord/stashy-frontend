import { useState } from "react";

interface DownloadState {
  isDownloading: boolean;
  fileName: string;
}

export function useNativeDownload() {
  const [downloadState, setDownloadState] = useState<DownloadState>({
    isDownloading: false,
    fileName: "",
  });

  function downloadFile(url: string, fileName: string) {
    setDownloadState({
      isDownloading: true,
      fileName,
    });

    try {
      // create download link and trigger browsers native download
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      link.style.display = "none";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // reset state after a short delay
      setTimeout(() => {
        setDownloadState({
          isDownloading: false,
          fileName: "",
        });
      }, 1000);

      return true;
    } catch (error) {
      console.error("Download failed:", error);
      setDownloadState({
        isDownloading: false,
        fileName: "",
      });
      throw error;
    }
  }

  function closeDownload() {
    setDownloadState({
      isDownloading: false,
      fileName: "",
    });
  }

  return {
    downloadState,
    downloadFile,
    closeDownload,
  };
}
