import { useState } from "react";
import { shareService } from "../services/shares";
import toast from "react-hot-toast";

export function useQuickShare() {
  const [loading, setLoading] = useState(false);

  async function quickShareFile(fileId: string, fileName: string) {
    setLoading(true);
    try {
      // 30 days = 720 hours
      const response = await shareService.createFileShare(fileId, 720);

      // Copy to clipboard
      await navigator.clipboard.writeText(response.shareLink.url);

      toast.success(`Share link copied for ${fileName}!`);
      return response.shareLink.url;
    } catch (error: any) {
      console.error("Quick share failed:", error);
      toast.error("Failed to create share link");
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function quickShareFolder(folderId: string, folderName: string) {
    setLoading(true);
    try {
      // 30 days = 720 hours
      const response = await shareService.createFolderShare(folderId, 720);

      // Copy to clipboard
      await navigator.clipboard.writeText(response.shareLink.url);

      toast.success(`Share link copied for ${folderName}!`);
      return response.shareLink.url;
    } catch (error: any) {
      console.error("Quick share failed:", error);
      toast.error("Failed to create share link");
      throw error;
    } finally {
      setLoading(false);
    }
  }

  return {
    quickShareFile,
    quickShareFolder,
    loading,
  };
}
