import { useState, useEffect } from "react";
import { shareService } from "../../services/shares";
import styles from "./ShareModal.module.css";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileId?: string;
  folderId?: string;
  fileName?: string;
  folderName?: string;
}

export default function ShareModal({ isOpen, onClose, fileId, folderId, fileName, folderName }: ShareModalProps) {
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [expiresIn, setExpiresIn] = useState<number | null>(24); // Default 1 day
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [presets, setPresets] = useState<Array<{ label: string; value: number | null }>>([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      loadPresets();
    }
  }, [isOpen]);

  async function loadPresets() {
    try {
      const data = await shareService.getPresets();
      setPresets(data.presets);
    } catch (error) {
      console.error("Failed to load presets: ", error);
    }
  }

  async function handleCreateShare() {
    setLoading(true);
    setError(null);

    try {
      let response;

      if (fileId) {
        response = await shareService.createFileShare(fileId, expiresIn);
      } else if (folderId) {
        response = await shareService.createFolderShare(folderId, expiresIn);
      } else {
        throw new Error("No file or folder ID provided");
      }
      setShareLink(response.shareLink.url);
    } catch (error: any) {
      console.error("Failed to create share link:", error);
      const errorMessage = error?.message || error?.response?.data?.error || "Failed to create share link";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  function handleCopy() {
    if (shareLink) {
      navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  function handleClose() {
    setShareLink(null);
    setCopied(false);
    onClose();
  }

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={handleClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.header}>Share {fileId ? fileName : folderName}</h2>

        {!shareLink ? (
          <>
            <div className={styles.formGroup}>
              <label>Expires in:</label>
              <select
                value={expiresIn ?? "never"}
                onChange={(e) => setExpiresIn(e.target.value === "never" ? null : Number(e.target.value))}
              >
                {presets.map((preset) => (
                  <option key={preset.label} value={preset.value ?? "never"}>
                    {preset.label}
                  </option>
                ))}
              </select>
            </div>

            <button onClick={handleCreateShare} disabled={loading}>
              {loading ? "Creating..." : "Create Share Link"}
            </button>
          </>
        ) : (
          <>
            <div className={styles.shareLinkDisplay}>
              <input type="text" value={shareLink} readOnly />
              <button onClick={handleCopy}>{copied ? "Copied!" : "Copy"}</button>
            </div>
          </>
        )}

        <button onClick={handleClose}>Close</button>
      </div>
    </div>
  );
}
