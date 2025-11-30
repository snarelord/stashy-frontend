import Image from "next/image";
import styles from "./AudioIcon.module.css";

export default function AudioIcon({ className = "", size = 36 }) {
  return (
    <Image
      src="/audio-icon.svg"
      alt="Audio File"
      width={size}
      height={size}
      className={`${styles.audioIcon} ${className}`}
      draggable={false}
      priority={false}
      loading="eager"
    />
  );
}
