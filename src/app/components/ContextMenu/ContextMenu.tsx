import styles from "./ContextMenu.module.css";

interface ContextMenuProps {
  contextMenu: {
    x: number;
    y: number;
    item: any;
    type: "file" | "folder";
  } | null;
  onDownloadFile: (file: any, e: React.MouseEvent) => void;
  onDownloadFolder: (folder: any, e: React.MouseEvent) => void;
  onShare: (item: any, type: "file" | "folder") => void;
  onRename: (item: any, type: "file" | "folder") => void;
  onDelete: (item: any, type: "file" | "folder") => void;
  onClose: () => void;
}

export default function ContextMenu({
  contextMenu,
  onDownloadFile,
  onDownloadFolder,
  onShare,
  onRename,
  onDelete,
  onClose,
}: ContextMenuProps) {
  if (!contextMenu) return null;

  return (
    <div
      className={styles.contextMenu}
      style={{ top: contextMenu.y, left: contextMenu.x }}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        className={styles.contextMenuItem}
        onClick={() => {
          onShare(contextMenu.item, contextMenu.type);
          onClose();
        }}
      >
        Share
      </button>
      {contextMenu.type === "file" && (
        <>
          <button
            className={styles.contextMenuItem}
            onClick={(e) => {
              e.stopPropagation();
              onDownloadFile(contextMenu.item, e);
              onClose();
            }}
          >
            Download
          </button>
          <button
            className={styles.contextMenuItem}
            onClick={() => {
              onRename(contextMenu.item, "file");
              onClose();
            }}
          >
            Rename
          </button>
          <button
            className={styles.contextMenuItem}
            onClick={() => {
              onDelete(contextMenu.item, "file");
              onClose();
            }}
          >
            Delete
          </button>
        </>
      )}
      {contextMenu.type === "folder" && (
        <>
          <button
            className={styles.contextMenuItem}
            onClick={(e) => {
              e.stopPropagation();
              onDownloadFolder(contextMenu.item, e);
              onClose();
            }}
          >
            Download as ZIP
          </button>
          <button
            className={styles.contextMenuItem}
            onClick={() => {
              onDelete(contextMenu.item, "folder");
              onClose();
            }}
          >
            Delete
          </button>
        </>
      )}
    </div>
  );
}
