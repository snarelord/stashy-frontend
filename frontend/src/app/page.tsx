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

  const learnMore = () => {
    router.push("pages/learn-more");
  };

  return (
    <div className={styles.page}>
      <img src="/landing-page-vectors/VectorBG.svg" className={styles.bgVectorBG} alt="" aria-hidden="true" />
      <img src="/landing-page-vectors/Vector2.svg" className={styles.bgVector2} alt="" aria-hidden="true" />
      <img src="/landing-page-vectors/Vector1.svg" className={styles.bgVector1} alt="" aria-hidden="true" />
      <img src="/landing-page-vectors/Vector3.svg" className={styles.bgVector3} alt="" aria-hidden="true" />
      <img src="/landing-page-vectors/Vector4.svg" className={styles.bgVector4} alt="" aria-hidden="true" />
      <img src="/landing-page-vectors/Vector6.svg" className={styles.bgVector6} alt="" aria-hidden="true" />
      <img src="/landing-page-vectors/Vector7.svg" className={styles.bgVector7} alt="" aria-hidden="true" />
      <img src="/landing-page-vectors/Vector8.svg" className={styles.bgVector8} alt="" aria-hidden="true" />
      <img src="/landing-page-vectors/Vector5.svg" className={styles.bgVector5} alt="" aria-hidden="true" />
      <div className={`${styles.main} ${imageLoaded ? styles.visible : ""}`}>
        <div className={styles.imageContainer}>
          <Image
            src="/stashy-white.svg"
            alt="Stashy Logo"
            width={420}
            height={126}
            className={styles.logo}
            onLoad={() => setImageLoaded(true)}
            priority
          />
        </div>
        <div className={styles.descriptionWrapper}>
          <p className={styles.description}>Stash your things.</p>
        </div>
        <div className={styles.buttonContainer}>
          <Button text="Get Started" colourScheme="black" disabled={false} onClick={handleGetStarted} />
          <Button text="Learn More" colourScheme="black" disabled={false} onClick={learnMore} />
        </div>
      </div>
      {/* <Footer /> */}
    </div>
  );
}
