"use client";

import type React from "react";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import styles from "./DonationForm.module.css";

const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUB_KEY || "";
const stripePromise = stripePublishableKey ? loadStripe(stripePublishableKey) : null;
const presetAmounts = [5, 10, 25, 50, 100];

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [amount, setAmount] = useState<number | string | null>(presetAmounts[0]);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error">("success");

  if (!stripePublishableKey) {
    return (
      <div className={styles.donationContainer}>
        <h2 className={styles.heading}>
          Support <span className={styles.gradientText}>Stashy</span>
        </h2>
        <div className={`${styles.message} ${styles.messageError}`}>
          Stripe configuration is missing. Please add NEXT_PUBLIC_STRIPE_PUB_KEY to your environment variables in the
          Vars section.
        </div>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const donationAmount = typeof amount === "string" ? Number(customAmount) : amount;

    if (!donationAmount || donationAmount < 1) {
      setMessage("Please enter a valid donation amount.");
      setMessageType("error");
      setLoading(false);
      return;
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/create-payment-intent`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: donationAmount }),
    });

    const { clientSecret, error } = await response.json();

    if (error) {
      setMessage(error);
      setMessageType("error");
      setLoading(false);
      return;
    }

    const cardElement = elements?.getElement(CardElement);
    if (!cardElement) {
      setMessage("Card details not found.");
      setMessageType("error");
      setLoading(false);
      return;
    }

    const result = await stripe?.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
      },
    });

    if (result?.error) {
      setMessage(result.error.message || "Payment failed");
      setMessageType("error");
    } else if (result?.paymentIntent?.status === "succeeded") {
      setMessage("Thank you for your donation! Your support means the world to us.");
      setMessageType("success");
    }
    setLoading(false);
  }

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomAmount(e.target.value);
  };

  return (
    <div className={styles.donationContainer}>
      <h2 className={styles.heading}>
        Support <span className={styles.gradientText}>Stashy</span>
      </h2>
      <p className={styles.subheading}>
        Help keep this project free and growing. Every contribution makes a difference!
      </p>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.amountSection}>
          <label className={styles.sectionLabel}>Select Amount</label>
          <div className={styles.amountGrid}>
            {presetAmounts.map((amt) => (
              <div key={amt} className={styles.amountOption}>
                <input
                  type="radio"
                  id={`amount-${amt}`}
                  name="amount"
                  value={amt}
                  checked={amount === amt}
                  onChange={() => setAmount(amt)}
                  className={styles.radioInput}
                />
                <label htmlFor={`amount-${amt}`} className={styles.amountLabel}>
                  £{amt}
                </label>
              </div>
            ))}

            <div className={`${styles.amountOption} ${styles.customAmountOption}`}>
              <input
                type="radio"
                id="amount-custom"
                name="amount"
                value="custom"
                checked={typeof amount === "string"}
                onChange={() => setAmount("custom")}
                className={styles.radioInput}
              />
              <label htmlFor="amount-custom" className={styles.customAmountLabel}>
                <span className={styles.customAmountText}>Custom: £</span>
                <input
                  type="number"
                  min="1"
                  placeholder="Enter amount"
                  value={customAmount}
                  onChange={handleCustomAmountChange}
                  disabled={typeof amount !== "string"}
                  className={styles.customInput}
                  onClick={() => setAmount("custom")}
                />
              </label>
            </div>
          </div>
        </div>

        <div className={styles.cardSection}>
          <label className={styles.sectionLabel}>Card Details</label>
          <div className={styles.cardElementWrapper}>
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#ffffff",
                    "::placeholder": {
                      color: "rgba(255, 255, 255, 0.5)",
                    },
                    iconColor: "#22d3ee",
                  },
                  invalid: {
                    color: "#f87171",
                    iconColor: "#f87171",
                  },
                },
              }}
            />
          </div>
        </div>

        <button type="submit" disabled={!stripe || loading} className={styles.submitButton}>
          {loading ? "Processing..." : "Complete Donation"}
        </button>

        {message && (
          <div
            className={`${styles.message} ${messageType === "success" ? styles.messageSuccess : styles.messageError}`}
          >
            {message}
          </div>
        )}
      </form>
    </div>
  );
}

export default function DonationForm() {
  if (!stripePromise) {
    return <CheckoutForm />;
  }

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
}
