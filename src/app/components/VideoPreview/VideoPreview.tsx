import { useEffect, useState, useRef } from "react";
import styles from "./VideoPreview.module.css";
import { api } from "../../services/api";
import { useRouter } from "next/navigation";
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize } from "lucide-react";
import Spinner from "../Spinner/Spinner";

type VideoPreviewProps = {
  fileId: string;
};

export default function VideoPreview({ fileId }: VideoPreviewProps) {
  const [file, setFile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchFile() {
      setLoading(true);
      setError(null);
      try {
        const response = await api.getFile(fileId);
        setFile(response.file);
      } catch (err: any) {
        setError("Failed to load video file");
      } finally {
        setLoading(false);
      }
    }
    fetchFile();
  }, [fileId]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !file) return;

    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleLoadedMetadata = () => setDuration(video.duration);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
    };
  }, [file]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };

  const handleSeek = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handlePlaybackRateChange = (rate: number) => {
    setPlaybackRate(rate);
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
  };

  const toggleFullscreen = async () => {
    console.log("Fullscreen button clicked");
    if (!containerRef.current) return;

    try {
      console.log("Fullscreen in try");
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error("Fullscreen error: ", error);
    }
  };

  const formatTime = (seconds: number) => {
    if (!isFinite(seconds)) return "0:00";

    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return <Spinner />;
  }
  if (error || !file) {
    return <div className={styles.loadingText}>{error || "Video not found"}</div>;
  }

  const videoUrl = `${process.env.NEXT_PUBLIC_API_URL}/files/stream/${file.id}`;

  return (
    <div className={styles.pageContainer} ref={containerRef}>
      <header className={styles.header}>
        <button className={styles.backButton} onClick={() => router.back()} title="Back">
          ✕
        </button>
        <div className={styles.fileInfo}>
          <h2 className={styles.fileName}>{file.name}</h2>
          <p className={styles.fileDetails}>{file.size ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : ""}</p>
        </div>
        <a className={styles.downloadButton} href={videoUrl} download={file.name} title="Download video">
          Download
        </a>
      </header>
      <main className={styles.videoMain}>
        <div className={styles.videoPreviewContainer}>
          {file.mimeType && file.mimeType.startsWith("video/") ? (
            <video
              ref={videoRef}
              src={videoUrl}
              className={styles.previewVideo}
              onClick={handlePlayPause}
              preload="metadata"
            />
          ) : (
            <div>Not a video file</div>
          )}
        </div>
      </main>
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          {/* Progress Bar */}
          <div className={styles.progressBarContainer}>
            <input
              type="range"
              min="0"
              max={duration || 1}
              value={currentTime}
              step="0.01"
              onChange={(e) => handleSeek(Number.parseFloat(e.target.value))}
              className={styles.progressBar}
            />
          </div>

          {/* Controls Row */}
          <div className={styles.controlsRow}>
            <div className={styles.playbackControls}>
              {/* Play/Pause */}
              <button className={styles.playPauseButton} onClick={handlePlayPause}>
                {isPlaying ? <Pause size={24} /> : <Play size={24} />}
              </button>

              {/* Time Display */}
              <div className={styles.timeDisplay}>
                <span>{formatTime(currentTime)}</span>
                <span>/</span>
                <span>{formatTime(duration)}</span>
              </div>

              {/* Volume Controls */}
              <div className={styles.volumeControls}>
                <button className={styles.muteButton} onClick={() => handleVolumeChange(volume > 0 ? 0 : 1)}>
                  {volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={(e) => handleVolumeChange(Number.parseFloat(e.target.value))}
                  className={styles.volumeSlider}
                />
              </div>
            </div>

            {/* Right Side Controls */}
            <div className={styles.rightControls}>
              {/* Playback Speed */}
              <select
                value={playbackRate}
                onChange={(e) => handlePlaybackRateChange(Number.parseFloat(e.target.value))}
                className={styles.speedSelect}
              >
                <option value="0.25">0.25x</option>
                <option value="0.5">0.5x</option>
                <option value="0.75">0.75x</option>
                <option value="1">1x</option>
                <option value="1.25">1.25x</option>
                <option value="1.5">1.5x</option>
                <option value="1.75">1.75x</option>
                <option value="2">2x</option>
              </select>

              {/* Fullscreen */}
              <button className={styles.fullscreenButton} onClick={toggleFullscreen}>
                {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
