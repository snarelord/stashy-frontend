import styles from "./WaveformDisplay.module.css";

interface WaveformDisplayProps {
  waveform: number[]; // array of normalised values 0 to 1
  width?: number;
  height?: number;
  colour?: string;
  playedColour?: string;
  currentTime: number;
  duration: number;
  onSeek?: (time: number) => void;
}

export default function WaveformDisplay({
  waveform,
  width = 800,
  height = 100,
  colour = "#a499edff",
  playedColour = "",
  currentTime,
  duration,
  onSeek,
}: WaveformDisplayProps) {
  if (!waveform || waveform.length === 0) return null;

  const barWidth = width / waveform.length;
  const played = duration > 0 ? currentTime / duration : 0;
  const playedBars = Math.floor(played * waveform.length);

  function handleSeek(e: React.MouseEvent<SVGSVGElement, MouseEvent>) {
    if (!onSeek || !duration) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = Math.min(Math.max(x / rect.width, 0), 1);
    onSeek(percent * duration);
  }

  return (
    <div className={styles.waveformContainer}>
      <svg
        className={styles.waveformSvg}
        width="100%"
        height="100%"
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        onClick={handleSeek}
        style={{ cursor: onSeek ? "pointer" : "default" }}
      >
        {waveform.map((value, i) => {
          const barHeight = value * height;
          const isPlayed = i <= playedBars;
          return (
            <rect
              key={i}
              x={i * barWidth}
              y={height - barHeight}
              width={Math.max(barWidth - 1, 1)}
              height={barHeight}
              fill={isPlayed ? playedColour : colour}
              rx={barWidth / 2}
              className={styles.waveformBar}
            />
          );
        })}
        <rect x={playedBars * barWidth - 1} y={0} width={1} height={height} fill="#fff" opacity={0.8} />
      </svg>
    </div>
  );
}
