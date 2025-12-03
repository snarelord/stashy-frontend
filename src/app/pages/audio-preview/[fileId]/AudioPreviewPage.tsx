"use client";

import styles from "./page.module.css";
import { useState, useEffect, useRef } from "react";
import { api } from "../../../services/api";
import { useRouter } from "next/navigation";
import useAuthRedirect from "../../../hooks/useAuthRedirect";
import VisualiserBars from "../../../components/Visualiser/Visualiser/VisualiserBars";
import LUFSMeter from "../../../components/Visualiser/LUFSMeter/LUFSMeter";
import AudioControls from "@/app/components/Visualiser/AudioControls/AudioControls";
import Spinner from "@/app/components/Spinner/Spinner";
import WaveformDisplay from "../../../components/WaveformDisplay/WaveformDisplay";

interface AudioPreviewProps {
  fileId: string;
}

export default function AudioPreviewPage({ fileId }: AudioPreviewProps) {
  const { loading: authLoading, authenticated } = useAuthRedirect();
  const router = useRouter();
  const [file, setFile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [serverLUFS, setServerLUFS] = useState<number | null>(null);
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [waveform, setWaveform] = useState<number[] | null>(null);
  const [waveformLoading, setWaveformLoading] = useState(true);
  const [showWaveform, setShowWaveform] = useState(true);

  const audioRef = useRef<HTMLAudioElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);

  useEffect(() => {
    async function fetchWaveform() {
      setWaveformLoading(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/files/waveform/${fileId}`);
        const data = await res.json();
        if (data.success && Array.isArray(data.waveform)) {
          setWaveform(data.waveform);
        }
      } catch (err) {
        console.error("Failed to fetch waveform:", err);
      } finally {
        setWaveformLoading(false);
      }
    }
    fetchWaveform();
  }, [fileId]);

  useEffect(() => {
    loadFile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileId]);

  async function loadFile() {
    try {
      const response = await api.getFiles();
      const foundFile = response.files.find((f: any) => f.id === fileId);
      console.log("Found file: ", foundFile);

      if (foundFile) {
        setFile(foundFile);

        setAudioSrc(`${process.env.NEXT_PUBLIC_API_URL}/files/stream/${fileId}`);

        if (foundFile.audioAnalysis?.integratedLUFS) {
          setServerLUFS(foundFile.audioAnalysis.integratedLUFS);
        }

        if (audioRef.current) {
          const streamUrl = `${process.env.NEXT_PUBLIC_API_URL}/files/stream/${fileId}`;
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
    if (!audioRef.current) return;

    if (isPlaying) {
      console.log("Pausing audio");
      audioRef.current.pause();
    } else {
      if (!audioContextRef.current) {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const analyser = audioContext.createAnalyser();

        analyser.fftSize = 8192;
        analyser.smoothingTimeConstant = 0.5; // less smoothing = more responsive
        analyser.minDecibels = -90; // pick up quieter sounds
        analyser.maxDecibels = -10; // adjust dynamic range

        const source = audioContext.createMediaElementSource(audioRef.current);
        const visGain = audioContext.createGain();
        visGain.gain.value = 0.1;

        source.connect(visGain);
        visGain.connect(analyser);
        source.connect(audioContext.destination);

        audioContextRef.current = audioContext;
        analyserRef.current = analyser;
        sourceRef.current = source;
      }
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
    // console.log("Audio metadata loaded");
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

  if (authLoading) {
    return <Spinner />;
  }

  if (!authenticated) {
    return null;
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
      <header className={styles.header}>
        <button onClick={() => router.back()} className={styles.backButton}>
          ✕
        </button>

        <div className={styles.fileInfo}>
          <h1 className={styles.fileName}>{file.name}</h1>
          <p className={styles.fileDetails}>{(file.size / 1024 / 1024).toFixed(2)} MB</p>
        </div>
        <div className={styles.headerActions}>
          <button onClick={() => setShowWaveform((prev) => !prev)} className={styles.toggleButton} type="button">
            {showWaveform ? "Show Visualiser" : "Show Waveform"}
          </button>

          <button onClick={handleDownload} className={styles.downloadButton}>
            Download
          </button>
        </div>
      </header>

      <main className={styles.visualiserMain}>
        <div className={styles.toggleContainer}></div>
        {showWaveform ? (
          waveformLoading ? (
            <div className={styles.loadingText}>Loading waveform...</div>
          ) : waveform ? (
            <WaveformDisplay
              waveform={waveform}
              currentTime={currentTime}
              duration={duration}
              onSeek={handleSeek}
              playedColour="#a499ed8c"
            />
          ) : (
            <div className={styles.loadingText}>Failed to load waveform</div>
          )
        ) : (
          <VisualiserBars analyser={analyserRef.current} isPlaying={isPlaying} />
        )}
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.controlsContainer}>
            <AudioControls
              isPlaying={isPlaying}
              volume={volume}
              currentTime={currentTime}
              duration={duration}
              onPlayPause={handlePlayPause}
              onVolumeChange={handleVolumeChange}
              onSeek={handleSeek}
              hasAudio={!!file}
              showProgressBar={!showWaveform}
            />
          </div>
        </div>
      </footer>

      <audio
        ref={audioRef}
        src={audioSrc || undefined}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        crossOrigin="anonymous"
        preload="metadata"
        // onLoadStart={() => {
        //   console.log("Audio load started");
        //   console.log("Audio src:", audioRef.current?.src);
        // }}
        // onLoadedData={() => console.log("Audio data loaded")}
        // onCanPlay={() => console.log("Audio can play")}
        // onCanPlayThrough={() => console.log("Audio can play through")}
        // onError={(e) => {
        //   console.error("Audio error event:", e);
        //   if (audioRef.current?.error) {
        //     const errorCodes = {
        //       1: "MEDIA_ERR_ABORTED - Playback aborted",
        //       2: "MEDIA_ERR_NETWORK - Network error",
        //       3: "MEDIA_ERR_DECODE - Decode error",
        //       4: "MEDIA_ERR_SRC_NOT_SUPPORTED - Source not supported",
        //     };
        //     console.error("Audio error:", {
        //       code: audioRef.current.error.code,
        //       message: errorCodes[audioRef.current.error.code as keyof typeof errorCodes],
        //     });
        //   }
        //   console.error("Audio state:", {
        //     networkState: audioRef.current?.networkState,
        //     readyState: audioRef.current?.readyState,
        //     src: audioRef.current?.src,
        //     currentSrc: audioRef.current?.currentSrc,
        //   });
        // }}
        // onStalled={() => console.log("Audio stalled")}
        // onSuspend={() => console.log("Audio suspended")}
        // onAbort={() => console.log("Audio aborted")}
        // onEmptied={() => console.log("Audio emptied")}
        // onWaiting={() => console.log("Audio waiting")}
        // onProgress={() => console.log("Audio progress")}
      />
    </div>
  );
}
