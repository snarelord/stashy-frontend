import styles from "./LinearGradient.module.css";

export default function LinearGradient() {
  return (
    <svg
      className={styles.waveSvg}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1920 1080"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="waveGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0099ff" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#00d9ff" stopOpacity="0.3" />
        </linearGradient>
        <linearGradient id="waveGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00d9ff" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#0066ff" stopOpacity="0.2" />
        </linearGradient>
      </defs>

      <path
        d="M0 50 Q200 100 400 75 T800 100 T1200 75 T1600 100 T2000 75"
        stroke="url(#waveGradient1)"
        strokeWidth="2"
        fill="none"
        opacity="0.7"
      />
      <path
        d="M0 120 Q200 180 400 150 T800 180 T1200 150 T1600 180 T2000 150"
        stroke="url(#waveGradient1)"
        strokeWidth="2"
        fill="none"
        opacity="0.6"
      />
      <path
        d="M0 200 Q200 270 400 240 T800 270 T1200 240 T1600 270 T2000 240"
        stroke="url(#waveGradient2)"
        strokeWidth="3"
        fill="none"
        opacity="0.5"
      />
    </svg>
  );
}
