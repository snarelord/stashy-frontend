"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";
import Button from "./components/Button/Button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import Footer from "./components/Footer/Footer";
import VectorSvgs from "./components/VectorSvgs/VectorSvgs";

export default function Home() {
  const router = useRouter();
  const [imageLoaded, setImageLoaded] = useState(false);

  // useEffect(() => {
  //   gsap.to("#vector1", { x: -40, duration: 6, repeat: -1, yoyo: true, ease: "power1.inOut" });
  //   gsap.to("#vector2", { x: -50, duration: 8, repeat: -1, yoyo: true, ease: "power1.inOut" });
  //   gsap.to("#vector3", { x: -60, duration: 10, repeat: -1, yoyo: true, ease: "power1.inOut" });
  //   gsap.to("#vector4", { x: 50, y: 10, duration: 12, repeat: -1, yoyo: true, ease: "power1.inOut" });
  //   gsap.to("#vector5", { y: 20, duration: 9, repeat: -1, yoyo: true, ease: "power1.inOut" });
  //   gsap.to("#vector6", { y: 35, duration: 7, repeat: -1, yoyo: true, ease: "power1.inOut" });
  //   gsap.to("#vector7", { x: 25, duration: 11, repeat: -1, yoyo: true, ease: "power1.inOut" });
  //   gsap.to("#vector8", { y: -55, duration: 13, repeat: -1, yoyo: true, ease: "power1.inOut" });
  //   gsap.to("#vector9", { x: 55, duration: 13, repeat: -1, yoyo: true, ease: "power1.inOut" });
  // }, []);

  const handleGetStarted = () => {
    router.push("pages/sign-in");
  };

  const learnMore = () => {
    router.push("pages/learn-more");
  };

  return (
    <div className={styles.page}>
      <img src="/landing-page-vectors/VectorBG.svg" className={styles.bgVectorBG} alt="" aria-hidden="true" />
      {/*<img
        src="/landing-page-vectors/Vector2.svg"
        id="vector1"
        className={`${styles.bgVector2} ${styles.fadeInBg} ${imageLoaded ? styles.visible : ""}`}
        alt=""
        aria-hidden="true"
      />
      <img
        src="/landing-page-vectors/Vector1.svg"
        id="vector2"
        className={`${styles.bgVector1} ${styles.fadeInBg} ${imageLoaded ? styles.visible : ""}`}
        alt=""
        aria-hidden="true"
      />
      <img
        src="/landing-page-vectors/Vector3.svg"
        id="vector3"
        className={`${styles.bgVector3} ${styles.fadeInBg} ${imageLoaded ? styles.visible : ""}`}
        alt=""
        aria-hidden="true"
      />
      <img
        src="/landing-page-vectors/Vector7.svg"
        id="vector7"
        className={`${styles.bgVector7} ${styles.fadeInBg} ${imageLoaded ? styles.visible : ""}`}
        alt=""
        aria-hidden="true"
      />
      <img
        src="/landing-page-vectors/Vector4.svg"
        id="vector4"
        className={`${styles.bgVector4} ${styles.fadeInBg} ${imageLoaded ? styles.visible : ""}`}
        alt=""
        aria-hidden="true"
      />
      <img
        src="/landing-page-vectors/Vector6.svg"
        id="vector6"
        className={`${styles.bgVector6} ${styles.fadeInBg} ${imageLoaded ? styles.visible : ""}`}
        alt=""
        aria-hidden="true"
      />
      <img
        src="/landing-page-vectors/Vector8.svg"
        id="vector8"
        className={`${styles.bgVector8} ${styles.fadeInBg} ${imageLoaded ? styles.visible : ""}`}
        alt=""
        aria-hidden="true"
      />
      <img
        src="/landing-page-vectors/Vector9.svg"
        id="vector9"
        className={`${styles.bgVector9} ${styles.fadeInBg} ${imageLoaded ? styles.visible : ""}`}
        alt=""
        aria-hidden="true"
      />
      <img
        src="/landing-page-vectors/Vector5.svg"
        id="vector5"
        className={`${styles.bgVector5} ${styles.fadeInBg} ${imageLoaded ? styles.visible : ""}`}
        alt=""
        aria-hidden="true"
      /> */}
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
    </div>
  );
}
