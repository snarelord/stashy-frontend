"use client";

import { useState } from "react";
import { api } from "../../services/api";
import styles from "./ForgotPasswordModal.module.css";
import { Button } from "../ui/button";

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ForgotPasswordModal({ isOpen, onClose }: ForgotPasswordModalProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      const response = await api.forgotPassword(email);
      if (response.success) {
        setIsSubmitted(true);
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
  };

  const handleClose = () => {
    setEmail("");
    setError("");
    setIsSubmitted(false);
    onClose();
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) setError("");
  };

  const isButtonDisabled = !email.trim() || !validateEmail(email);

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={handleClose} aria-label="Close">
          ✕
        </button>

        {!isSubmitted ? (
          <>
            <div className={styles.eyebrow}>Password Reset</div>
            <h2 className={styles.title}>
              Forgot Your <span className={styles.gradientText}>Password?</span>
            </h2>
            <p className={styles.description}>
              Enter your email address and we'll send you a link to reset your password.
            </p>

            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.inputGroup}>
                <label htmlFor="forgot-email" className={styles.label}>
                  Email Address
                </label>
                <input
                  type="email"
                  id="forgot-email"
                  className={`${styles.input} ${error ? styles.inputError : ""}`}
                  placeholder="you@example.com"
                  value={email}
                  onChange={handleEmailChange}
                  autoFocus
                />
                {error && <p className={styles.errorText}>{error}</p>}
              </div>

              <Button type="submit" size="lg" className={styles.submitButton} disabled={isButtonDisabled}>
                Send Reset Link
              </Button>
            </form>
          </>
        ) : (
          <div className={styles.successState}>
            <div className={styles.successIcon}>✓</div>
            <h3 className={styles.successTitle}>Check Your Inbox</h3>
            <p className={styles.successMessage}>
              If this email is registered, you'll receive a reset link shortly. Don't forget to check your spam folder!
            </p>
            <Button size="lg" className={styles.closeSuccessButton} onClick={handleClose}>
              Close
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
