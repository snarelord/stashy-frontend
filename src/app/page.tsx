"use client";

import { useState, useEffect } from "react";
import { Button } from "./components/ui/button";
import Image from "next/image";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.backgroundContainer}>
        <div className={styles.redGlow} />
      </div>

      <nav className={styles.nav}>
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
            <div className={styles.pill}>Audio Conversion</div>
            <div className={styles.pill}>Shareable Files</div>
            <div className={styles.pill}>Free Storage</div>
          </div>
        </div>
      </main>

      <div className={styles.particlesContainer}>
        {[...Array(21)].map((_, i) => (
          <div
            key={i}
            className={styles.particle}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
