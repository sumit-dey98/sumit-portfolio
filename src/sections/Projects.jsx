import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/Button';
import { FaGithub } from "react-icons/fa6";
import styles from './Projects.module.css';

const PROJECTS = [
  {
    id: '01',
    name: 'Connect 4 Game',
    tags: ['React', 'Vite', 'Zustand', 'GSAP'],
    link: '/project/connect4',
    desc: 'A Connect 4 game with 5-level AI, animated disc drops, customizable board, and multiple game modes.',
    preview: '/project-connect4-thumb.webp',
  },
  {
    id: '02',
    name: 'Distributed Compiler',
    tags: ['Rust', 'WASM', 'Workers'],
    link: '2024',
    desc: 'A WASM-based multi-threaded compiler running entirely in the browser with zero server round-trips.',
    preview: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80',
  },
  {
    id: '03',
    name: 'Generative Canvas',
    tags: ['Canvas API', 'TypeScript', 'GSAP'],
    link: '2023',
    desc: 'Procedural art system with 40+ algorithmic brushes, real-time rendering, and SVG/PNG export.',
    preview: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
  },
  {
    id: '04',
    name: 'Motion Design System',
    tags: ['Framer Motion', 'Storybook', 'React'],
    link: '2023',
    desc: 'A comprehensive animation library with 60+ primitives, used across 3 production products.',
    preview: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&q=80',
  },
];

export default function Projects() {
  const [hovered, setHovered] = useState(null);
  const active = PROJECTS.find(p => p.id === hovered);

  const GitRepoBtn = ({iconPosition = 'left', size = 16}) => (
    <Button variant='fill' href={'https://github.com/sumit-dey98/sumit-dey98.github.io'} icon={FaGithub} iconPosition={iconPosition} iconSize={size}>
      VISIT GIT REPO
    </Button>
  );

  return (
    <section id="projects" className={styles.projects}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <p className={styles.label}>
            <span className={styles.prompt}>&gt;</span> PROJECTS
          </p>
          <span className={styles.count}>{PROJECTS.length} works</span>
        </div>

        <div className={styles.layout}>
          <ul className={styles.list}>
            {PROJECTS.map((p, i) => (
              <motion.li
                key={p.id}
                className={`${styles.item} ${hovered === p.id ? styles.itemActive : ''}`}
                onMouseEnter={() => setHovered(p.id)}
                onMouseLeave={() => setHovered(null)}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
              >
                <span className={styles.itemNum}>{p.id}</span>
                <div className={styles.itemBody}>
                  <span className={styles.itemName}>{p.name}</span>
                  <div className={styles.itemTags}>
                    {p.tags.map(t => <span key={t} className={styles.tag}>{t}</span>)}
                  </div>
                </div>
                <a href={p.link} target='blank' className={styles.itemLink}>DEMO</a>
                <span className={styles.itemArrow}>→</span>
              </motion.li>
            ))}
          </ul>

          <div className={styles.preview}>
            <AnimatePresence mode="wait">
              {active ? (
                <motion.div
                  key={active.id}
                  className={styles.previewCard}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className={styles.previewImg}>
                    <img src={active.preview} alt={active.name} />
                    <div
                      className={styles.previewOverlay}
                    />
                  </div>
                  <div className={styles.previewInfo}>
                    <h3 className={styles.previewName}
                    >
                      {active.name}
                    </h3>
                    <p className={styles.previewDesc}>{active.desc}</p>
                  </div>
                </motion.div>
              ) : (
                <>
                  <motion.div
                    key="empty"
                    className={styles.previewEmpty}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    
                    <span className={styles.previewHint}>hover a project</span>
                  </motion.div>

                </>
              )}
            </AnimatePresence>
          </div>
          <GitRepoBtn iconPosition='left' size={20} />
        </div>
      </div>
    </section>
  );
}