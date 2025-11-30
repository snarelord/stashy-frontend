"use client";

import { useRef, useEffect } from "react";
import styles from "./VisualiserBars.module.css";

interface VisualiserProps {
  analyser: AnalyserNode | null;
  isPlaying: boolean;
}

function VisualiserBars({ analyser, isPlaying }: VisualiserProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const peaksRef = useRef<number[]>([]);
  const peakDecayRef = useRef<number[]>([]);
  const smoothedValuesRef = useRef<number[]>([]);

  useEffect(() => {
    if (!analyser || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function resizeCanvas() {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const barCount = 150;

    if (peaksRef.current.length !== barCount) {
      peaksRef.current = new Array(barCount).fill(0);
      peakDecayRef.current = new Array(barCount).fill(0);
      smoothedValuesRef.current = new Array(barCount).fill(0);
    }

    const peakDecayRate = 0.95;
    const peakHoldTime = 30;

    function getFrequencyGain(barIndex: number, barCount: number) {
      const position = barIndex / barCount;

      const lowReduction = Math.pow(1 - position, 1.5) * 0.15; // reduce bass
      const midBoost = Math.sin(position * Math.PI) * 0.15; // slight mid presence
      const highBoost = Math.pow(position, 2.5) * 1.2; // strong exponential boost for highs
      const superHighBoost = position > 0.6 ? Math.pow((position - 0.6) / 0.3, 2) * 1 : 0; // extra boost for top 30%

      return 1.0 - lowReduction + midBoost + highBoost + superHighBoost;
    }

    function compress(value: number, barIndex: number, barCount: number) {
      const normalized = value / 255;
      const position = barIndex / barCount; // 0 = bass 1 = treble

      if (position < 0.3) {
        // low frew gentle compression
        const threshold = 0.15;
        if (normalized < threshold) {
          return Math.pow(normalized / threshold, 0.7) * threshold * 255;
        }
        return threshold * 255 + Math.pow((normalized - threshold) / (1 - threshold), 0.8) * (1 - threshold) * 255;
      } else if (position < 0.7) {
        // mid freq moderate compression
        const threshold = 0.01;
        if (normalized < threshold) {
          return Math.pow(normalized / threshold, 0.5) * threshold * 255;
        }
        return threshold * 255 + Math.pow((normalized - threshold) / (1 - threshold), 0.7) * (1 - threshold) * 255;
      } else {
        // high freq aggressive
        const threshold = 0.02; // very low threshold for high freq
        if (normalized < threshold) {
          // massive boost for quiet high freq
          return Math.pow(normalized / threshold, 0.3) * threshold * 255;
        } else if (normalized < 0.1) {
          // boost for medium/quiet signals
          return (
            threshold * 255 + Math.pow((normalized - threshold) / (0.1 - threshold), 0.4) * (0.1 - threshold) * 255
          );
        } else {
          // gentle compression for louder high freq
          return 0.1 * 255 + Math.pow((normalized - 0.1) / 0.9, 0.6) * 1 * 255;
        }
      }
    }

    function animate() {
      if (!ctx || !analyser) return;

      if (!isPlaying) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        peaksRef.current = new Array(barCount).fill(0);
        peakDecayRef.current = new Array(barCount).fill(0);
        smoothedValuesRef.current = new Array(barCount).fill(0);
        return;
      }

      const barWidth = canvas.width / barCount;
      const barGap = 1;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      analyser.getByteFrequencyData(dataArray);

      for (let i = 0; i < barCount; i++) {
        const dataIndex = Math.floor((i / barCount) * bufferLength);
        const value = dataArray[dataIndex];

        const gain = getFrequencyGain(i, barCount);
        const boosted = value * gain * 1.5;

        const compressed = compress(boosted, i, barCount);
        const adjustedValue = Math.min(255, compressed);

        const smoothingFactor = 0.2; // lower = slower/smoother higher = faster/jumpier
        const previousValue = smoothedValuesRef.current[i];
        const smoothedValue = previousValue * (1 - smoothingFactor) + adjustedValue * smoothingFactor;
        smoothedValuesRef.current[i] = smoothedValue;

        const normalizedHeight = smoothedValue / 255;
        const barHeight = normalizedHeight * canvas.height * 1;
        const x = i * barWidth;
        const y = canvas.height - barHeight;

        let opacity = 0.3 + normalizedHeight * 0.7;
        ctx.fillStyle = `rgba(164, 153, 237, ${opacity})`;

        ctx.beginPath();
        ctx.roundRect(x, y, barWidth - barGap, barHeight, 1);
        ctx.fill();

        // peak hold logic
        if (barHeight > peaksRef.current[i]) {
          peaksRef.current[i] = barHeight;
          peakDecayRef.current[i] = peakHoldTime;
        } else {
          if (peakDecayRef.current[i] > 0) {
            peakDecayRef.current[i]--;
          } else {
            peaksRef.current[i] *= peakDecayRate;
          }
        }

        const peakY = canvas.height - peaksRef.current[i];
        ctx.fillStyle = `hsla(0, 0%, 100%, 0.90)`;
        ctx.fillRect(x, peakY, barWidth - barGap, 2);
      }

      animationRef.current = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [isPlaying, analyser]);

  return (
    <div className={styles.visualiserContainer}>
      <canvas ref={canvasRef} className={styles.visualiser} />
    </div>
  );
}

export default VisualiserBars;
