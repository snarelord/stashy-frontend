import { useMemo } from "react";
import styles from "./StaticParticles.module.css";

export default function StaticParticles() {
  const particles = useMemo(() => {
    return [...Array(20)].map((_, i) => (
      <div
        key={i}
        className={styles.particle}
        style={{
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 3}s`,
          animationDuration: `${2 + Math.random() * 3}s`,
        }}
      />
    ));
  }, []);

  return <div className={styles.particlesContainer}>{particles}</div>;
}
