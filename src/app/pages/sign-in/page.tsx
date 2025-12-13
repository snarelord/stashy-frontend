"use client";

import { useState } from "react";
import styles from "./page.module.css";
import { Button } from "../../components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ForgotPasswordModal from "../../components/ForgotPasswordModal/ForgotPasswordModal";
import StaticParticles from "@/app/components/ui/Particles/StaticParticles";
import Spinner from "@/app/components/Spinner/Spinner";

export default function SignInPage() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  if (!process.env.NEXT_PUBLIC_API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is missing!");
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

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

  const handleForgotPasswordClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.backgroundContainer}>
        <div className={styles.redGlow} />
      </div>
      <StaticParticles />

      {/* Navigation */}
      <nav className={styles.nav}>
        <div className={styles.navContent}>
          <button onClick={() => router.push("/")} className={styles.backButton}>
            ← Back to Home
          </button>
        </div>
      </nav>

      <main className={styles.main}>
        <div className={styles.formContainer}>
          <div className={styles.eyebrow}>Welcome Back</div>
          <h1 className={styles.title}>Sign In</h1>

          {error && <div className={styles.errorMessage}>{error}</div>}

          <form className={styles.form} onSubmit={handleSignIn}>
            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.label}>
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className={styles.input}
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="password" className={styles.label}>
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className={styles.input}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" size="lg" className={styles.signInButton} disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>

            <div className={styles.links}>
              <Link href="#" className={styles.link} onClick={handleForgotPasswordClick}>
                Forgot password?
              </Link>
              <Link href="/pages/sign-up" className={styles.link}>
                New user? <span className={styles.linkHighlight}>Sign up here</span>
              </Link>
            </div>
          </form>
        </div>
      </main>

      <ForgotPasswordModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
