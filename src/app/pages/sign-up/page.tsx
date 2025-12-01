"use client";

import { useState } from "react";
import { api } from "../../services/api";
import { useRouter } from "next/navigation";

import styles from "./page.module.css";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Button from "../../components/Button/Button";
import Link from "next/link";

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
      console.log(formData.email);
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
      <Header />
      <main className={styles.main}>
        <div className={styles.formContainer}>
          <Link href="/pages/sign-in" className={styles.backButton} data-cy="back-button">
            <span className={styles.backArrow}>←</span> Back
          </Link>
          <h1 className={styles.title}>Sign Up</h1>

          <form className={styles.form} onSubmit={handleSignUp}>
            {error && <p className={styles.error}>{error}</p>}

            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.label}>
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className={styles.input}
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className={styles.nameRow}>
              <div className={styles.inputGroup}>
                <label htmlFor="first-name" className={styles.label}>
                  First name
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
                  Last name
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
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="confirm-password" className={styles.label}>
                Confirm password
              </label>
              <input
                type="password"
                id="confirm-password"
                name="confirmPassword"
                className={styles.input}
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="code" className={styles.label}>
                Access code
              </label>
              <input
                type="text"
                id="code"
                name="accessCode"
                className={styles.input}
                placeholder="Access code"
                value={formData.accessCode}
                onChange={handleInputChange}
                required
              />
            </div>

            <Button
              text={loading ? "Signing Up..." : "Sign Up"}
              colourScheme="black"
              disabled={loading}
              type="submit"
            />
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
