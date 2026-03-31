import { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { FiArrowUpRight, FiChevronDown, FiPlay, FiPause } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import ScreenSlides from './../components/ScreenSlides';
import styles from './Projects.module.css';

const PROJECTS = [
  {
    id: '01',
    name: 'Connect 4 Game',
    tags: ['React+Vite', 'Zustand', 'GSAP'],
    link: '/project/connect4',
    desc: 'A Connect 4 game with 5-level AI, animated disc drops, customizable board, and multiple game modes. A Connect 4 game with 5-level AI, animated disc drops, customizable board, and multiple game modes. ',
    screens: [
      '/project-connect4-thumb.jpg',
      '/project-rubiks-thumb.jpg',
      '/project-interior-thumb.jpg',
    ],
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
    screens: [
      '/project-connect4-thumb.jpg',
      '/project-rubiks-thumb.jpg',
      '/project-interior-thumb.jpg',
    ],
    preview: '/project-rubiks-thumb.jpg',
    mobileSrc: '/project-rubiks-thumb.jpg',
    videoSrc: '/previews/project-rubiks-preview.mp4',
  },
  {
    id: '03',
    name: 'Interior Design Studio Clone',
    tags: ['HTML', 'SCSS', 'JavaScript'],
    link: '/project/interior',
    desc: 'A front end demo website with custom scroll animations and responsive layout. A front end demo website with custom scroll animations and responsive layout. A front end demo website with custom scroll animations and responsive layout. A front end demo website with custom scroll animations and responsive layout.',
    screens: [
      '/project-connect4-thumb.jpg',
      '/project-rubiks-thumb.jpg',
      '/project-interior-thumb.jpg',
    ],
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
    screens: [
      '/project-connect4-thumb.jpg',
      '/project-rubiks-thumb.jpg',
      '/project-interior-thumb.jpg',
    ],
    preview: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&q=80',
    mobileSrc: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&q=80',
    videoSrc: null,
  },
];

const TOTAL = PROJECTS.length;
const GAP = 32;
const CARD_W = () => Math.min(window.innerWidth * 0.8, 1600);
const MAX_X = () => (TOTAL - 1) * (CARD_W() + GAP);

function CardDesc({ text }) {
  const ref = useRef(null);
  const thumbRef = useRef(null);
  const [showScroll, setShowScroll] = useState(false);
  const [thumbHeight, setThumbHeight] = useState(0);
  const [thumbTop, setThumbTop] = useState(0);
  const dragStart = useRef(null);
  const velocity = useRef(0);
  const lastY = useRef(0);
  const lastTime = useRef(0);
  const rafId = useRef(null);

  const updateThumb = () => {
    const el = ref.current;
    if (!el) return;
    const ratio = el.clientHeight / el.scrollHeight;
    setShowScroll(ratio < 1);
    setThumbHeight(ratio * el.clientHeight);
    setThumbTop((el.scrollTop / el.scrollHeight) * el.clientHeight);
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    updateThumb();
    const ro = new ResizeObserver(updateThumb);
    ro.observe(el);
    return () => ro.disconnect();
  }, [text]);

  // scrollbar thumb drag
  const onThumbPointerDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const startY = e.clientY;
    const startScrollTop = ref.current.scrollTop;

    const onMove = (e) => {
      e.stopPropagation();
      const el = ref.current;
      if (!el) return;
      const dy = e.clientY - startY;
      const scrollRatio = el.scrollHeight / el.clientHeight;
      el.scrollTop = startScrollTop + dy * scrollRatio;
    };

    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  const onTrackClick = (e) => {
    e.stopPropagation();
    const el = ref.current;
    const track = e.currentTarget;
    if (!el || !track) return;
    const rect = track.getBoundingClientRect();
    const clickY = e.clientY - rect.top;
    const ratio = clickY / track.clientHeight;
    el.scrollTo({ top: ratio * el.scrollHeight, behavior: 'smooth' });
  };

  // flick/inertia drag on the text itself
  const onTextPointerDown = (e) => {
    e.stopPropagation();
    const el = ref.current;
    if (!el) return;

    cancelAnimationFrame(rafId.current);
    velocity.current = 0;
    lastY.current = e.clientY;
    lastTime.current = performance.now();
    const startScrollTop = el.scrollTop;
    let moved = false;

    const onMove = (e) => {
      e.stopPropagation();
      const now = performance.now();
      const dt = now - lastTime.current;
      const dy = e.clientY - lastY.current;
      velocity.current = dy / (dt || 1);
      lastY.current = e.clientY;
      lastTime.current = now;
      el.scrollTop -= dy;
      moved = true;
    };

    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);

      if (!moved) return;

      // inertia
      const inertia = () => {
        velocity.current *= 0.92; // friction
        if (Math.abs(velocity.current) < 0.3) return;
        el.scrollTop -= velocity.current * 16;
        updateThumb();
        rafId.current = requestAnimationFrame(inertia);
      };
      rafId.current = requestAnimationFrame(inertia);
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  return (
    <div className={styles.cardDescWrapper}>
      <p
        ref={ref}
        className={styles.cardDesc}
        onScroll={updateThumb}
        onWheel={e => e.stopPropagation()}
        onPointerDown={onTextPointerDown}
        style={{ cursor: 'grab' }}
      >
        {text}
      </p>

      {showScroll && (
        <div
          className={styles.descScrollTrack}
          onClick={onTrackClick}
          onPointerDown={e => e.stopPropagation()}
        >
          <div
            ref={thumbRef}
            className={styles.descScrollThumb}
            style={{ height: thumbHeight, top: thumbTop }}
            onPointerDown={onThumbPointerDown}
          />
        </div>
      )}
    </div>
  );
}

// ── Desktop card ───────────────────────────────────────────────────────────────
function ProjectCard({ project, progress }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const opacity = useTransform(progress, [0, 0.5, 1], [0.25, 0.6, 1]);
  const scale = useTransform(progress, [0, 0.5, 1], [0.92, 0.96, 1]);

  const togglePlay = () => {
    const vid = videoRef.current;
    if (!vid) return;

    if (isPlaying) {
      vid.pause();
      setIsPlaying(false);
    } else {
      vid.play().catch(() => {
        // If play fails (e.g., autoplay blocked), keep isPlaying false
        setIsPlaying(false);
      });
      setIsPlaying(true);
    }
  };

  return (
    <motion.div className={styles.card} style={{ opacity, scale }}>
      {/* Info panel remains unchanged */}
      <div className={styles.cardInfo}>
        <div className={styles.cardTop}>
          <div className={styles.cardTopLeft}>
            <span className={styles.cardNum}>{project.id}</span>
            <span className={styles.cardSlash}>/</span>
            <span className={styles.cardTotal}>
              {String(PROJECTS.length).padStart(2, '0')}
            </span>
          </div>
          {project.link ? (
            <Link
              to={project.link}
              target="_blank"
              className={styles.cardDemoBtn}
              onClick={(e) => e.stopPropagation()}
            >
              <span className={styles.cardDemoBtnLabel}>DEMO</span>
              <FiArrowUpRight className={styles.cardDemoBtnArrow} />
            </Link>
          ) : (
            <span className={styles.cardDemoBtnDisabled}>
              <span>SOON</span>
            </span>
          )}
        </div>

        <div className={styles.cardMid}>
          <h2 className={styles.cardName}>{project.name}</h2>
          <CardDesc text={project.desc} />
          <ScreenSlides screens={project.screens} />
        </div>

        <div className={styles.cardBottom}>
          {project.tags.map((t) => (
            <span key={t} className={styles.tag}>
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Preview panel – now toggles video on click */}
      <div className={styles.cardPreview} onClick={togglePlay}>
        <img
          src={project.preview}
          alt={project.name}
          className={`${styles.cardImg} ${isPlaying ? styles.cardImgHidden : ''}`}
        />
        {project.videoSrc && (
          <>
            <video
              ref={videoRef}
              className={`${styles.cardVideo} ${isPlaying ? styles.cardVideoVisible : ''}`}
              src={project.videoSrc}
              muted
              loop
              playsInline
              preload="metadata"
            />
            <button
              className={isPlaying ? styles.stopBtn : styles.playBtn}
              onClick={(e) => {
                e.stopPropagation(); // prevent container click from toggling twice
                togglePlay();
              }}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <FiPause /> : <FiPlay />}
            </button>
          </>
        )}
      </div>
    </motion.div>
  );
}


// ── View-all dropdown ──────────────────────────────────────────────────────────
function ViewAllDropdown({ onSelect, activeIndex }) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className={styles.viewAll}>
      <button className={styles.viewAllBtn} onClick={() => setOpen(v => !v)}>
        <span>ALL PROJECTS</span>
        <span className={styles.viewAllCount}>{TOTAL}</span>
        <FiChevronDown
          className={`${styles.viewAllChevron} ${open ? styles.viewAllChevronOpen : ''}`}
        />
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

  const snapToIndex = idx => {
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

    const onWheel = e => {
      const maxX = MAX_X();
      const atStart = xRef.current <= 1 && e.deltaY < 0;
      const atEnd = xRef.current >= maxX - 1 && e.deltaY > 0;
      if (atStart || atEnd) return;
      e.preventDefault();
      e.stopPropagation();
      targetXRef.current = Math.max(0, Math.min(maxX, targetXRef.current + e.deltaY * 1.1));
    };

    const onPointerDown = e => {
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
          <span
            key={i}
            className={`${styles.dot} ${activeIndex === i ? styles.dotActive : ''}`}
            onClick={() => snapToIndex(i)}
            style={{ cursor: 'pointer' }}
          />
        ))}
      </div>
    </section>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────────
export default function Projects() {
  // Desktop scroller for ≥1024px, mobile carousel below.
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 1024 : false
  );
  const [carouselIndex, setCarouselIndex] = useState(0);
  const touchStartX = useRef(0);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023px)');
    const update = () => setIsMobile(mq.matches);
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const onTouchStart = e => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd = e => {
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
        <div
          className={styles.carousel}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div
            className={styles.carouselTrack}
            style={{ transform: `translateX(calc(${carouselIndex * -100}% - ${carouselIndex * 16}px))` }}
          >
            {PROJECTS.map((p, i) => (
              <MobileCard key={p.id} project={p} active={carouselIndex === i} />
            ))}
          </div>
          <div className={styles.dots}>
            <div className={styles.dots}>
              {PROJECTS.map((_, i) => (
                <span
                  key={i}
                  className={`${styles.dot} ${carouselIndex === i ? styles.dotActive : ''}`}
                  onClick={() => setCarouselIndex(i)}
                  style={{ cursor: 'pointer' }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}