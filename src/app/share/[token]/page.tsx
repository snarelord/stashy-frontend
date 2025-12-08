"use client";

import styles from "./page.module.css";
import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import AudioControls from "@/app/components/Visualiser/AudioControls/AudioControls";
import Spinner from "@/app/components/Spinner/Spinner";
import WaveformDisplay from "../../components/WaveformDisplay/WaveformDisplay";
import toast from "react-hot-toast";
import { shareService } from "../../services/shares";
import PublicFilePreview from "@/app/components/PublicFilePreview/PublicFilePreview";

export default function SharedAudioPage() {
  const params = useParams();
  const token = params.token as string;

  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [waveform, setWaveform] = useState<number[] | null>(null);
  const [waveformLoading, setWaveformLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    function checkMobile() {
      setIsMobile(window.matchMedia("(max-width: 700px)").matches);
    }
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (token) {
      loadSharedContent();
    }
  }, [token]);

  async function loadSharedContent() {
    try {
      setLoading(true);
      const data = await shareService.accessShared(token);
      setContent(data);

      if (data.type === "file" && data.file && data.file.mimeType.startsWith("audio/")) {
        await fetchWaveform(data.file.id);
      }
    } catch (error: any) {
      setError(error.message || "Failed to load shared content");
    } finally {
      setLoading(false);
    }
  }

  async function fetchWaveform(fileId: string) {
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

  function handlePlayPause() {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((error) => {
        console.error("Audio play() failed:", error);
        toast.error("Failed to play audio");
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
      await shareService.downloadShared(token);
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Failed to download file");
    }
  }

  if (loading) {
    return (
      <div className={styles.pageContainer}>
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.error}>
          <h1>Error</h1>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.error}>
          <h1>Not Found</h1>
          <p>This share link does not exist or has expired.</p>
        </div>
      </div>
    );
  }

  // Handle non-audio files or folders
  if (content.type !== "file" || !content.file.mimeType.startsWith("audio/")) {
    return <PublicFilePreview />;
  }

  // Audio file preview
  const file = content.file;

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <div className={styles.fileInfo}>
          <h1 className={styles.fileName}>{file.name}</h1>
          <p className={styles.fileDetails}>
            {(file.size / 1024 / 1024).toFixed(2)} MB • Expires {content.remainingTime}
          </p>
        </div>
        <div className={styles.headerActions}>
          <button onClick={handleDownload} className={styles.downloadButton}>
            Download
          </button>
        </div>
      </header>

      {isMobile && <img src="/audio-icon.svg" alt="Audio Icon" className={styles.audioIcon} />}

      <main className={styles.visualiserMain}>
        {waveformLoading ? (
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
          <div className={styles.loadingText}>Waveform not available</div>
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
              hasAudio={true}
              showProgressBar={false}
            />
          </div>
        </div>
      </footer>

      <audio
        ref={audioRef}
        src={`${process.env.NEXT_PUBLIC_API_URL}/files/stream/${file.id}`}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        crossOrigin="anonymous"
        preload="metadata"
      />
    </div>
  );
}

// "use client";

// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import { shareService } from "../../services/shares";
// import styles from "./page.module.css";
// import Spinner from "../../components/Spinner/Spinner";

// export default function SharedPage() {
//   const params = useParams();
//   const token = params.token as string;

//   const [content, setContent] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (token) {
//       loadSharedContent();
//     }
//   }, [token]);

//   async function loadSharedContent() {
//     try {
//       setLoading(true);
//       const data = await shareService.accessShared(token);
//       setContent(data);
//     } catch (error: any) {
//       setError(error.message || "Failed to load shared content");
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function handleDownload() {
//     try {
//       await shareService.downloadShared(token);
//     } catch (error) {
//       console.error("Download failed:", error);
//       alert("Failed to download file");
//     }
//   }

//   if (loading) {
//     return (
//       <div className={styles.container}>
//         <Spinner />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className={styles.container}>
//         <div className={styles.error}>
//           <h1>❌ Error</h1>
//           <p>{error}</p>
//         </div>
//       </div>
//     );
//   }

//   if (!content) {
//     return (
//       <div className={styles.container}>
//         <div className={styles.error}>
//           <h1>Not Found</h1>
//           <p>This share link does not exist or has expired.</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className={styles.container}>
//       <div className={styles.card}>
//         <div className={styles.header}>
//           <h1>
//             {content.type === "file" ? "📄" : "📁"} Shared {content.type === "file" ? "File" : "Folder"}
//           </h1>
//         </div>

//         <div className={styles.expiryInfo}>
//           <p>⏰ {content.expiresAtFormatted}</p>
//           <p>{content.remainingTime}</p>
//         </div>

//         {content.type === "file" && content.file && (
//           <div className={styles.fileInfo}>
//             <h2>{content.file.name}</h2>
//             <p className={styles.fileSize}>Size: {(content.file.size / 1024 / 1024).toFixed(2)} MB</p>
//             <p className={styles.mimeType}>Type: {content.file.mimeType}</p>
//             <button className={styles.downloadBtn} onClick={handleDownload}>
//               ⬇️ Download File
//             </button>
//           </div>
//         )}

//         {content.type === "folder" && content.folder && (
//           <div className={styles.folderContent}>
//             <h2>{content.folder.name}</h2>
//             <p className={styles.folderStats}>
//               📊 {content.folder.fileCount} files, {content.folder.folderCount} folders
//             </p>

//             {content.files && content.files.length > 0 && (
//               <div className={styles.section}>
//                 <h3>Files:</h3>
//                 <ul className={styles.fileList}>
//                   {content.files.map((file: any) => (
//                     <li key={file.id}>
//                       📄 {file.name} - {(file.size / 1024).toFixed(2)} KB
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             )}

//             {content.folders && content.folders.length > 0 && (
//               <div className={styles.section}>
//                 <h3>Folders:</h3>
//                 <ul className={styles.folderList}>
//                   {content.folders.map((folder: any) => (
//                     <li key={folder.id}>📁 {folder.name}</li>
//                   ))}
//                 </ul>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
