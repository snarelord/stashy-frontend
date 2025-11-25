"use client";

import styles from "./page.module.css";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import Button from "../components/Button/Button";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const router = useRouter();

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/dashboard");
  };

  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <div className={styles.formContainer}>
          <h1 className={styles.title}>Sign In</h1>

          <form className={styles.form} onSubmit={handleSignIn}>
            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.label}>
                Email
              </label>
              <input type="email" id="email" className={styles.input} placeholder="Email" />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="password" className={styles.label}>
                Password
              </label>
              <input type="password" id="password" className={styles.input} placeholder="Password" />
            </div>

            <Button text="Sign In" colourScheme="purple" type="submit" />

            <div className={styles.links}>
              <Link href="#" className={styles.link}>
                Forgot password?
              </Link>
              <Link href="/sign-up" className={styles.link}>
                New user? Sign up here
              </Link>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
