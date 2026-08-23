import { useState } from 'react';
import LiteSection from './LiteSection';
import styles from './LiteContact.module.css';

const EMAIL = 'work.sumit@gmail.com';

export default function LiteContact() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = EMAIL;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <LiteSection index={6} label="CONTACT" className={styles.section}>
      <h2 className={styles.headline}>
        LET'S WORK<br />
        <span className={styles.accent}>TOGETHER.</span>
      </h2>

      <p className={styles.sub}>
        Open to freelance projects, full-time roles, and interesting collabs.
      </p>

      <button className={styles.emailBtn} onClick={handleCopy}>
        <span className={styles.emailText}>{EMAIL}</span>
        <span className={styles.emailAction}>{copied ? 'COPIED' : 'COPY'}</span>
      </button>

      <div className={styles.socials}>
        <a href="https://github.com/sumit-dey98" target="_blank" rel="noopener noreferrer" className={styles.social}>GitHub</a>
        <span className={styles.socialDiv}>/</span>
        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className={styles.social}>LinkedIn</a>
        <span className={styles.socialDiv}>/</span>
        <a href="https://wa.me/8801717742550" target="_blank" rel="noopener noreferrer" className={styles.social}>WhatsApp</a>
      </div>

      <span className={styles.footer}>
        <span className={styles.prompt}>&gt;</span> © SUMIT HILLOL DEY | 2026
      </span>
    </LiteSection>
  );
}
