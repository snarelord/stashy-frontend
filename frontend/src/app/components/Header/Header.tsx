import styles from "./Header.module.css";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className={styles.header}>
      <Link href="/" className={styles.logo}>
        <Image src="/stashy-black.png" alt="Stashy Logo" width={150} height={45} />
      </Link>
    </header>
  );
}
