import LiteSection from './LiteSection';
import styles from './LiteIntro.module.css';

const STATS = [
  { val: '5+', key: 'years exp' },
  { val: '42', key: 'projects shipped' },
  { val: '∞', key: 'coffee consumed' },
];

export default function LiteIntro() {
  return (
    <LiteSection index={1} label="STATUS" className={styles.section}>
      <div className={styles.statusRow}>
        <span className={styles.statusDot} />
        <span className={styles.statusText}>Available for work</span>
      </div>

      <h2 className={styles.headline}>
        I'm a developer <span className={styles.accent}>building fast, interactive web experiences.</span>
      </h2>

      <p className={styles.body}>
        Five years building production React apps, interactive experiences,
        and the kind of interfaces people actually remember.
      </p>

      <div className={styles.meta}>
        {STATS.map((s, i) => (
          <div key={s.key} className={styles.metaGroup}>
            {i > 0 && <span className={styles.metaDivider} />}
            <div className={styles.metaItem}>
              <span className={styles.metaVal}>{s.val}</span>
              <span className={styles.metaKey}>{s.key}</span>
            </div>
          </div>
        ))}
      </div>
    </LiteSection>
  );
}
