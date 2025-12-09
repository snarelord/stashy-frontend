import { useState } from "react";
import Link from "next/link";
import styles from "./HamBurgerMenu.module.css";

interface HamburgerMenuProps {
  currentPath?: string;
}

export default function HamBurgerMenu({ currentPath = "/" }: HamburgerMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const links = [
    { href: "/pages/dashboard", label: "Home" },
    { href: "/pages/learn-more", label: "Learn More" },
    { href: "#contact", label: "Contact" },
    { href: "/pages/about-me", label: "A Bit About Me" },
  ];

  return (
    <>
      <button
        className={`${styles.hamburgerButton} ${isOpen ? styles.open : ""}`}
        onClick={toggleMenu}
        aria-label="Toggle menu"
        aria-expanded={isOpen}
      >
        <span className={styles.hamburgerLine}></span>
        <span className={styles.hamburgerLine}></span>
        <span className={styles.hamburgerLine}></span>
      </button>

      {isOpen && <div className={styles.overlay} onClick={closeMenu} />}

      <div className={`${styles.menuDrawer} ${isOpen ? styles.open : ""}`}>
        <nav className={styles.menuNav}>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles.menuLink} ${currentPath === link.href ? styles.active : ""}`}
              onClick={closeMenu}
            >
              {link.label}
            </Link>
          ))}
          <button className={styles.signUpButton}>Sign Up</button>
        </nav>
      </div>
    </>
  );
}
