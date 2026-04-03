import { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { FiArrowUpRight, FiChevronDown, FiPlay, FiPause, FiMaximize } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import ScreenSlides from './../components/ScreenSlides';
import styles from './Projects.module.css';
import { PROJECTS } from '../data/data';

const TOTAL = PROJECTS.length;
const GAP = 32;
const CARD_W = () => Math.min(window.innerWidth * 0.8, 1600);
const MAX_X = () => (TOTAL - 1) * (CARD_W() + GAP);

function requestFullscreen(el) {
  if (el.requestFullscreen) return el.requestFullscreen();
  if (el.webkitRequestFullscreen) return el.webkitRequestFullscreen();
  if (el.webkitEnterFullscreen) return el.webkitEnterFullscreen();
}

function CardDesc({ text }) {
  const ref = useRef(null);
  const thumbRef = useRef(null);
  const [showScroll, setShowScroll] = useState(false);
  const [thumbHeight, setThumbHeight] = useState(0);
  const [thumbTop, setThumbTop] = useState(0);
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
      el.scrollTop = startScrollTop + dy * (el.scrollHeight / el.clientHeight);
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
    const ratio = (e.clientY - rect.top) / track.clientHeight;
    el.scrollTo({ top: ratio * el.scrollHeight, behavior: 'smooth' });
  };

  const onTextPointerDown = (e) => {
    e.stopPropagation();
    const el = ref.current;
    if (!el) return;
    cancelAnimationFrame(rafId.current);
    velocity.current = 0;
    lastY.current = e.clientY;
    lastTime.current = performance.now();
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
      const inertia = () => {
        velocity.current *= 0.92;
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

function ProjectCard({ project, cardRef }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    const vid = videoRef.current;
    if (!vid) return;
    if (isPlaying) {
      vid.pause();
      setIsPlaying(false);
    } else {
      vid.play().catch(() => setIsPlaying(false));
      setIsPlaying(true);
    }
  };

  const handleFullscreen = (e) => {
    e.stopPropagation();
    const vid = videoRef.current;
    if (!vid) return;
    if (!isPlaying) {
      vid.play().catch(() => { });
      setIsPlaying(true);
    }
    requestFullscreen(vid);
  };

  return (
    <div ref={cardRef} className={styles.card} style={{ opacity: 0.25, scale: 0.92 }}>
      <div className={styles.cardInfo}>
        <div className={styles.cardTop}>
          <div className={styles.cardTopLeft}>
            <span className={styles.cardNum}>{project.id}</span>
            <span className={styles.cardSlash}>/</span>
            <span className={styles.cardTotal}>{String(PROJECTS.length).padStart(2, '0')}</span>
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
          <CardDesc text={project.desc} />
          <ScreenSlides screens={project.screens} />
        </div>

        <div className={styles.cardBottom}>
          {project.tags.map(t => <span key={t} className={styles.tag}>{t}</span>)}
        </div>
      </div>

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
              onClick={e => { e.stopPropagation(); togglePlay(); }}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <FiPause /> : <FiPlay />}
            </button>
            <button
              className={styles.fullscreenBtn}
              onClick={handleFullscreen}
              aria-label="Fullscreen"
            >
              <FiMaximize />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function ViewAllDropdown({ onSelect, activeIndex }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef(null);
  const tweenRef = useRef(null);
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

  useEffect(() => {
    if (open) {
      setMounted(true);
    } else {
      if (!dropdownRef.current) return;
      tweenRef.current?.kill();
      tweenRef.current = gsap.to(dropdownRef.current, {
        opacity: 0,
        x: 24,
        duration: 0.22,
        ease: 'power2.in',
        onComplete: () => setMounted(false),
      });
    }
  }, [open]);

  const dropdownAnimRef = useCallback((node) => {
    dropdownRef.current = node;
    if (!node) return;
    tweenRef.current?.kill();
    tweenRef.current = gsap.fromTo(node,
      { opacity: 0, x: 24 },
      { opacity: 1, x: 0, duration: 0.22, ease: 'power2.out' }
    );
  }, []);

  return (
    <div ref={wrapperRef} className={styles.viewAll}>
      <button className={styles.viewAllBtn} onClick={() => setOpen(v => !v)}>
        <span>ALL PROJECTS</span>
        <span className={styles.viewAllCount}>{TOTAL}</span>
        <FiChevronDown className={`${styles.viewAllChevron} ${open ? styles.viewAllChevronOpen : ''}`} />
      </button>

      {mounted && (
        <div ref={dropdownAnimRef} className={styles.dropdown}>
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
        </div>
      )}
    </div>
  );
}

function MobileCard({ project }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    const vid = videoRef.current;
    if (!vid) return;
    if (isPlaying) {
      vid.pause();
      setIsPlaying(false);
    } else {
      vid.play().catch(() => setIsPlaying(false));
      setIsPlaying(true);
    }
  };

  const handleFullscreen = (e) => {
    e.stopPropagation();
    const vid = videoRef.current;
    if (!vid) return;
    if (!isPlaying) {
      vid.play().catch(() => { });
      setIsPlaying(true);
    }
    requestFullscreen(vid);
  };

  return (
    <div className={styles.mobileCard}>
      <div className={styles.mobilePreview}>
        <img
          src={project.mobileSrc}
          alt={project.name}
          className={`${styles.cardImg} ${isPlaying ? styles.cardImgHidden : ''}`}
        />
        {project.videoSrc && (
          <video
            ref={videoRef}
            className={`${styles.cardVideo} ${isPlaying ? styles.cardVideoVisible : ''}`}
            src={project.videoSrc}
            muted
            loop
            playsInline
            preload="metadata"
          />
        )}

        {project.link && (
          <Link to={project.link} target="_blank" className={styles.mobileDemoBtn} onClick={e => e.stopPropagation()}>
            <span>DEMO</span>
            <FiArrowUpRight size={13} />
          </Link>
        )}

        {project.videoSrc && (
          <div className={styles.mobileVideoControls}>
            <button
              className={styles.mobilePlayBtn}
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <FiPause size={13} /> : <FiPlay size={13} />}
            </button>
            <button
              className={styles.mobileFullscreenBtn}
              onClick={handleFullscreen}
              aria-label="Fullscreen"
            >
              <FiMaximize size={13} />
            </button>
          </div>
        )}
      </div>

      <div className={styles.mobileInfo}>
        <div className={styles.mobileTopRow}>
          <span className={styles.cardNum}>{project.id}</span>
          <span className={styles.cardSlash}>/</span>
          <span className={styles.cardTotal}>{String(TOTAL).padStart(2, '0')}</span>
        </div>
        <h2 className={styles.mobileName}>{project.name}</h2>
        <CardDesc text={project.desc} />
        <ScreenSlides screens={project.screens} />
        <div className={styles.cardBottom}>
          {project.tags.map(t => <span key={t} className={styles.tag}>{t}</span>)}
        </div>
      </div>
    </div>
  );
}

// ── DesktopScroller — GSAP replaces useMotionValue per card ──────────────
function DesktopScroller() {
  const sectionRef = useRef(null);
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const cardRefs = useRef([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const xRef = useRef(0);
  const targetXRef = useRef(0);

  const updateVisuals = useCallback((x) => {
    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(${-x}px)`;
    }
    const cw = CARD_W();
    const paddingLeft = window.innerWidth / 2 - cw / 2;

    PROJECTS.forEach((_, i) => {
      const card = cardRefs.current[i];
      if (!card) return;
      const cardCenter = paddingLeft + i * (cw + GAP) + cw / 2;
      const viewCenter = x + window.innerWidth / 2;
      const dist = Math.abs(cardCenter - viewCenter);
      const p = Math.max(0, 1 - dist / (cw + GAP));

      // replaces useTransform([0,0.5,1] → opacity [0.25,0.6,1], scale [0.92,0.96,1])
      const opacity = p < 0.5
        ? 0.25 + (p / 0.5) * 0.35
        : 0.6 + ((p - 0.5) / 0.5) * 0.4;
      const scale = p < 0.5
        ? 0.92 + (p / 0.5) * 0.04
        : 0.96 + ((p - 0.5) / 0.5) * 0.04;

      gsap.set(card, { opacity, scale });
    });

    setActiveIndex(Math.max(0, Math.min(TOTAL - 1, Math.round(x / (CARD_W() + GAP)))));
  }, []);

  const snapToIndex = useCallback(idx => {
    targetXRef.current = Math.max(0, Math.min(MAX_X(), idx * (CARD_W() + GAP)));
  }, []);

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
  }, [updateVisuals]);

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
            <ProjectCard
              key={p.id}
              project={p}
              cardRef={el => cardRefs.current[i] = el}
            />
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

// ── Main ──────────────────────────────────────────────────────────────────
export default function Projects() {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 1024 : false
  );
  const touchStartX = useRef(0);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023px)');
    const update = () => setIsMobile(mq.matches);
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  if (!isMobile) return <DesktopScroller />;

  return (
    <section id="projects" className={styles.projects}>
      <div className={styles.mobileHeader}>
        <p className={styles.label}>
          <span className={styles.prompt}>&gt;</span> PROJECTS
        </p>
        <span className={styles.count}>{TOTAL} works</span>
      </div>
      <div className={styles.mobileList}>
        {PROJECTS.map(p => <MobileCard key={p.id} project={p} />)}
      </div>
    </section>
  );
}