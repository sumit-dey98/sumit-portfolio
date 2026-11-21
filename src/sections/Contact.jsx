import { Fragment, useState } from 'react';
import { useRevealOnView } from '../hooks/useRevealOnView';
import styles from './Contact.module.css';

/**
 * Variant: 'contact'
 * All content comes from the section's `data` - see src/data/sections/contact.js.
 * `socials` may be any length, including zero.
 */
export default function Contact({ data = {}, label }) {
  const {
    headline = '',
    headlineAccent = '',
    sub = '',
    email = '',
    socials = [],
    footer = '',
  } = data;

  const [copied, setCopied] = useState(false);
  const contentRef = useRevealOnView({ duration: 0.6 });

  const handleCopy = async () => {
    if (!email) return;
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = email;
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

  const footerText = footer.replace('{year}', String(new Date().getFullYear()));

  return (
    <section id="contact" className={styles.contact}>
      <div className={styles.inner}>
        {label && (
          <p className={styles.label}>
            <span className={styles.prompt}>&gt;</span> {label}
          </p>
        )}
        <div ref={contentRef} className={styles.content}>
          {(headline || headlineAccent) && (
            <h2 className={styles.headline}>
              {headline}
              {headline && headlineAccent && <br />}
              {headlineAccent && <span className={styles.accent}>{headlineAccent}</span>}
            </h2>
          )}

          {sub && <p className={styles.sub}>{sub}</p>}

          {email && (
            <button className={styles.emailBtn} onClick={handleCopy} data-cursor>
              <span className={styles.emailText}>{email}</span>
              <span className={styles.emailAction}>
                {copied ? 'COPIED' : 'COPY'}
              </span>
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
        </div>
      </div>

      {footerText && (
        <div className={styles.footer}>
          <span className={styles.footerText}>
            <span className={styles.prompt}>&gt;</span>{footerText}
          </span>
        </div>
      )}
    </section>
  );
}
