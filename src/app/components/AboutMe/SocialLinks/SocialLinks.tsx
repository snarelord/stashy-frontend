import styles from "./SocialLinks.module.css";

interface SocialLink {
  href: string;
  title: string;
  handle: string;
  icon: React.ReactNode;
}

interface SocialLinksProps {
  links: SocialLink[];
}

export default function SocialLinks({ links }: SocialLinksProps) {
  return (
    <div className={styles.socialLinks}>
      {links.map((link, index) => (
        <a key={index} href={link.href} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
          <div className={styles.socialIcon}>{link.icon}</div>
          <div className={styles.socialInfo}>
            <h3 className={styles.socialTitle}>{link.title}</h3>
            <p className={styles.socialHandle}>{link.handle}</p>
          </div>
        </a>
      ))}
    </div>
  );
}
