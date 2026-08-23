import { useState } from 'react';
import { FiArrowUpRight, FiList, FiGrid } from 'react-icons/fi';
import LiteSection from './LiteSection';
import LiteProjectModal from './LiteProjectModal';
import { PROJECTS } from '../../data/data';
import styles from './LiteProjects.module.css';

const TOTAL = PROJECTS.length;

function ViewToggle({ view, setView }) {
  return (
    <div className={styles.viewToggle} role="group" aria-label="Project view">
      <button
        className={`${styles.viewToggleBtn} ${view === 'list' ? styles.viewToggleOn : ''}`}
        onClick={() => setView('list')}
        aria-pressed={view === 'list'}
        aria-label="List view"
        title="List view"
      >
        <FiList size={15} />
      </button>
      <button
        className={`${styles.viewToggleBtn} ${view === 'grid' ? styles.viewToggleOn : ''}`}
        onClick={() => setView('grid')}
        aria-pressed={view === 'grid'}
        aria-label="Grid view"
        title="Grid view"
      >
        <FiGrid size={15} />
      </button>
    </div>
  );
}

function ProjectCard({ p, onOpen }) {
  return (
    <div
      className={styles.card}
      onClick={() => onOpen(p)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onOpen(p))}
    >
      <div className={styles.thumb}>
        <img src={p.preview} alt={p.name} loading="lazy" />
      </div>

      <div className={styles.main}>
        <div className={styles.titleRow}>
          <span className={styles.num}>{p.id}</span>
          <h3 className={styles.name}>{p.name}</h3>
        </div>
        <div className={styles.tags}>
          {p.tags.map((t) => (
            <span key={t} className={styles.tag}>{t}</span>
          ))}
        </div>
      </div>

      <div className={styles.actions} onClick={(e) => e.stopPropagation()}>
        {p.link ? (
          <a className={styles.demoBtn} href={p.link} target="_blank" rel="noopener noreferrer">
            <span className={styles.demoBtnLabel}>LIVE LINK</span>
            <FiArrowUpRight className={styles.demoBtnArrow} />
          </a>
        ) : (
          <span className={styles.demoBtnDisabled}>SOON</span>
        )}
        <button className={styles.viewBtn} onClick={() => onOpen(p)}>
          VIEW PROJECT
        </button>
      </div>
    </div>
  );
}

export default function LiteProjects() {
  const [active, setActive] = useState(null); // project object or null
  const [view, setView] = useState(() => {
    try { return localStorage.getItem('lite-projects-view') || 'list'; }
    catch { return 'list'; }
  });

  const changeView = (v) => {
    setView(v);
    try { localStorage.setItem('lite-projects-view', v); } catch { /* ignore */ }
  };

  return (
    <LiteSection
      index={3}
      label="PROJECTS"
      className={styles.section}
      headerRight={<ViewToggle view={view} setView={changeView} />}
    >
      <div className={`${styles.collection} ${view === 'grid' ? styles.grid : styles.list}`}>
        {PROJECTS.map((p) => (
          <ProjectCard key={p.id} p={p} onOpen={setActive} />
        ))}
      </div>

      {active && (
        <LiteProjectModal
          project={active}
          total={TOTAL}
          onClose={() => setActive(null)}
        />
      )}
    </LiteSection>
  );
}
