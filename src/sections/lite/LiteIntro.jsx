import LiteSection from './LiteSection';
import styles from './LiteIntro.module.css';

/** Lite variant: 'status'. Data shape matches src/data/sections/intro.js. */
export default function LiteIntro({ data = {}, label, index, total }) {
  const {
    status = null,
    headlinePrefix = '',
    typedLines = [],
    body = '',
    stats = [],
  } = data;

  return (
    <LiteSection index={index} total={total} label={label} className={styles.section}>
      {status && (
        <div className={styles.statusRow}>
          <span className={styles.statusDot} />
          <span className={styles.statusText}>{status.text}</span>
        </div>
      )}

      {(headlinePrefix || typedLines.length > 0) && (
        <h2 className={styles.headline}>
          {headlinePrefix}
          {headlinePrefix && typedLines.length > 0 && ' '}
          {typedLines.length > 0 && (
            <span className={styles.accent}>{typedLines[0]}</span>
          )}
        </h2>
      )}

      {body && <p className={styles.body}>{body}</p>}

      {stats.length > 0 && (
        <div className={styles.meta}>
          {stats.map((s, i) => (
            <div key={s.key ?? i} className={styles.metaGroup}>
              {i > 0 && <span className={styles.metaDivider} />}
              <div className={styles.metaItem}>
                <span className={styles.metaVal}>{s.val}</span>
                <span className={styles.metaKey}>{s.key}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </LiteSection>
  );
}
