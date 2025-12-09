"use client";

import { useState, useEffect } from "react";
import { Button } from "./components/ui/button";
import Image from "next/image";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import HamBurgerMenu from "./components/ui/HamburgerMenu/HamBurgerMenu";
import StaticParticles from "./components/ui/Particles/StaticParticles";
import DetailedParticles from "./components/ui/Particles/DetailedParticles/DetailedParticles";

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsVisible(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.backgroundContainer}>
        <div className={styles.redGlow} />
      </div>
      <nav className={styles.nav}>
        <HamBurgerMenu />
        <div className={styles.navContent}>
          {/* <Image src="/stashy-logo.svg" alt="Stashy" width={140} height={35} className={styles.logo} priority /> */}
          <div className={styles.navLinks}>
            <a href="/pages/dashboard" className={styles.navLink}>
              Home
            </a>
            <a href="/pages/learn-more" className={styles.navLink}>
              Learn More
            </a>
            <a href="#contact" className={styles.navLink}>
              Contact
            </a>
            <a href="/pages/about-me" className={styles.navLink}>
              A Bit About Me
            </a>
          </div>
        </div>
        <Button variant="outline" className={styles.signUpButton} onClick={() => router.push("/pages/sign-up")}>
          Sign Up
        </Button>
      </nav>

      <main className={styles.main}>
        <div className={`${styles.heroContent} ${isVisible ? styles.visible : styles.hidden}`}>
          {/* Eyebrow */}
          <div className={styles.eyebrow}>Digital Storage</div>

          <h1 className={styles.heading}>
            Stash Your
            <br />
            <span className={styles.gradientText}>Things</span>
          </h1>

          <p className={styles.subheading}>Store, organise, and access your files from anywhere.</p>

          <div className={styles.ctaButtons}>
            <Button size="lg" className={styles.ctaPrimaryButton} onClick={() => router.push("/pages/sign-in")}>
              Sign In
            </Button>
            <Button size="lg" variant="outline" className={styles.ctaSecondaryButton}>
              Demo
            </Button>
          </div>

          <div className={styles.featurePills}>
            <div className={styles.pill}>File Conversion</div>
            <div className={styles.pill}>Shareable Files</div>
            <div className={styles.pill}>Free Storage</div>
          </div>
        </div>
      </main>

      {isMobile ? <StaticParticles /> : <DetailedParticles />}
    </div>
  );
}
