"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Settings2 } from "lucide-react";
import styles from "./DetailedParticles.module.css";

interface Particle {
  x: number;
  y: number;
  originalX: number;
  originalY: number;
  size: number;
}

export default function DetailedParticles() {
  const [particleCount, setParticleCount] = useState(30);
  const [particleColour, setParticleColour] = useState("#22d3ee");
  const [showControls, setShowControls] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const animationIdRef = useRef<number | null>(null);

  const initParticles = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    particlesRef.current = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      originalX: Math.random() * canvas.width,
      originalY: Math.random() * canvas.height,
      size: 2 + Math.random() * 4,
    }));
  }, [particleCount]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [initParticles]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const mouse = mouseRef.current;

      particlesRef.current.forEach((particle) => {
        const dx = particle.x - mouse.x;
        const dy = particle.y - mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 100) {
          const angle = Math.atan2(dy, dx);
          const force = (100 - distance) / 2;
          particle.x += Math.cos(angle) * force;
          particle.y += Math.sin(angle) * force;
        } else {
          particle.x += (particle.originalX - particle.x) * 0.015;
          particle.y += (particle.originalY - particle.y) * 0.015;
        }

        ctx.fillStyle = particleColour;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationIdRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [particleColour]);

  return (
    <>
      <canvas ref={canvasRef} className={styles.particlesContainer} />

      <div className={styles.controlsContainer}>
        <button
          className={styles.controlsToggle}
          onClick={() => setShowControls(!showControls)}
          aria-label="Toggle particle controls"
        >
          <Settings2 size={20} />
        </button>

        {showControls && (
          <div className={styles.controlsPanel}>
            <div className={styles.controlsHeader}>
              <h3>Particle Controls</h3>
            </div>

            <div className={styles.controlGroup}>
              <label htmlFor="particleCount">
                Count: <span className={styles.controlValue}>{particleCount}</span>
              </label>
              <input
                id="particleCount"
                type="range"
                min="20"
                max="150"
                value={particleCount}
                onChange={(e) => setParticleCount(Number(e.target.value))}
                className={styles.slider}
              />
            </div>

            <div className={styles.presetColours}>
              <button
                className={styles.colourPreset}
                style={{ background: "#22d3ee" }}
                onClick={() => setParticleColour("#22d3ee")}
                aria-label="Cyan preset"
              />
              <button
                className={styles.colourPreset}
                style={{ background: "#ef4444" }}
                onClick={() => setParticleColour("#ef4444")}
                aria-label="Red preset"
              />
              <button
                className={styles.colourPreset}
                style={{ background: "#8b5cf6" }}
                onClick={() => setParticleColour("#8b5cf6")}
                aria-label="Purple preset"
              />
              <button
                className={styles.colourPreset}
                style={{ background: "#10b981" }}
                onClick={() => setParticleColour("#10b981")}
                aria-label="Green preset"
              />
              <button
                className={styles.colourPreset}
                style={{ background: "#f59e0b" }}
                onClick={() => setParticleColour("#f59e0b")}
                aria-label="Orange preset"
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
