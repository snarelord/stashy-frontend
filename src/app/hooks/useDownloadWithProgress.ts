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

      console.log("Download started:", { fileName, contentLength, total });

      if (!response.body) {
        throw new Error("Response body is empty");
      }

      // Check if file is large (>50MB) and use streaming approach
      const isLargeFile = total > 50 * 1024 * 1024; // 50MB threshold

      if (isLargeFile && "showSaveFilePicker" in window) {
        // Use File System Access API for large files (Chrome/Edge)
        return await downloadWithFileSystemAPI(response, fileName, total);
      } else {
        // Use traditional blob approach for smaller files or unsupported browsers
        return await downloadWithBlob(response, fileName, total);
      }
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

  // Traditional blob approach (current method)
  async function downloadWithBlob(response: Response, fileName: string, total: number) {
    if (total === 0) {
      // If no content-length, fall back to simple blob conversion
      const blob = await response.blob();
      setDownloadState((prev) => ({ ...prev, progress: 100 }));

      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();

      window.URL.revokeObjectURL(blobUrl);
      document.body.removeChild(a);
      return true;
    }

    const reader = response.body!.getReader();
    const chunks: Uint8Array[] = [];
    let receivedLength = 0;
    let lastProgressUpdate = 0;

    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      chunks.push(value); // Keep original value, don't convert
      receivedLength += value.length;

      // Update progress
      const progress = (receivedLength / total) * 100;
      const currentProgress = Math.floor(progress);

      if (currentProgress > lastProgressUpdate) {
        lastProgressUpdate = currentProgress;
        setDownloadState((prev) => ({
          ...prev,
          progress: currentProgress,
        }));
      }
    }

    console.log("Download complete, creating blob...", {
      totalChunks: chunks.length,
      totalBytes: receivedLength,
    });

    setDownloadState((prev) => ({ ...prev, progress: 100 }));

    const blob = new Blob(chunks as BlobPart[]);
    const blobUrl = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();

    window.URL.revokeObjectURL(blobUrl);
    document.body.removeChild(a);

    return true;
  }

  // Memory-efficient streaming approach for large files
  async function downloadWithFileSystemAPI(response: Response, fileName: string, total: number) {
    try {
      // @ts-ignore - File System Access API types might not be available
      const fileHandle = await window.showSaveFilePicker({
        suggestedName: fileName,
        types: [
          {
            description: "Files",
            accept: { "*/*": ["*"] },
          },
        ],
      });

      // @ts-ignore
      const writable = await fileHandle.createWritable();
      const reader = response.body!.getReader();
      let receivedLength = 0;
      let lastProgressUpdate = 0;

      try {
        while (true) {
          const { done, value } = await reader.read();

          if (done) break;

          // Write directly to file without storing in memory
          await writable.write(value);
          receivedLength += value.length;

          // Update progress
          let progress = 0;
          if (total > 0) {
            progress = (receivedLength / total) * 100;
          } else {
            progress = Math.min((receivedLength / (1024 * 1024)) * 5, 90);
          }

          const currentProgress = Math.floor(progress);
          if (currentProgress > lastProgressUpdate) {
            lastProgressUpdate = currentProgress;
            setDownloadState((prev) => ({
              ...prev,
              progress: currentProgress,
            }));
          }
        }
      } finally {
        await writable.close();
      }

      console.log("Download complete (streamed):", {
        totalBytes: receivedLength,
      });

      setDownloadState((prev) => ({ ...prev, progress: 100 }));
      return true;
    } catch (error) {
      // Fall back to blob method if user cancels file picker or API fails
      console.log("File System API failed, falling back to blob method:", error);
      return await downloadWithBlob(response, fileName, total);
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
