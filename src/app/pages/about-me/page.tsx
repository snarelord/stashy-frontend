"use client";

import { Button } from "../../components/ui/button";
import Link from "next/link";
import Carousel from "../../components/AboutMe/Carousel/Carousel";
import SocialLinks from "../../components/AboutMe/SocialLinks/SocialLinks";
import SpotifyProfile from "../../components/AboutMe/SpotifyProfile/SpotifyProfile";
import styles from "./page.module.css";
import { preload } from "react-dom";
import StaticParticles from "@/app/components/ui/Particles/StaticParticles";
import LinearGradient from "@/app/components/ui/LinearGradient/LinearGradient";

export default function AboutMe() {
  const mediaItems = [
    { src: "/circumference-images/circ2.jpeg", alt: "image", type: "image" as const },
    { src: "/circumference-images/circ1.JPG", alt: "image", type: "image" as const },
    { src: "/circumference-images/circ3.jpg", alt: "image", type: "image" as const },
    { src: "/circumference-images/circ4.JPG", alt: "image", type: "image" as const },
    { src: "/circumference-images/circ5.MOV", alt: "video", type: "video" as const },
  ];

  const socialLinks = [
    {
      href: "https://github.com/snarelord",
      title: "GitHub",
      handle: "@snarelord",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
      ),
    },
    {
      href: "https://www.linkedin.com/in/kit-jones-64926a2aa/",
      title: "LinkedIn",
      handle: "Kit Jones",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
    },
    {
      href: "https://instagram.com/circumferencemusicuk",
      title: "Instagram",
      handle: "@circumferencemusicuk",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
        </svg>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.backgroundContainer}>
        <div className={styles.redGlow} />
        <LinearGradient />
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
            <div className={styles.eyebrow}>About Me</div>
            <h1 className={styles.heading}>
              Kit Jones
              <br />
              <span className={styles.gradientText}>Developer • Producer • DJ</span>
            </h1>
          </div>
          {/* Bio Section */}
          <div className={styles.bioSection}>
            <p className={styles.bioText}>
              In 2024 I made the decision to pursue my love of creation and problem-solving in the field of programming,
              which brought me to the{" "}
              <a
                href="https://schoolofcode.co.uk/"
                rel="noopener noreferrer"
                target="_blank"
                className={styles.gradientText}
              >
                School of Code
              </a>{" "}
              bootcamp, where I learnt the fundamentals of full stack development. But coding isn't my only creative
              outlet. As a music producer and DJ, I've spent years creating tracks, playing events across the UK and
              Europe, and learning what it means to create something that people can relate to.
            </p>
            <p className={styles.bioText}>
              Everything I create is shaped by that dual perspective. I'm always considering user experience, aesthetics
              and how to create something that just feels right.
            </p>
          </div>
          {/* Music Section */}
          <div className={styles.musicSection}>
            <h2 className={styles.sectionHeading}>
              Music <span className={styles.gradientText}>Profile</span>
            </h2>

            <SpotifyProfile />

            {/* Music Bio */}
            <div className={styles.musicBio}>
              <p className={styles.musicText}>
                As <span className={styles.gradientText}>Circumference</span>, I produce melodic drum & bass and
                atmospheric electronic music in a duo. Our releases span across labels such as Soulvent Records, Flexout
                Audio, Hospital Records, Overview and Modus Music.
              </p>
              <p className={styles.musicText}>
                I've performed at a variety of venues events across the UK and Europe, sharing stages with established
                artists and bringing our sound to the dancefloors.
              </p>
            </div>

            <Carousel items={mediaItems} />
          </div>
          <div className={styles.linksSection}>
            <h2 className={styles.sectionHeading}>
              Connect <span className={styles.gradientText}>With Me</span>
            </h2>
            <SocialLinks links={socialLinks} />
          </div>{" "}
          <div className={styles.ctaSection}>
            <h2 className={styles.ctaHeading}>Let's Connect</h2>
            <p className={styles.ctaText}>
              Whether you want to talk about development, music production or just say hi. I'd love to hear from you.
            </p>
            <div className={styles.ctaButtons}>
              <a href="https://www.linkedin.com/in/kit-jones-64926a2aa/" target="_blank" rel="noopener noreferrer">
                <Button
                  size="lg"
                  className="rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white border-0 px-8 py-6 text-base font-semibold shadow-lg shadow-cyan-500/30"
                >
                  Get In Touch
                </Button>
              </a>
              <Link href="/pages/learn-more">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full border-2 border-white/20 text-white hover:bg-white/5 hover:border-white/30 px-8 py-6 text-base font-semibold bg-transparent"
                >
                  About Stashy
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
