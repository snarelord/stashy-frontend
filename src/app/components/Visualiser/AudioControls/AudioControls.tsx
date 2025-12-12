"use client";

import type React from "react";
import { useEffect, useState } from "react";
import styles from "./AudioControls.module.css";
import { Play, Pause, Volume2, VolumeX, Share2 } from "lucide-react";

function formatTime(seconds: number): string {
  if (!seconds || isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

interface AudioControlsProps {
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  onPlayPause: () => void;
  onVolumeChange: (volume: number) => void;
  onSeek: (time: number) => void;
  hasAudio: boolean;
  showProgressBar: boolean;
}

export default function AudioControls({
  isPlaying,
  volume,
  currentTime,
  duration,
  onPlayPause,
  onVolumeChange,
  onSeek,
  hasAudio,
  showProgressBar,
}: AudioControlsProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    function checkMobile() {
      setIsMobile(window.matchMedia("(max-width: 700px)").matches);
    }
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSeek(Number.parseFloat(e.target.value));
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onVolumeChange(Number.parseFloat(e.target.value));
  };

  const toggleMute = () => {
    onVolumeChange(volume > 0 ? 0 : 1);
  };

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className={styles.audioControls}>
      {/* Progress Bar */}
      {(showProgressBar || isMobile) && (
        <div className={styles.progressBarContainer}>
          <div className={styles.progressTrack}>
            <div className={styles.progressFill} style={{ width: `${progressPercent}%` }} />
            <input
              type="range"
              min="0"
              max={duration || 1}
              value={currentTime}
              step="0.01"
              onChange={handleSeekChange}
              className={styles.progressInput}
              disabled={!hasAudio}
            />
          </div>
        </div>
      )}

      <div className={styles.controlsRow}>
        <div className={styles.playbackControls}>
          {/* Play/Pause Button */}
          <button
            className={styles.playPauseButton}
            onClick={onPlayPause}
            disabled={!hasAudio}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>

          {/* Time Display */}
          <div className={styles.timeDisplay}>
            <span className={styles.currentTime}>{formatTime(currentTime)}</span>
            <span className={styles.timeSeparator}>/</span>
            <span className={styles.totalTime}>{formatTime(duration)}</span>
          </div>

          {/* Volume Controls */}
          <div className={styles.volumeControls}>
            <button
              className={styles.muteButton}
              onClick={toggleMute}
              disabled={!hasAudio}
              aria-label={volume === 0 ? "Unmute" : "Mute"}
            >
              {volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>

            <div className={styles.volumeSliderContainer}>
              <div className={styles.volumeTrack}>
                <div className={styles.volumeFill} style={{ width: `${volume * 100}%` }} />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={handleVolumeChange}
                  className={styles.volumeInput}
                  disabled={!hasAudio}
                  aria-label="Volume"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Share Button */}
        <button className={styles.shareButton} disabled={!hasAudio} aria-label="Share">
          <Share2 size={18} />
        </button>
      </div>
    </div>
  );
}
