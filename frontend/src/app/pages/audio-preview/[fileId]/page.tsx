"use client";

import { useState, useEffect, use, useRef } from "react";
import { api } from "../../../services/api";
import { useRouter } from "next/navigation";
import VisualiserBars from "../../../components/Visualiser/Visualiser/VisualiserBars";
import LUFSMeter from "../../../components/Visualiser/LUFSMeter/LUFSMeter";
import AudioControls from "@/app/components/Visualiser/AudioControls/AudioControls";
import styles from "./page.module.css";

interface AudioPreviewProps {
  params: Promise<{
    fileId: string;
  }>;
}

export default function AudioPreviewPage({ params }: AudioPreviewProps) {
  const router = useRouter();
  const { fileId } = use(params);
  const [file, setFile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [serverLUFS, setServerLUFS] = useState<number | null>(null);

  const audioRef = useRef<HTMLAudioElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);

  useEffect(() => {
    loadFile();
  }, [fileId]);

  async function loadFile() {
    try {
      console.log("Loading file with ID:", fileId);
      const response = await api.getFiles();
      console.log("Files response:", response);
      const foundFile = response.files.find((f: any) => f.id === fileId);
      console.log("Found file: ", foundFile);

      if (foundFile) {
        setFile(foundFile);

        // Extract server LUFS if available
        if (foundFile.audioAnalysis?.integratedLUFS) {
          console.log("Setting serverLUFS:", foundFile.audioAnalysis.integratedLUFS);
          setServerLUFS(foundFile.audioAnalysis.integratedLUFS);
        }

        if (audioRef.current) {
          const streamUrl = `${process.env.NEXT_PUBLIC_API_URL}/files/stream/${fileId}`;
          console.log("Setting audio src:", streamUrl);
          audioRef.current.src = streamUrl;
          audioRef.current.load();
        }
      }
    } catch (error) {
      console.error("Failed to load file:", error);
    } finally {
      setLoading(false);
    }
  }

  function handlePlayPause() {
    console.log("handlePlayPause called, isPlaying:", isPlaying);
    if (!audioRef.current) return;

    console.log("Audio state before action:", {
      paused: audioRef.current.paused,
      readyState: audioRef.current.readyState,
      networkState: audioRef.current.networkState,
      src: audioRef.current.src,
      duration: audioRef.current.duration,
    });

    if (isPlaying) {
      console.log("Pausing audio");
      audioRef.current.pause();
    } else {
      if (!audioContextRef.current) {
        console.log("Creating audio context");
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const analyser = audioContext.createAnalyser();

        analyser.fftSize = 4096; // Higher FFT = better high-frequency detail
        (analyser.smoothingTimeConstant = 0), 5; // Less smoothing = more responsive
        analyser.minDecibels = -90; // Pick up quieter sounds
        analyser.maxDecibels = -10; // Adjust dynamic range

        const source = audioContext.createMediaElementSource(audioRef.current);
        source.connect(analyser);
        analyser.connect(audioContext.destination);

        audioContextRef.current = audioContext;
        analyserRef.current = analyser;
        sourceRef.current = source;
        console.log("Audio context created");
      }
      console.log("▶Playing audio");
      audioRef.current
        .play()
        .then(() => {
          console.log("Audio play() succeeded");
        })
        .catch((error) => {
          console.error("Audio play() failed:", error);
        });
    }

    setIsPlaying(!isPlaying);
  }

  function handleVolumeChange(newVolume: number) {
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  }

  function handleTimeUpdate() {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  }

  function handleLoadedMetadata() {
    console.log("Audio metadata loaded");
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  }

  function handleSeek(time: number) {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }

  function handleEnded() {
    setIsPlaying(false);
    setCurrentTime(0);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  }

  async function handleDownload() {
    try {
      await api.downloadFile(fileId);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download file");
    }
  }

  if (loading) {
    return (
      <div className={styles.pageContainer}>
        <p className={styles.loadingText}>Loading audio...</p>
      </div>
    );
  }

  if (!file) {
    return (
      <div className={styles.pageContainer}>
        <p className={styles.loadingText}>Audio file not found</p>
        <button onClick={() => router.back()} className={styles.backButtonCenter}>
          ← Go Back
        </button>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      {/* Header Bar */}
      <header className={styles.header}>
        <button onClick={() => router.back()} className={styles.backButton}>
          ✕
        </button>

        <div className={styles.fileInfo}>
          <h1 className={styles.fileName}>{file.name}</h1>
          <p className={styles.fileDetails}>{(file.size / 1024 / 1024).toFixed(2)} MB</p>
        </div>

        <button onClick={handleDownload} className={styles.downloadButton}>
          ↓
        </button>
      </header>

      {/* Visualiser - Takes up most of screen */}
      <main className={styles.visualiserMain}>
        <VisualiserBars analyser={analyserRef.current} isPlaying={isPlaying} />

        {/* LUFS Meter positioned top right */}
        <div className={styles.lufsPosition}>
          <LUFSMeter analyser={analyserRef.current} isPlaying={isPlaying} serverLUFS={serverLUFS} />
        </div>
      </main>

      {/* Controls Footer */}
      <footer className={styles.footer}>
        <AudioControls
          isPlaying={isPlaying}
          volume={volume}
          currentTime={currentTime}
          duration={duration}
          onPlayPause={handlePlayPause}
          onVolumeChange={handleVolumeChange}
          onSeek={handleSeek}
          hasAudio={!!file}
        />
      </footer>

      {/* Hidden Audio Element */}
      {/* <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        crossOrigin="anonymous"
      /> */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        crossOrigin="anonymous"
        preload="metadata"
        onLoadStart={() => {
          console.log("🎵 Audio load started");
          console.log("Audio src:", audioRef.current?.src);
        }}
        onLoadedData={() => console.log("Audio data loaded")}
        onCanPlay={() => console.log("Audio can play")}
        onCanPlayThrough={() => console.log("Audio can play through")}
        onError={(e) => {
          console.error("Audio error event:", e);
          if (audioRef.current?.error) {
            const errorCodes = {
              1: "MEDIA_ERR_ABORTED - Playback aborted",
              2: "MEDIA_ERR_NETWORK - Network error",
              3: "MEDIA_ERR_DECODE - Decode error",
              4: "MEDIA_ERR_SRC_NOT_SUPPORTED - Source not supported",
            };
            console.error("Audio error:", {
              code: audioRef.current.error.code,
              message: errorCodes[audioRef.current.error.code as keyof typeof errorCodes],
            });
          }
          console.error("Audio state:", {
            networkState: audioRef.current?.networkState,
            readyState: audioRef.current?.readyState,
            src: audioRef.current?.src,
            currentSrc: audioRef.current?.currentSrc,
          });
        }}
        onStalled={() => console.log("Audio stalled")}
        onSuspend={() => console.log("Audio suspended")}
        onAbort={() => console.log("Audio aborted")}
        onEmptied={() => console.log("Audio emptied")}
        onWaiting={() => console.log("Audio waiting")}
        onProgress={() => console.log("Audio progress")}
      />
    </div>
  );
}
