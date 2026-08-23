import { useRef, useEffect, useState } from 'react';
import styles from './LiteSection.module.css';

export default function LiteSection({
  index,
  total = 6,
  label,
  title,
  headerRight = null,
  children,
  className = '',
}) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const scroller = node.closest('[data-lite-scroll]') || null;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { root: scroller, threshold: 0.18 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`${styles.frame} ${shown ? styles.shown : ''} ${className}`}
    >
      <div className={styles.head}>
        <p className={styles.eyebrow}>
          <span className={styles.prompt}>&gt;</span> {label}
        </p>
        <div className={styles.headRight}>
          {headerRight}
          <span className={styles.count}>
            <span className={styles.countNum}>{String(index).padStart(2, '0')}</span>
            <span className={styles.countSlash}>/</span>
            <span className={styles.countTotal}>{String(total).padStart(2, '0')}</span>
          </span>
        </div>
      </div>

      {title && <h2 className={styles.title}>{title}</h2>}

      <span className={styles.rule} aria-hidden="true" />

      <div className={styles.content}>{children}</div>
    </div>
  );
}
