"use client";

import styles from "./page.module.css";
import Button from "./components/Button/Button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Footer from "./components/Footer/Footer";

export default function Home() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push("/sign-in");
  };

  return (
    <div className={styles.page} style={{ backgroundColor: "white" }}>
      <div className={styles.main}>
        <h1 className={styles.title}>Welcome to</h1>
        <div className={styles.container}>
          <Image src="/stashy-black.png" alt="Stashy Logo" width={350} height={105} className={styles.logo} />
        </div>
        <div>
          <p className={styles.description}>Your personal stash management solution.</p>
        </div>
        <div className={styles.buttonContainer}>
          <Button text="Get Started" colourScheme="purple" disabled={false} onClick={handleGetStarted} />
          <Button text="Learn More" colourScheme="purple" disabled={true} />
        </div>
      </div>
      <Footer />
    </div>
  );
}
