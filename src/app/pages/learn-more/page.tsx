"use client";

import { Button } from "../../components/ui/button";
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";

export default function LearnMore() {
  return (
    <div className={styles.container}>
      <div className={styles.backgroundContainer}>
        <div className={styles.redGlow} />

        <svg
          className={styles.waveSvg}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1920 1080"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient id="waveGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0099ff" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#00d9ff" stopOpacity="0.3" />
            </linearGradient>
            <linearGradient id="waveGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00d9ff" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#0066ff" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          <path
            d="M0 50 Q200 100 400 75 T800 100 T1200 75 T1600 100 T2000 75"
            stroke="url(#waveGradient1)"
            strokeWidth="2"
            fill="none"
            opacity="0.7"
          />
          <path
            d="M0 120 Q200 180 400 150 T800 180 T1200 150 T1600 180 T2000 150"
            stroke="url(#waveGradient1)"
            strokeWidth="2"
            fill="none"
            opacity="0.6"
          />
          <path
            d="M0 200 Q200 270 400 240 T800 270 T1200 240 T1600 270 T2000 240"
            stroke="url(#waveGradient2)"
            strokeWidth="3"
            fill="none"
            opacity="0.5"
          />
        </svg>
      </div>

      <nav className={styles.nav}>
        <Link href="/">
          <Button
            variant="outline"
            className="rounded-full border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/10 hover:text-cyan-300 hover:border-cyan-300 bg-transparent"
          >
            Back to Home
          </Button>
        </Link>
      </nav>

      <main className={styles.main}>
        <div className={styles.content}>
          <div className={styles.header}>
            <div className={styles.eyebrow}>Welcome To Stashy</div>
            <h1 className={styles.heading}>
              Free Cloud Storage
              <br />
              <span className={styles.gradientText}>Built for Creatives</span>
            </h1>
            <p className={styles.leadText}>
              Built with the goal of making file storage feel easy without subscriptions or confusing dashboards.
            </p>
          </div>

          <div className={styles.aboutSection}>
            <h2 className={styles.aboutHeading}>
              About Stashy and <span className={styles.gradientText}>Why I Built It</span>
            </h2>
            <p className={styles.aboutText}>
              I'm Kit, a junior full-stack developer and music producer who loves clean design and useful tools. Learn
              more about me{" "}
              <a href="/pages/about-me" rel="noopener noreferrer" target="_blank" className={styles.gradientText}>
                here.{" "}
              </a>
              I created Stashy because I was frustrated with the expensive experience of modern cloud storage providers.
            </p>
            <p className={styles.aboutText}>I wanted something:</p>
            <ul className={styles.aboutList}>
              <li className={styles.aboutListItem}>
                <span>Fast</span>
              </li>
              <li className={styles.aboutListItem}>
                <span>Full of features</span>
              </li>
              <li className={styles.aboutListItem}>
                <span>Secure</span>
              </li>
              <li className={styles.aboutListItem}>
                <span>User-friendly</span>
              </li>
            </ul>
            <p className={styles.aboutTextHighlight}>
              So I built <span className={styles.gradientText}>Stashy</span>, a storage platform designed to put
              creatives first.
            </p>
          </div>

          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.iconContainer}>
                <svg className={styles.icon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className={styles.featureTitle}>It's Free!</h3>
              <p className={styles.featureText}>
                Stashy doesn’t push you into paid tiers. You get generous storage from the start and you’ll never be
                nagged to upgrade.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.iconContainer}>
                <svg className={styles.icon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className={styles.featureTitle}>Share What You Want, How You Want</h3>
              <p className={styles.featureText}>
                Send files or folders securely with links. Control who has access and for how long.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.iconContainer}>
                <svg className={styles.icon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className={styles.featureTitle}>Cross-Platform Access</h3>
              <p className={styles.featureText}>Access your files from any device. Your files follow you everywhere.</p>
            </div>
          </div>

          <div className={styles.ctaSection}>
            <h2 className={styles.ctaHeading}>Ready to Get Started?</h2>
            <p className={styles.ctaText}>Contact me below to get involved!</p>
            <div className={styles.ctaButtons}>
              <Button
                size="lg"
                className="rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white border-0 px-8 py-6 text-base font-semibold shadow-lg shadow-cyan-500/30"
              >
                Contact
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
