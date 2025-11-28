import Image from "next/image";
import styles from "./VideoIcon.module.css";

export default function VideoIcon({ className = "", size = 36 }) {
  return (
    <Image
      src="/video-icon.svg"
      alt="Video"
      width={size}
      height={size}
      className={`${styles.videoIcon} ${className}`}
      draggable={false}
      priority={false}
      loading="eager"
    />
  );
}
