"use client";

import { useRef, useEffect, useState } from "react";
import styles from "./VisualiserBars.module.css";

interface VisualiserProps {
  analyser: AnalyserNode | null;
  isPlaying: boolean;
}

function VisualiserBars({ analyser, isPlaying }: VisualiserProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mirroredCanvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const peaksRef = useRef<number[]>([]);
  const peakDecayRef = useRef<number[]>([]);
  const smoothedValuesRef = useRef<number[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    function checkMobile() {
      setIsMobile(window.matchMedia("(max-width: 700px)").matches);
    }
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (!analyser || !canvasRef.current || !mirroredCanvasRef.current) return;

    const canvas = canvasRef.current;
    const mirroredCanvas = mirroredCanvasRef.current;
    const ctx = canvas.getContext("2d");
    const mirroredCtx = mirroredCanvas.getContext("2d");
    if (!ctx || !mirroredCtx) return;

    function resizeCanvas() {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      mirroredCanvas.width = rect.width;
      mirroredCanvas.height = rect.height;
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const desktopBarCount = 255;
    const mobileBarCount = 50;
    const barCount = isMobile ? mobileBarCount : desktopBarCount;

    if (peaksRef.current.length !== barCount) {
      peaksRef.current = new Array(barCount).fill(0);
      peakDecayRef.current = new Array(barCount).fill(0);
      smoothedValuesRef.current = new Array(barCount).fill(0);
    }

    const peakDecayRate = 0.95;
    const peakHoldTime = 30;

    function getFrequencyGain(barIndex: number, barCount: number) {
      const position = barIndex / barCount;

      const lowReduction = Math.pow(1 - position, 1.5) * 0.18;
      const midScoop = -0.22 * Math.exp(-Math.pow((position - 0.5) / 0.18, 2));
      const highBoost = Math.pow(position, 2.2) * 2;

      return 1.0 - lowReduction + midScoop + highBoost;
    }

    function compress(value: number, barIndex: number, barCount: number) {
      const normalized = value / 255;
      const position = barIndex / barCount; // 0 = bass 1 = treble

      if (position < 0.3) {
        // low gentle compression
        const threshold = 0.15;
        if (normalized < threshold) {
          return Math.pow(normalized / threshold, 0.7) * threshold * 255;
        }
        return threshold * 255 + Math.pow((normalized - threshold) / (1 - threshold), 0.8) * (1 - threshold) * 255;
      } else if (position < 0.6) {
        // mid freq moderate compression
        const threshold = 0.01;
        if (normalized < threshold) {
          return Math.pow(normalized / threshold, 0.5) * threshold * 255;
        }
        return threshold * 255 + Math.pow((normalized - threshold) / (1 - threshold), 0.7) * (1 - threshold) * 255;
      } else {
        // high freq aggressive
        const threshold = 0.1; // very low threshold for high freq
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

    function getLogFrequencyBin(
      barIndex: number,
      barCount: number,
      bufferLength: number,
      minHz = 20,
      maxHz = 20000,
      sampleRate = 44100
    ) {
      // map bar index to freq (log scale)
      const nyquist = sampleRate / 2;
      const minLog = Math.log10(minHz);
      const maxLog = Math.log10(maxHz);
      const logFreq = minLog + (barIndex / (barCount - 1)) * (maxLog - minLog);
      const freq = Math.pow(10, logFreq);

      const bin = Math.round((freq / nyquist) * (bufferLength - 1));
      return Math.min(bufferLength - 1, Math.max(0, bin));
    }

    function animate() {
      if (!ctx || !analyser) return;

      if (!mirroredCtx) {
        console.error("Error mirroring");
        return;
      }

      if (!isPlaying) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        mirroredCtx.clearRect(0, 0, mirroredCanvas.width, mirroredCanvas.height);
        peaksRef.current = new Array(barCount).fill(0);
        peakDecayRef.current = new Array(barCount).fill(0);
        smoothedValuesRef.current = new Array(barCount).fill(0);
        return;
      }

      const barWidth = canvas.width / barCount;
      const barGap = 2;

      ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      analyser.getByteFrequencyData(dataArray);

      // use sample rate from the analyser context if available
      const sampleRate = analyser.context && analyser.context.sampleRate ? analyser.context.sampleRate : 44100;

      for (let i = 0; i < barCount; i++) {
        const dataIndex = getLogFrequencyBin(i, barCount, bufferLength, 20, 20000, sampleRate);
        const value = dataArray[dataIndex];

        const gain = getFrequencyGain(i, barCount);
        const boosted = value * gain * 1.5;

        const compressed = compress(boosted, i, barCount);
        const adjustedValue = Math.min(255, compressed);

        const smoothingFactor = 0.1; // lower = slower/smoother higher = faster/jumpier
        const previousValue = smoothedValuesRef.current[i];
        const smoothedValue = previousValue * (1 - smoothingFactor) + adjustedValue * smoothingFactor;
        smoothedValuesRef.current[i] = smoothedValue;

        const normalisedHeight = smoothedValue / 255;
        const barHeight = normalisedHeight * canvas.height * 1;
        const x = i * barWidth;
        const y = canvas.height - barHeight;

        // Create cyan gradient for bars - matches theme colors
        const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
        gradient.addColorStop(0, "rgba(34, 211, 238, 0.3)"); // #22d3ee with transparency
        gradient.addColorStop(0.5, "rgba(34, 211, 238, 0.6)");
        gradient.addColorStop(1, "rgba(59, 130, 246, 0.9)"); // #3b82f6 at top

        ctx.fillStyle = gradient;

        ctx.beginPath();
        ctx.roundRect(x, y, barWidth - barGap, barHeight, 1);
        ctx.fill();

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
        ctx.fillStyle = `rgba(34, 211, 238, 0.9)`; // Cyan peak indicators
        ctx.fillRect(x, peakY, barWidth - barGap, 2);
      }

      if (mirroredCtx) {
        mirroredCtx.save();
        mirroredCtx.clearRect(0, 0, mirroredCanvas.width, mirroredCanvas.height);
        mirroredCtx.scale(1, -1);
        mirroredCtx.drawImage(canvas, 0, -mirroredCanvas.height, mirroredCanvas.width, mirroredCanvas.height);
        mirroredCtx.restore();
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
  }, [isPlaying, analyser, isMobile]);

  return (
    <div id="visualiser" className={styles.visualiserContainer}>
      <canvas ref={canvasRef} className={styles.visualiser} />
      <canvas ref={mirroredCanvasRef} className={styles.mirrored} />
    </div>
  );
}

export default VisualiserBars;
