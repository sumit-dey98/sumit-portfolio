import { useState } from 'react';
import { motion } from 'framer-motion';
import styles from './Contact.module.css';

const EMAIL = 'sumit@example.com';

export default function Contact() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
    } catch (err) {
      const textarea = document.createElement('textarea');
      textarea.value = EMAIL;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
    }
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="contact" className={styles.contact}>
      <div className={styles.inner}>
        <p className={styles.label}>
          <span className={styles.prompt}>&gt;</span> CONTACT
        </p>

        <motion.div
          className={styles.content}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className={styles.headline}>
            LET'S WORK<br />
            <span className={styles.accent}>TOGETHER.</span>
          </h2>

          <p className={styles.sub}>
            Open to freelance projects, full-time roles, and interesting collabs.
          </p>

          <button className={styles.emailBtn} onClick={handleCopy} data-cursor>
            <span className={styles.emailText}>{EMAIL}</span>
            <span className={styles.emailAction}>
              {copied ? 'COPIED' : 'COPY'}
            </span>
          </button>

          <div className={styles.socials}>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className={styles.social}>
              GitHub
            </a>
            <span className={styles.socialDiv}>/</span>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className={styles.social}>
              LinkedIn
            </a>
            <span className={styles.socialDiv}>/</span>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className={styles.social}>
              Twitter
            </a>
          </div>
        </motion.div>
      </div>

      <div className={styles.footer}>
        <span className={styles.footerText}>
          <span className={styles.prompt}>&gt;</span>&copy;  SUMIT HILLOL DEY | 2025
        </span>
        {/* <span className={styles.footerText}>BUILT WITH REACT + VITE</span> */}
      </div>
    </section>
  );
}