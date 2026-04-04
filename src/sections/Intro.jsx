import { useRevealOnView } from '../hooks/useRevealOnView';
import { useTypewriter } from '../hooks/useTypewriter';
import styles from './Intro.module.css';

const LINES = [
  'building fast, interactive web experiences.',
  'turning ideas into polished interfaces.',
  'obsessing over the details that matter.',
];

export default function Intro() {
  const typed = useTypewriter(LINES, { speed: 55, pause: 2000, loop: true });

  const innerRef = useRevealOnView({ duration: 0.6 });

  return (
    <section id="intro" className={styles.Intro}>
      <div ref={innerRef} className={styles.inner}>
        <p className={styles.label}>
          <span className={styles.prompt}>&gt;</span> STATUS
        </p>

        <div className={styles.statusRow}>
          <span className={styles.statusDot} />
          <span className={styles.statusText}>Available for work</span>
        </div>

        <h2 className={styles.headline}>
          I'm a developer<br />
          <span className={styles.typed}>{typed}<span className={styles.cursor}>_</span></span>
        </h2>

        <p className={styles.body}>
          Five years building production React apps, interactive experiences,<br />
          and the kind of interfaces people actually remember.
        </p>

        <div className={styles.meta}>
          <div className={styles.metaItem}>
            <span className={styles.metaVal}>5+</span>
            <span className={styles.metaKey}>years exp</span>
          </div>
          <div className={styles.metaDivider} />
          <div className={styles.metaItem}>
            <span className={styles.metaVal}>42</span>
            <span className={styles.metaKey}>projects shipped</span>
          </div>
          <div className={styles.metaDivider} />
          <div className={styles.metaItem}>
            <span className={styles.metaVal}>∞</span>
            <span className={styles.metaKey}>coffee consumed</span>
          </div>
        </div>
      </div>

      <div className={styles.lineDecor} aria-hidden="true">
        {Array.from({ length: 12 }).map((_, i) => (
          <span key={i} className={styles.line} style={{ '--i': i }} />
        ))}
      </div>
    </section >
  );
}