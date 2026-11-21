import { Fragment } from 'react';
import { useRevealOnView } from '../hooks/useRevealOnView';
import { useTypewriter } from '../hooks/useTypewriter';
import styles from './Intro.module.css';

/**
 * Variant: 'status'
 * All content comes from the section's `data` - see src/data/sections/intro.js.
 * `stats` and `decorLines` may be any length/count, including zero.
 */
export default function Intro({ data = {}, label }) {
  const {
    status = null,
    headlinePrefix = '',
    typedLines = [],
    body = '',
    stats = [],
    decorLines = 0,
  } = data;

  // The hook needs at least one line to type; fall back to a single blank.
  const typed = useTypewriter(typedLines.length ? typedLines : [''], {
    speed: 55,
    pause: 2000,
    loop: true,
  });

  const innerRef = useRevealOnView({ duration: 0.6 });

  return (
    <section id="intro" className={styles.Intro}>
      <div ref={innerRef} className={styles.inner}>
        {label && (
          <p className={styles.label}>
            <span className={styles.prompt}>&gt;</span> {label}
          </p>
        )}

        {status && (
          <div className={styles.statusRow}>
            <span className={styles.statusDot} />
            <span className={styles.statusText}>{status.text}</span>
          </div>
        )}

        {(headlinePrefix || typedLines.length > 0) && (
          <h2 className={styles.headline}>
            {headlinePrefix}
            {headlinePrefix && <br />}
            {typedLines.length > 0 && (
              <span className={styles.typed}>
                {typed}<span className={styles.cursor}>_</span>
              </span>
            )}
          </h2>
        )}

        {body && <p className={styles.body}>{body}</p>}

        {stats.length > 0 && (
          <div className={styles.meta}>
            {stats.map((stat, i) => (
              <Fragment key={stat.key ?? i}>
                {i > 0 && <div className={styles.metaDivider} />}
                <div className={styles.metaItem}>
                  <span className={styles.metaVal}>{stat.val}</span>
                  <span className={styles.metaKey}>{stat.key}</span>
                </div>
              </Fragment>
            ))}
          </div>
        )}
      </div>

      {decorLines > 0 && (
        <div className={styles.lineDecor} aria-hidden="true">
          {Array.from({ length: decorLines }).map((_, i) => (
            <span key={i} className={styles.line} style={{ '--i': i }} />
          ))}
        </div>
      )}
    </section>
  );
}
