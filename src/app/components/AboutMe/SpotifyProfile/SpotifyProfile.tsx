"use client";

import { useEffect, useState } from "react";
import styles from "./SpotifyProfile.module.css";

interface ArtistData {
  name: string;
  followers: number;
  genres: string[];
  imageUrl: string;
  spotifyUrl: string;
}

interface TopTrack {
  id: string;
  name: string;
  albumName: string;
  albumArt: string;
  previewUrl: string | null;
  spotifyUrl: string;
  releaseDate: string;
}

interface LatestRelease {
  id: string;
  name: string;
  type: string;
  releaseDate: string;
  totalTracks: number;
  imageUrl: string;
  spotifyUrl: string;
  artistName: string;
}

interface SpotifyData {
  artist: ArtistData;
  topTracks: TopTrack[];
  latestRelease: LatestRelease | null;
}

const SpotifyIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
  </svg>
);

export default function SpotifyProfile() {
  const [data, setData] = useState<SpotifyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSpotifyData() {
      try {
        const response = await fetch("/api/spotify/artist");
        if (!response.ok) {
          throw new Error("Failed to fetch Spotify data");
        }
        const spotifyData: SpotifyData = await response.json();
        setData(spotifyData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchSpotifyData();
  }, []);

  if (loading) {
    return (
      <div className={styles.spotifyPlaceholder}>
        <div className={styles.spotifyIcon}>
          <SpotifyIcon className={styles.icon} />
        </div>
        <p className={styles.placeholderText}>Loading Spotify Profile...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className={styles.spotifyPlaceholder}>
        <div className={styles.spotifyIcon}>
          <SpotifyIcon className={styles.icon} />
        </div>
        <p className={styles.placeholderText}>Spotify Profile</p>
        <p className={styles.placeholderSubtext}>Configure API credentials to enable</p>
      </div>
    );
  }

  const { artist, topTracks, latestRelease } = data;

  return (
    <div className={styles.spotifyContainer}>
      <div className={styles.artistHeader}>
        {artist.imageUrl && <img src={artist.imageUrl} alt={artist.name} className={styles.artistImage} />}
        <div className={styles.artistInfo}>
          <h3 className={styles.artistName}>{artist.name}</h3>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statNumber}>{artist.followers.toLocaleString()}</span>
              <span className={styles.statLabel}>Followers</span>
            </div>
          </div>
          <a href={artist.spotifyUrl} target="_blank" rel="noopener noreferrer" className={styles.spotifyLink}>
            <SpotifyIcon className={styles.spotifyIcon} />
            Open in Spotify
          </a>
        </div>
      </div>

      {latestRelease && (
        <div className={styles.latestRelease}>
          <h4 className={styles.sectionTitle}>Latest Release</h4>
          <a href={latestRelease.spotifyUrl} target="_blank" rel="noopener noreferrer" className={styles.releaseCard}>
            <img src={latestRelease.imageUrl} alt={latestRelease.name} className={styles.releaseImage} />
            <div className={styles.releaseInfo}>
              <span className={styles.releaseType}>{latestRelease.type.toUpperCase()}</span>
              <h5 className={styles.releaseName}>{latestRelease.name}</h5>
              <p className={styles.releaseDetails}>
                {new Date(latestRelease.releaseDate).getFullYear()} • {latestRelease.totalTracks}{" "}
                {latestRelease.totalTracks === 1 ? "Track" : "Tracks"}
              </p>
            </div>
          </a>
        </div>
      )}

      <div className={styles.topTracks}>
        <div className={styles.trackList}>
          {topTracks.map((track, index) => (
            <a
              key={track.id}
              href={track.spotifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.track}
            >
              <span className={styles.trackNumber}>{index + 1}</span>
              <img src={track.albumArt} alt={track.albumName} className={styles.albumArt} />
              <div className={styles.trackInfo}>
                <span className={styles.trackName}>{track.name}</span>
                <span className={styles.albumName}>{track.albumName}</span>
              </div>
              <svg viewBox="0 0 24 24" fill="currentColor" className={styles.playIcon}>
                <path d="M8 5v14l11-7z" />
              </svg>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
