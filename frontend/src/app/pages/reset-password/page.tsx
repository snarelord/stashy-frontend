"use client";

import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import styles from "./page.module.css";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Button from "../../components/Button/Button";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("", {});

      const data = await response.json();

      if (response.ok && data.token) {
        localStorage.setItem("token", data.token);
        router.push(`/pages/dashboard`);
      }
    } catch (err) {
      setError("Sign in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <div className={styles.formContainer}>
          <h1 className={styles.title}>Reset Password</h1>

          <form className={styles.form} onSubmit={handleResetPassword}>
            <div className={styles.inputGroup}>
              <label htmlFor="password" className={styles.label}>
                New password
              </label>
              <input
                type="new-password"
                id="email"
                className={styles.input}
                placeholder="New password"
                // value={email}
                // onChange={}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="password" className={styles.label}>
                Confirm new password
              </label>
              <input
                type="password"
                id="confirm-new-password"
                className={styles.input}
                placeholder="Confirm new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button text="Reset password" colourScheme="purple" type="submit" />

            <div className={styles.links}>
              <Link href="/pages/sign-up" className={styles.link}>
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
