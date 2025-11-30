"use client";

import styles from "./page.module.css";
import Link from "next/link";

export default function LearnMorePage() {
  return (
    <div className={styles.page} style={{ backgroundColor: "#A499ED" }}>
      <div className={styles.main}>
        <Link href="/" className={styles.backButton}>
          ← Back
        </Link>
        <h1 className={styles.title}>Update Later</h1>
        <p className={styles.description}>Include project information.</p>
      </div>
    </div>
  );
}
