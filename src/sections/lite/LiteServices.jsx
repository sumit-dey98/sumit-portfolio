import LiteSection from './LiteSection';
import styles from './LiteServices.module.css';

/** Lite variant: 'cards'. Data shape matches src/data/sections/services.js. */
export default function LiteServices({ data = {}, label, index, total }) {
  const { items = [] } = data;
  const count = items.length;

  return (
    <LiteSection index={index} total={total} label={label} className={styles.section}>
      <div className={styles.grid}>
        {items.map((s, i) => (
          <article key={s.id ?? i} className={styles.card}>
            <div className={styles.top}>
              <span className={styles.num}>
                {s.id ?? String(i + 1).padStart(2, '0')}
                <span className={styles.numTotal}>/{String(count).padStart(2, '0')}</span>
              </span>
            </div>

            <h3 className={styles.title}>{s.title}</h3>
            <p className={styles.desc}>{s.desc}</p>

            {s.tags?.length > 0 && (
              <div className={styles.tags}>
                {s.tags.map((t) => (
                  <span key={t} className={styles.tag}>{t}</span>
                ))}
              </div>
            )}
          </article>
        ))}
      </div>
    </LiteSection>
  );
}
