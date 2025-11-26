"use client";

import { useState } from "react";
import styles from "./page.module.css";
import Button from "./components/Button/Button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Footer from "./components/Footer/Footer";

export default function Home() {
  const router = useRouter();
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleGetStarted = () => {
    router.push("pages/sign-in");
  };

  return (
    <div className={styles.page} style={{ backgroundColor: "#A499ED" }}>
      <div className={`${styles.main} ${imageLoaded ? styles.visible : ""}`}>
        <div className={styles.container}>
          <Image
            src="/stashy-white.png"
            alt="Stashy Logo"
            width={420}
            height={126}
            className={styles.logo}
            onLoad={() => setImageLoaded(true)}
            priority
          />
        </div>
        <div className={styles.descriptionWrapper}>
          <p className={styles.description}>Your personal stash management solution.</p>
        </div>
        <div className={styles.buttonContainer}>
          <Button text="Get Started" colourScheme="black" disabled={false} onClick={handleGetStarted} />
          <Button text="Learn More" colourScheme="black" disabled={true} />
        </div>
      </div>
      {/* <Footer /> */}
    </div>
  );
}
