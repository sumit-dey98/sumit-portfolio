import { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { FiArrowUpRight, FiChevronDown } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import styles from './Projects.module.css';

const PROJECTS = [
  {
    id: '01',
    name: 'Connect 4 Game',
    tags: ['React+Vite', 'Zustand', 'GSAP'],
    link: '/project/connect4',
    desc: 'A Connect 4 game with 5-level AI, animated disc drops, customizable board, and multiple game modes.',
    descAlt: 'Built with a minimax algorithm with alpha-beta pruning for the AI. Supports local multiplayer, AI vs AI, and timed modes with full animation sequencing via GSAP.',
    preview: '/project-connect4-thumb.jpg',
    mobileSrc: '/project-connect4-thumb.jpg',
    videoSrc: '/previews/project-connect4-preview.mp4',
  },
  {
    id: '02',
    name: "Rubik's Cube",
    tags: ['React+Vite', 'Three.js', 'Tailwind'],
    link: '/project/rubiks-cube',
    desc: "A 3D Rubik's Cube with realistic and customizable visuals and interactions, created with React and Three.js.",
    descAlt: "Full cube state management with quaternion-based rotation, scramble generator, and solve timer. Supports keyboard, mouse drag, and touch controls.",
    preview: '/project-rubiks-thumb.jpg',
    mobileSrc: '/project-rubiks-thumb.jpg',
    videoSrc: '/previews/project-rubiks-preview.mp4',
  },
  {
    id: '03',
    name: 'Interior Design Studio Clone',
    tags: ['HTML', 'SCSS', 'JavaScript'],
    link: '/project/interior',
    desc: 'A front end demo website with custom scroll animations and responsive layout.',
    descAlt: 'Parallax sections, staggered text reveals, and a custom cursor built from scratch without any animation library. Fully responsive down to 320px.',
    preview: '/project-interior-thumb.jpg',
    mobileSrc: '/project-interior-thumb.jpg',
    videoSrc: '/previews/project-interior-preview.mp4',
  },
  {
    id: '04',
    name: 'Motion Design System',
    tags: ['Framer Motion', 'Storybook', 'React'],
    link: null,
    desc: 'A comprehensive animation library with 60+ primitives, used across 3 production products.',
    descAlt: 'Includes spring configs, stagger utilities, scroll-linked variants, and a Storybook playground. Reduced animation-related bug reports by 40%.',
    preview: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&q=80',
    mobileSrc: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&q=80',
    videoSrc: null,
  },
];

const TOTAL = PROJECTS.length;
const GAP = 32;
const CARD_W = () => Math.min(window.innerWidth * 0.8, 1600);
const MAX_X = () => (TOTAL - 1) * (CARD_W() + GAP);

// ── Dual-panel description ─────────────────────────────────────────────────────
function DescPanel({ desc, descAlt }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className={styles.descWrapper}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
    >
      <div className={`${styles.descInner} ${flipped ? styles.descFlipped : ''}`}>
        <p className={styles.cardDesc}>{desc}</p>
        <p className={`${styles.cardDesc} ${styles.cardDescAlt}`}>{descAlt}</p>
      </div>
      {/* dot indicator */}
      <div className={styles.descDots}>
        <span className={`${styles.descDot} ${!flipped ? styles.descDotActive : ''}`} />
        <span className={`${styles.descDot} ${flipped ? styles.descDotActive : ''}`} />
      </div>
    </div>
  );
}

// ── Desktop card ───────────────────────────────────────────────────────────────
function ProjectCard({ project, progress }) {
  const [hovered, setHovered] = useState(false);
  const videoRef = useRef(null);

  const opacity = useTransform(progress, [0, 0.5, 1], [0.25, 0.6, 1]);
  const scale = useTransform(progress, [0, 0.5, 1], [0.92, 0.96, 1]);

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    if (hovered) { vid.currentTime = 0; vid.play().catch(() => { }); }
    else { vid.pause(); vid.currentTime = 0; }
  }, [hovered]);

  return (
    <motion.div
      className={styles.card}
      style={{ opacity, scale }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* ── Info panel (30%) ── */}
      <div className={styles.cardInfo}>
        <div className={styles.cardTop}>
          <div className={styles.cardTopLeft}>
            <span className={styles.cardNum}>{project.id}</span>
            <span className={styles.cardSlash}>/</span>
            <span className={styles.cardTotal}>{String(TOTAL).padStart(2, '0')}</span>
          </div>
          {project.link ? (
            <Link to={project.link} target="_blank" className={styles.cardDemoBtn} onClick={e => e.stopPropagation()}>
              <span className={styles.cardDemoBtnLabel}>DEMO</span>
              <FiArrowUpRight className={styles.cardDemoBtnArrow} />
            </Link>
          ) : (
            <span className={styles.cardDemoBtnDisabled}><span>SOON</span></span>
          )}
        </div>

        <div className={styles.cardMid}>
          <h2 className={styles.cardName}>{project.name}</h2>
          <DescPanel desc={project.desc} descAlt={project.descAlt} />
        </div>

        <div className={styles.cardBottom}>
          {project.tags.map(t => <span key={t} className={styles.tag}>{t}</span>)}
        </div>
      </div>

      {/* ── Preview panel (70%) ── */}
      <div className={styles.cardPreview}>
        <img
          src={project.preview}
          alt={project.name}
          className={`${styles.cardImg} ${hovered && project.videoSrc ? styles.cardImgHidden : ''}`}
        />
        {project.videoSrc && (
          <video
            ref={videoRef}
            className={`${styles.cardVideo} ${hovered ? styles.cardVideoVisible : ''}`}
            src={project.videoSrc}
            muted loop playsInline
          />
        )}
      </div>
    </motion.div>
  );
}

// ── View-all dropdown ──────────────────────────────────────────────────────────
function ViewAllDropdown({ onSelect, activeIndex }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.viewAll}>
      <button
        className={styles.viewAllBtn}
        onClick={() => setOpen(v => !v)}
      >
        <span>ALL PROJECTS</span>
        <span className={styles.viewAllCount}>{TOTAL}</span>
        <FiChevronDown className={`${styles.viewAllChevron} ${open ? styles.viewAllChevronOpen : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className={styles.dropdown}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 24 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            {PROJECTS.map((p, i) => (
              <button
                key={p.id}
                className={`${styles.dropdownItem} ${activeIndex === i ? styles.dropdownItemActive : ''}`}
                onClick={() => { onSelect(i); setOpen(false); }}
              >
                <span className={styles.dropdownNum}>{p.id}</span>
                <span className={styles.dropdownName}>{p.name}</span>
                <FiArrowUpRight className={styles.dropdownArrow} />
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Mobile carousel card ───────────────────────────────────────────────────────
function MobileCard({ project, active }) {
  return (
    <div className={`${styles.mobileCard} ${active ? styles.mobileCardActive : ''}`}>
      <div className={styles.cardPreview}>
        <img src={project.mobileSrc} alt={project.name} className={styles.cardImg} />
      </div>
      <div className={styles.cardInfo}>
        <div className={styles.cardTop}>
          <div className={styles.cardTopLeft}>
            <span className={styles.cardNum}>{project.id}</span>
            <span className={styles.cardSlash}>/</span>
            <span className={styles.cardTotal}>{String(TOTAL).padStart(2, '0')}</span>
          </div>
          {project.link ? (
            <Link to={project.link} target="_blank" className={styles.cardDemoBtn}>
              <span className={styles.cardDemoBtnLabel}>DEMO</span>
              <FiArrowUpRight className={styles.cardDemoBtnArrow} />
            </Link>
          ) : (
            <span className={styles.cardDemoBtnDisabled}><span>SOON</span></span>
          )}
        </div>
        <div className={styles.cardMid}>
          <h2 className={styles.cardName}>{project.name}</h2>
          <p className={styles.cardDesc}>{project.desc}</p>
        </div>
        <div className={styles.cardBottom}>
          {project.tags.map(t => <span key={t} className={styles.tag}>{t}</span>)}
        </div>
      </div>
    </div>
  );
}

// ── Desktop scroller ───────────────────────────────────────────────────────────
function DesktopScroller() {
  const sectionRef = useRef(null);
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const progressValues = useRef(PROJECTS.map(() => useMotionValue(0)));
  const [activeIndex, setActiveIndex] = useState(0);

  const xRef = useRef(0);
  const targetXRef = useRef(0);

  const updateVisuals = (x) => {
    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(${-x}px)`;
    }
    const cw = CARD_W();
    const paddingLeft = window.innerWidth / 2 - cw / 2;
    PROJECTS.forEach((_, i) => {
      const cardCenter = paddingLeft + i * (cw + GAP) + cw / 2;
      const viewCenter = x + window.innerWidth / 2;
      const dist = Math.abs(cardCenter - viewCenter);
      const p = Math.max(0, 1 - dist / (cw + GAP));
      progressValues.current[i].set(p);
    });
    setActiveIndex(Math.max(0, Math.min(TOTAL - 1, Math.round(x / (cw + GAP)))));
  };

  const snapToIndex = (idx) => {
    targetXRef.current = Math.max(0, Math.min(MAX_X(), idx * (CARD_W() + GAP)));
  };

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    let rafId;
    const tick = () => {
      const dx = targetXRef.current - xRef.current;
      if (Math.abs(dx) > 0.1) {
        xRef.current += dx * 0.1;
        updateVisuals(xRef.current);
      }
      const step = CARD_W() + GAP;
      const nearest = Math.round(targetXRef.current / step) * step;
      targetXRef.current += (nearest - targetXRef.current) * 0.02;
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    const onWheel = (e) => {
      const maxX = MAX_X();
      const atStart = xRef.current <= 1 && e.deltaY < 0;
      const atEnd = xRef.current >= maxX - 1 && e.deltaY > 0;
      if (atStart || atEnd) return;
      e.preventDefault();
      e.stopPropagation();
      targetXRef.current = Math.max(0, Math.min(maxX, targetXRef.current + e.deltaY * 1.1));
    };

    const onPointerDown = (e) => {
      if (e.target.closest('a, button')) return;
      e.preventDefault();
    };

    viewport.addEventListener('wheel', onWheel, { passive: false });
    viewport.addEventListener('pointerdown', onPointerDown, { passive: false });
    updateVisuals(0);

    return () => {
      cancelAnimationFrame(rafId);
      viewport.removeEventListener('wheel', onWheel);
      viewport.removeEventListener('pointerdown', onPointerDown);
    };
  }, []);

  return (
    <section ref={sectionRef} id="projects" className={styles.desktopSection}>
      <div className={styles.header}>
        <p className={styles.label}>
          <span className={styles.prompt}>&gt;</span> PROJECTS
        </p>
        <ViewAllDropdown onSelect={snapToIndex} activeIndex={activeIndex} />
      </div>

      <div ref={viewportRef} className={styles.scrollViewport}>
        <div ref={trackRef} className={styles.scrollTrack}>
          {PROJECTS.map((p, i) => (
            <ProjectCard key={p.id} project={p} progress={progressValues.current[i]} />
          ))}
        </div>
      </div>

      <div className={styles.dots}>
        {PROJECTS.map((_, i) => (
          <span key={i} className={`${styles.dot} ${activeIndex === i ? styles.dotActive : ''}`} />
        ))}
      </div>
    </section>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function Projects() {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth <= 768 : false
  );
  const [carouselIndex, setCarouselIndex] = useState(0);
  const touchStartX = useRef(0);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const update = () => setIsMobile(mq.matches);
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    const dx = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(dx) < 40) return;
    if (dx > 0) setCarouselIndex(i => Math.min(i + 1, TOTAL - 1));
    else setCarouselIndex(i => Math.max(i - 1, 0));
  };

  if (!isMobile) return <DesktopScroller />;

  return (
    <section id="projects" className={styles.projects}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <p className={styles.label}>
            <span className={styles.prompt}>&gt;</span> PROJECTS
          </p>
          <span className={styles.count}>{TOTAL} works</span>
        </div>
        <div className={styles.carousel} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
          <div
            className={styles.carouselTrack}
            style={{ transform: `translateX(calc(${carouselIndex * -100}% - ${carouselIndex * 16}px))` }}
          >
            {PROJECTS.map((p, i) => (
              <MobileCard key={p.id} project={p} active={carouselIndex === i} />
            ))}
          </div>
          <div className={styles.dots}>
            {PROJECTS.map((_, i) => (
              <span key={i} className={`${styles.dot} ${carouselIndex === i ? styles.dotActive : ''}`} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}