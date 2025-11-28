import Image from "next/image";
import styles from "./FileIcon.module.css";

export default function FileIcon({ className = "", size = 36 }) {
  return (
    <Image
      src="/file-icon.svg"
      alt="File"
      width={size}
      height={size}
      className={`${styles.fileIcon} ${className}`}
      draggable={false}
      priority={false}
      loading="eager"
    />
  );
}
