import Button from '../../components/Button';
import { IoArrowForwardSharp } from 'react-icons/io5';
import styles from './LiteLanding.module.css';

export default function LiteLanding() {
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
        <h1 className={styles.headline}>
          <span className={styles.word}>SUMIT</span>
          <span className={styles.word}>HILLOL</span>
          <span className={styles.word}>DEY</span>
        </h1>

        <p className={styles.role}>Front-end web developer</p>

        <div className={styles.buttons}>
          <Button variant="fill" icon={IoArrowForwardSharp}>VIEW CV</Button>
          <Button variant="fill" onClick={viewProjects}>VIEW PROJECTS</Button>
        </div>
      </div>

      <span className={styles.index} aria-hidden="true">00</span>
    </div>
  );
}
