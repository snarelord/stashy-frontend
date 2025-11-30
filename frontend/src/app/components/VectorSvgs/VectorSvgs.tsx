import styles from "./VectorSvgs.module.css";
import { useState, useEffect } from "react";
import gsap from "gsap";

export default function VectorSvgs() {
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    gsap.to("#vector1", { x: -30, duration: 6, repeat: -1, yoyo: true, ease: "power1.inOut" });
    gsap.to("#vector2", { x: -40, duration: 8, repeat: -1, yoyo: true, ease: "power1.inOut" });
    gsap.to("#vector3", { x: -50, duration: 10, repeat: -1, yoyo: true, ease: "power1.inOut" });
    gsap.to("#vector4", { y: 40, duration: 12, repeat: -1, yoyo: true, ease: "power1.inOut" });
    gsap.to("#vector5", { x: 30, y: -20, duration: 9, repeat: -1, yoyo: true, ease: "power1.inOut" });
    gsap.to("#vector6", { y: -35, duration: 7, repeat: -1, yoyo: true, ease: "power1.inOut" });
    gsap.to("#vector7", { x: 25, duration: 11, repeat: -1, yoyo: true, ease: "power1.inOut" });
    gsap.to("#vector8", { y: -25, duration: 13, repeat: -1, yoyo: true, ease: "power1.inOut" });
  }, []);

  return (
    <div>
      <img
        src="/landing-page-vectors/VectorBG.svg"
        className={styles.bgVectorBG}
        alt=""
        aria-hidden="true"
        onLoad={() => setImageLoaded(true)}
      />
      <img
        src="/landing-page-vectors/Vector2.svg"
        id="vector1"
        className={`${styles.bgVector2} ${styles.fadeInBg} ${imageLoaded ? "visible" : ""}`}
        alt=""
        aria-hidden="true"
      />
      <img
        src="/landing-page-vectors/Vector1.svg"
        id="vector2"
        className={`${styles.bgVector1} ${styles.fadeInBg} ${imageLoaded ? "visible" : ""}`}
        alt=""
        aria-hidden="true"
      />
      <img
        src="/landing-page-vectors/Vector3.svg"
        id="vector3"
        className={`${styles.bgVector3} ${styles.fadeInBg} ${imageLoaded ? "visible" : ""}`}
        alt=""
        aria-hidden="true"
      />
      <img
        src="/landing-page-vectors/Vector4.svg"
        id="vector4"
        className={`${styles.bgVector4} ${styles.fadeInBg} ${imageLoaded ? "visible" : ""}`}
        alt=""
        aria-hidden="true"
      />
      <img
        src="/landing-page-vectors/Vector6.svg"
        id="vector6"
        className={`${styles.bgVector6} ${styles.fadeInBg} ${imageLoaded ? "visible" : ""}`}
        alt=""
        aria-hidden="true"
      />
      <img
        src="/landing-page-vectors/Vector7.svg"
        id="vector7"
        className={`${styles.bgVector7} ${styles.fadeInBg} ${imageLoaded ? "visible" : ""}`}
        alt=""
        aria-hidden="true"
      />
      <img
        src="/landing-page-vectors/Vector8.svg"
        id="vector8"
        className={`${styles.bgVector8} ${styles.fadeInBg} ${imageLoaded ? "visible" : ""}`}
        alt=""
        aria-hidden="true"
      />
      <img
        src="/landing-page-vectors/Vector5.svg"
        id="vector5"
        className={`${styles.bgVector5} ${styles.fadeInBg} ${imageLoaded ? "visible" : ""}`}
        alt=""
        aria-hidden="true"
      />
    </div>
  );
}
