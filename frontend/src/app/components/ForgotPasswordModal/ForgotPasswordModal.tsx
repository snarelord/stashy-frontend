"use client";

import { useState } from "react";
import styles from "./ForgotPasswordModal.module.css";
import Button from "../Button/Button";

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setError("");
    setIsSubmitted(true);

    // to do: add backend API call here
    // await fetch('/api/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }); etc
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

        <h2 className={styles.title}>Forgot Password?</h2>

        {!isSubmitted ? (
          <>
            <p className={styles.description}>
              Enter your email address and we'll send you a link to reset your password.
            </p>

            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.inputGroup}>
                <label htmlFor="forgot-email" className={styles.label}>
                  Email
                </label>
                <input
                  type="email"
                  id="forgot-email"
                  className={`${styles.input} ${error ? styles.inputError : ""}`}
                  placeholder="Enter your email"
                  value={email}
                  onChange={handleEmailChange}
                  autoFocus
                />
                {error && <p className={styles.errorText}>{error}</p>}
              </div>

              <Button text="Send Reset Link" colourScheme="purple" type="submit" disabled={isButtonDisabled} />
            </form>
          </>
        ) : (
          <div className={styles.successState}>
            <div className={styles.successIcon}>✓</div>
            <h3 className={styles.successTitle}>Check your inbox</h3>
            <p className={styles.successMessage}>
              If this email is registered, you'll receive a reset link shortly. Don't forget to check spam!
            </p>
            <Button text="Close" colourScheme="purple" onClick={handleClose} />
          </div>
        )}
      </div>
    </div>
  );
}
