import styles from "./page.module.css";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Button from "../../components/Button/Button";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <div className={styles.formContainer}>
          <Link href="/pages/sign-in" className={styles.backButton}>
            <span className={styles.backArrow}>←</span> Back
          </Link>
          <h1 className={styles.title}>Sign Up</h1>

          <form className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.label}>
                Email
              </label>
              <input type="email" id="email" className={styles.input} placeholder="Email" />
            </div>

            <div className={styles.nameRow}>
              <div className={styles.inputGroup}>
                <label htmlFor="first-name" className={styles.label}>
                  First name
                </label>
                <input type="text" id="first-name" className={styles.input} placeholder="Value" />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="last-name" className={styles.label}>
                  Last name
                </label>
                <input type="text" id="last-name" className={styles.input} placeholder="Value" />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="password" className={styles.label}>
                Password
              </label>
              <input type="password" id="password" className={styles.input} placeholder="Password" />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="confirm-password" className={styles.label}>
                Confirm password
              </label>
              <input type="password" id="confirm-password" className={styles.input} placeholder="Confirm password" />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="code" className={styles.label}>
                Access code
              </label>
              <input type="text" id="code" className={styles.input} placeholder="Value" />
            </div>

            <Button text="Sign Up" colourScheme="purple" disabled={true} />
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
