import Button from '../../components/Button';
import { IoArrowForwardSharp } from 'react-icons/io5';
import styles from './LiteLanding.module.css';

/** Lite variant: 'hero'. Data shape matches src/data/sections/landing.js. */
export default function LiteLanding({ data = {} }) {
  const { nameLines = [], roles = [], actions = [] } = data;

  const viewProjects = () => {
    const scroller = document.querySelector('[data-lite-scroll]');
    const target = scroller?.querySelector('#lite-projects');
    if (scroller && target) {
      scroller.scrollTo({ top: target.offsetTop, behavior: 'smooth' });
    }
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.grid} aria-hidden="true" />

      <p className={styles.pre}>
        <span className={styles.prompt}>&gt;</span> WELCOME
      </p>

      <div className={styles.content}>
        {nameLines.length > 0 && (
          <h1 className={styles.headline}>
            {nameLines.map(word => (
              <span key={word} className={styles.word}>{word}</span>
            ))}
          </h1>
        )}

        {roles.length > 0 && <p className={styles.role}>{roles[0]}</p>}

        {actions.length > 0 && (
          <div className={styles.buttons}>
            {actions.map((action, i) => {
              const handler = action.action === 'projects' ? viewProjects : undefined;
              if (!action.href && !handler) return null;
              return (
                <Button
                  key={action.label || i}
                  variant="fill"
                  href={action.href || undefined}
                  onClick={handler}
                  icon={action.href ? IoArrowForwardSharp : undefined}
                >
                  {action.label}
                </Button>
              );
            })}
          </div>
        )}
      </div>

      <span className={styles.index} aria-hidden="true">00</span>
    </div>
  );
}
