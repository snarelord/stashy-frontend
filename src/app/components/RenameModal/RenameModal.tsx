import { useEffect, useMemo } from "react";
import styles from "./RenameModal.module.css";

interface RenameModalProps {
  isOpen: boolean;
  itemName: string;
  itemType: "file" | "folder";
  newName: string;
  onNameChange: (newName: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function RenameModal({
  isOpen,
  itemName,
  itemType,
  newName,
  onNameChange,
  onConfirm,
  onCancel,
}: RenameModalProps) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onCancel();
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, onCancel]);

  const { baseName, extension } = useMemo(() => {
    if (itemType === "folder") {
      return { baseName: newName, extension: "" };
    }

    const lastDotIndex = itemName.lastIndexOf(".");
    if (lastDotIndex === -1 || lastDotIndex === 0) {
      return { baseName: newName, extension: "" };
    }

    const originalExtension = itemName.substring(lastDotIndex);
    const originalBaseName = itemName.substring(0, lastDotIndex);

    const currentBaseName = newName.endsWith(originalExtension)
      ? newName.substring(0, newName.length - originalExtension.length)
      : newName === itemName
      ? originalBaseName
      : newName;

    return { baseName: currentBaseName, extension: originalExtension };
  }, [itemName, newName, itemType]);
  const handleBaseNameChange = (value: string) => {
    if (itemType === "folder") {
      onNameChange(value);
    } else {
      onNameChange(value + extension);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3 className={styles.title}>Rename {itemType === "file" ? "File" : "Folder"}</h3>

        {itemType === "file" && extension ? (
          <div className={styles.inputContainer}>
            <input
              type="text"
              value={baseName}
              onChange={(e) => handleBaseNameChange(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  onConfirm();
                }
              }}
              autoFocus
              className={styles.input}
              placeholder="Enter new filename..."
            />
            <span className={styles.extension}>{extension}</span>
          </div>
        ) : (
          <input
            type="text"
            value={newName}
            onChange={(e) => onNameChange(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                onConfirm();
              }
            }}
            autoFocus
            className={styles.input}
            placeholder={`Enter new ${itemType} name...`}
          />
        )}

        <div className={styles.actions}>
          <button onClick={onCancel} className={styles.cancelButton}>
            Cancel
          </button>
          <button onClick={onConfirm} className={styles.confirmButton}>
            Rename
          </button>
        </div>
      </div>
    </div>
  );
}
