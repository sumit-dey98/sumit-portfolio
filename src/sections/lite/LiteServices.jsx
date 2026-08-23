import LiteSection from './LiteSection';
import { SERVICES } from '../../data/data';
import styles from './LiteServices.module.css';

const TOTAL = SERVICES.length;

export default function LiteServices() {
  return (
    <LiteSection index={5} label="WHAT I OFFER" className={styles.section}>
      <div className={styles.grid}>
        {SERVICES.map((s) => (
          <article key={s.id} className={styles.card}>
            <div className={styles.top}>
              <span className={styles.num}>
                {s.id}<span className={styles.numTotal}>/{String(TOTAL).padStart(2, '0')}</span>
              </span>
            </div>

            <h3 className={styles.title}>{s.title}</h3>
            <p className={styles.desc}>{s.desc}</p>

            <div className={styles.tags}>
              {s.tags.map((t) => (
                <span key={t} className={styles.tag}>{t}</span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </LiteSection>
  );
}
