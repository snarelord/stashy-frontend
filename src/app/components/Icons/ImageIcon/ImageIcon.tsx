import Image from "next/image";
import styles from "./ImageIcon.module.css";

export default function ImageIcon({ className = "", size = 36 }) {
  return (
    <Image
      src="/image-icon.svg"
      alt="Image"
      width={size}
      height={size}
      className={`${styles.imageIcon} ${className}`}
      draggable={false}
      priority={false}
      loading="eager"
    />
  );
}
