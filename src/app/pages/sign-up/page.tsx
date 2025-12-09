"use client";

import { useState } from "react";
import { api } from "../../services/api";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import { Button } from "../../components/ui/button";
import Link from "next/link";
import StaticParticles from "@/app/components/ui/Particles/StaticParticles";

export default function SignUpPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
    accessCode: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await api.signUp(
        formData.email,
        formData.firstName,
        formData.lastName,
        formData.password,
        formData.confirmPassword,
        formData.accessCode
      );
      if (response.success && response.token) {
        localStorage.setItem("token", response.token);
        router.push("/pages/dashboard");
      } else {
        setError(response.error || "Sign up failed. Please try again.");
      }
    } catch (err) {
      setError("Sign up failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.backgroundContainer}>
        <div className={styles.redGlow} />
      </div>

      <StaticParticles />

      <nav className={styles.nav}>
        <div className={styles.navContent}>
          <button onClick={() => router.push("/")} className={styles.backButton}>
            ← Back to Home
          </button>
        </div>
      </nav>

      <main className={styles.main}>
        <div className={styles.formContainer}>
          <div className={styles.eyebrow}>Join Stashy</div>
          <h1 className={styles.title}>
            Create Your <span className={styles.gradientText}>Account</span>
          </h1>

          {error && <div className={styles.errorMessage}>{error}</div>}

          <form className={styles.form} onSubmit={handleSignUp}>
            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.label}>
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className={styles.input}
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className={styles.nameRow}>
              <div className={styles.inputGroup}>
                <label htmlFor="first-name" className={styles.label}>
                  First Name
                </label>
                <input
                  type="text"
                  id="first-name"
                  name="firstName"
                  className={styles.input}
                  placeholder="First name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="last-name" className={styles.label}>
                  Last Name
                </label>
                <input
                  type="text"
                  id="last-name"
                  name="lastName"
                  className={styles.input}
                  placeholder="Last name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>
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
                placeholder="Create a password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="confirm-password" className={styles.label}>
                Confirm Password
              </label>
              <input
                type="password"
                id="confirm-password"
                name="confirmPassword"
                className={styles.input}
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="code" className={styles.label}>
                Access Code
              </label>
              <input
                type="text"
                id="code"
                name="accessCode"
                className={styles.input}
                placeholder="Enter your access code"
                value={formData.accessCode}
                onChange={handleInputChange}
                required
              />
            </div>

            <Button type="submit" size="lg" className={styles.signUpButton} disabled={loading}>
              {loading ? "Creating Account..." : "Sign Up"}
            </Button>

            <div className={styles.links}>
              <Link href="/pages/sign-in" className={styles.link}>
                Already have an account? <span className={styles.linkHighlight}>Sign in here</span>
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
