"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./Carousel.module.css";

interface MediaItem {
  src: string;
  alt: string;
  type: "image" | "video";
}

interface CarouselProps {
  items: MediaItem[];
}

export default function Carousel({ items }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  return (
    <div className={styles.carouselContainer}>
      <div className={styles.carousel}>
        <button className={styles.carouselButton} onClick={prevImage} aria-label="Previous image">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.carouselIcon}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className={styles.carouselImageWrapper}>
          {items[currentIndex].type === "video" ? (
            <video
              src={items[currentIndex].src}
              className={styles.carouselImage}
              controls
              loop
              muted
              playsInline
              preload="metadata"
            />
          ) : (
            <Image
              src={items[currentIndex].src}
              alt={items[currentIndex].alt}
              width={1200}
              height={800}
              className={styles.carouselImage}
              priority={currentIndex === 0}
              loading="eager"
            />
          )}
        </div>

        <button className={styles.carouselButton} onClick={nextImage} aria-label="Next image">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.carouselIcon}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className={styles.carouselIndicators}>
        {items.map((_, index) => (
          <button
            key={index}
            className={`${styles.indicator} ${index === currentIndex ? styles.indicatorActive : ""}`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
