import { Fragment, useState } from 'react';
import LiteSection from './LiteSection';
import styles from './LiteContact.module.css';

/** Lite variant: 'contact'. Data shape matches src/data/sections/contact.js. */
export default function LiteContact({ data = {}, label, index, total }) {
  const {
    headline = '',
    headlineAccent = '',
    sub = '',
    email = '',
    socials = [],
    footer = '',
  } = data;

  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!email) return;
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = email;
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

  const footerText = footer.replace('{year}', String(new Date().getFullYear()));

  return (
    <LiteSection index={index} total={total} label={label} className={styles.section}>
      {(headline || headlineAccent) && (
        <h2 className={styles.headline}>
          {headline}
          {headline && headlineAccent && <br />}
          {headlineAccent && <span className={styles.accent}>{headlineAccent}</span>}
        </h2>
      )}

      {sub && <p className={styles.sub}>{sub}</p>}

      {email && (
        <button className={styles.emailBtn} onClick={handleCopy}>
          <span className={styles.emailText}>{email}</span>
          <span className={styles.emailAction}>{copied ? 'COPIED' : 'COPY'}</span>
        </button>
      )}

      {socials.length > 0 && (
        <div className={styles.socials}>
          {socials.map((social, i) => (
            <Fragment key={social.url || i}>
              {i > 0 && <span className={styles.socialDiv}>/</span>}
              <a
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.social}
              >
                {social.label}
              </a>
            </Fragment>
          ))}
        </div>
      )}

      {footerText && (
        <span className={styles.footer}>
          <span className={styles.prompt}>&gt;</span> {footerText}
        </span>
      )}
    </LiteSection>
  );
}
