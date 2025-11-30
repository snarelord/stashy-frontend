"use client";

import { useEffect, useState } from "react";
import styles from "./LUFSMeter.module.css";

interface LUFSMeterProps {
  analyser: AnalyserNode | null;
  isPlaying: boolean;
  serverLUFS?: number | null;
  fileName?: string;
}
function LUFSMeter({ analyser, isPlaying, serverLUFS, fileName }: LUFSMeterProps) {
  const [lufs, setLufs] = useState<number>(-100);
  const [lufsPeak, setLufsPeak] = useState<number>(-100);

  useEffect(() => {
    if (!analyser || !isPlaying) {
      setLufs(-100);
      setLufsPeak(-100);
      return;
    }

    const timeArray = new Uint8Array(analyser.fftSize);
    let lufsPeakValue = -100;
    let lufsPeakHold = 0;
    const lufsPeakHoldTime = 60;
    const lufsPeakDecayRate = 0.98;

    function calculateLUFS() {
      if (!analyser || !isPlaying) return;

      analyser.getByteTimeDomainData(timeArray);
      let sumSquares = 0;
      for (let i = 0; i < timeArray.length; i++) {
        const normalized = (timeArray[i] - 128) / 128;
        sumSquares += normalized * normalized;
      }
      const rms = Math.sqrt(sumSquares / timeArray.length);
      const db = 20 * Math.log10(rms);
      // LUFS approximation: RMS dB - 0.691 (K-weighting offset)
      const currentLufs = isFinite(db) ? db - 0.691 : -100;
      setLufs(currentLufs);

      // LUFS peak hold logic
      if (currentLufs > lufsPeakValue) {
        lufsPeakValue = currentLufs;
        lufsPeakHold = lufsPeakHoldTime;
      } else {
        if (lufsPeakHold > 0) {
          lufsPeakHold--;
        } else {
          lufsPeakValue = lufsPeakValue * lufsPeakDecayRate - 0.1;
          if (lufsPeakValue < currentLufs) {
            lufsPeakValue = currentLufs;
          }
        }
      }
      setLufsPeak(lufsPeakValue);

      requestAnimationFrame(calculateLUFS);
    }

    const animationId = requestAnimationFrame(calculateLUFS);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [analyser, isPlaying]);

  return (
    <div className={styles.lufsContainer}>
      {/* Real-time approximation */}
      <div className={styles.realtimeSection}>
        <div className={styles.label}>Real-time (Web Audio)</div>
        <div className={styles.lufsValue}>{lufs > -100 ? `${lufs.toFixed(1)} LUFS` : "-- LUFS"}</div>
        <div className={styles.lufsPeak}>Peak: {lufsPeak > -100 ? `${lufsPeak.toFixed(1)} LUFS` : "-- LUFS"}</div>
      </div>

      {/* Server calculated accurate LUFS */}
      {serverLUFS !== undefined && serverLUFS !== null && (
        <div className={styles.serverSection}>
          <div className={styles.label}>Accurate (FFmpeg)</div>
          <div className={styles.serverValue}>{serverLUFS.toFixed(1)} LUFS</div>
          {fileName && <div className={styles.fileName}>{fileName}</div>}
        </div>
      )}
    </div>
  );
}

export default LUFSMeter;
