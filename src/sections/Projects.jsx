import { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { FiArrowUpRight, FiPlay, FiPause, FiMaximize, FiChevronDown } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import Lenis from 'lenis';
import ScreenSlides from './../components/ScreenSlides';
import styles from './Projects.module.css';
import { PROJECTS } from '../data/data';

const TOTAL = PROJECTS.length;

function requestFullscreen(el) {
  if (el.requestFullscreen) return el.requestFullscreen();
  if (el.webkitRequestFullscreen) return el.webkitRequestFullscreen();
  if (el.webkitEnterFullscreen) return el.webkitEnterFullscreen();
}

/* ---- Scrollable, drag-inertia description (unchanged behavior) ---- */
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

  const [expanded, setExpanded] = useState(false);

  const canExpand = showScroll || expanded;

  return (
    <div className={`${styles.cardDescWrapper} ${expanded ? styles.cardDescExpanded : ''}`}>
      <p
        ref={ref}
        className={styles.cardDesc}
        onScroll={updateThumb}
        onWheel={e => e.stopPropagation()}
        onPointerDown={onTextPointerDown}
        style={{ cursor: 'grab' }}
      >
        {Array.isArray(text)
          ? text.map((para, i) => (
            <span key={i} style={{ display: 'block', marginBottom: i < text.length - 1 ? '0.75rem' : 0 }}>
              {para}
            </span>
          ))
          : text}
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

      {canExpand && (
        <button
          className={styles.descTab}
          onClick={() => setExpanded(v => !v)}
          onPointerDown={e => e.stopPropagation()}
          aria-expanded={expanded}
          aria-label={expanded ? 'Collapse description' : 'Expand description'}
        >
          <FiChevronDown
            className={`${styles.descTabIcon} ${expanded ? styles.descTabIconOpen : ''}`}
          />
        </button>
      )}
    </div>
  );
}

/* ---- Video preview panel (shared by desktop rows and mobile cards) ---- */
function Preview({ project, src }) {
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
      vid.play().catch(() => {});
      setIsPlaying(true);
    }
    requestFullscreen(vid);
  };

  return (
    <div className={styles.preview} onClick={togglePlay}>
      <img
        src={src}
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
          <div className={styles.videoControls}>
            <button
              className={styles.playBtn}
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
          </div>
        </>
      )}
    </div>
  );
}

/* ---- One project row (desktop) / card (mobile) ---- */
function ProjectRow({ project, index, rowRef, mobile }) {
  return (
    <article
      ref={rowRef}
      data-index={index}
      className={`${styles.row} ${mobile ? styles.rowMobile : ''}`}
    >
      <div className={styles.info}>
        <div className={styles.infoTop}>
          <span className={styles.num}>
            <span className={styles.cardNum}>{project.id}</span>
            <span className={styles.cardSlash}>/</span>
            <span className={styles.cardTotal}>{String(TOTAL).padStart(2, '0')}</span>
          </span>
          {project.link ? (
            <Link to={project.link} target="_blank" className={styles.demoBtn} onClick={e => e.stopPropagation()}>
              <span className={styles.demoBtnLabel}>DEMO</span>
              <FiArrowUpRight className={styles.demoBtnArrow} />
            </Link>
          ) : (
            <span className={styles.demoBtnDisabled}><span>SOON</span></span>
          )}
        </div>

        <h2 className={styles.name}>{project.name}</h2>
        <div className={styles.infoBody}>
          <CardDesc text={project.desc} />
          <div className={styles.slides}>
            <ScreenSlides screens={project.screens} />
          </div>

          <div className={styles.tags}>
            {project.tags.map(t => <span key={t} className={styles.tag}>{t}</span>)}
          </div>
        </div>
      </div>

      <Preview project={project} src={mobile ? project.mobileSrc : project.preview} />
    </article>
  );
}

/* ---- Top navigation strip: expandable, snaps to active project ---- */
const STRIP_EASE = 'power3.out';
const STRIP_DUR = 0.5;

function ProjectStrip({ activeIndex, onSelect }) {
  const stripRef = useRef(null);
  const itemRefs = useRef([]);
  const nameRefs = useRef([]);

  useEffect(() => {
    nameRefs.current.forEach((el, i) => {
      if (!el) return;
      const open = i === activeIndex;
      gsap.to(el, {
        width: open ? el.scrollWidth : 0,
        opacity: open ? 1 : 0,
        marginLeft: open ? 8 : 0,
        duration: STRIP_DUR,
        ease: STRIP_EASE,
        overwrite: 'auto',
      });
    });
  }, [activeIndex]);

  // Center the active pill in view.
  useEffect(() => {
    const strip = stripRef.current;
    const el = itemRefs.current[activeIndex];
    if (!strip || !el) return;
    const target = el.offsetLeft - strip.clientWidth / 2 + el.offsetWidth / 2;
    strip.scrollTo({ left: target, behavior: 'smooth' });
  }, [activeIndex]);

  return (
    <div ref={stripRef} className={styles.strip}>
      {PROJECTS.map((p, i) => (
        <button
          key={p.id}
          ref={el => (itemRefs.current[i] = el)}
          className={`${styles.stripItem} ${activeIndex === i ? styles.stripItemActive : ''}`}
          onClick={() => onSelect(i)}
        >
          <span className={styles.stripNum}>{p.id}</span>
          <span
            ref={el => (nameRefs.current[i] = el)}
            className={styles.stripName}
          >
            {p.name}
          </span>
        </button>
      ))}
    </div>
  );
}

/* ---- Desktop: vertical smooth-scroll list with active tracking ---- */
function VerticalProjects() {
  const scrollRef = useRef(null);
  const rowRefs = useRef([]);
  const lenisRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const scroller = scrollRef.current;
    if (!scroller) return;

    const pickActive = () => {
      const pr = scroller.getBoundingClientRect();
      const center = pr.top + pr.height / 2;
      let best = { idx: 0, dist: Infinity };
      rowRefs.current.forEach((el, idx) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        const dist = Math.abs((r.top + r.height / 2) - center);
        if (dist < best.dist) best = { idx, dist };
      });
      setActiveIndex(best.idx);
    };

    const lenis = new Lenis({
      wrapper: scroller,
      content: scroller.firstElementChild || scroller,
      smoothWheel: true,
      wheelMultiplier: 0.6,
      lerp: 0.1,
    });
    lenisRef.current = lenis;
    lenis.on('scroll', pickActive);

    const blockBubble = (e) => e.stopPropagation();
    scroller.addEventListener('wheel', blockBubble, { passive: true });

    let rafId;
    const raf = time => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    pickActive();

    return () => {
      cancelAnimationFrame(rafId);
      scroller.removeEventListener('wheel', blockBubble);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    rowRefs.current.forEach((el, idx) => {
      if (el) el.dataset.focused = idx === activeIndex ? 'true' : 'false';
    });
  }, [activeIndex]);

  const scrollToIndex = useCallback((idx) => {
    const scroller = scrollRef.current;
    const row = rowRefs.current[idx];
    const lenis = lenisRef.current;
    if (!scroller || !row) return;
    const scrollerRect = scroller.getBoundingClientRect();
    const rowRect = row.getBoundingClientRect();
    const current = lenis ? lenis.scroll : scroller.scrollTop;
    const delta =
      (rowRect.top + rowRect.height / 2) -
      (scrollerRect.top + scrollerRect.height / 2);
    const target = current + delta;
    if (lenis) lenis.scrollTo(target, { duration: 0.9 });
    else scroller.scrollTo({ top: target, behavior: 'smooth' });
  }, []);

  return (
    <section id="projects" className={styles.desktopSection}>
      <div className={styles.header}>
        <p className={styles.label}>
          <span className={styles.prompt}>&gt;</span> PROJECTS
        </p>
        <ProjectStrip activeIndex={activeIndex} onSelect={scrollToIndex} />
      </div>

      <div ref={scrollRef} className={styles.scroller}>
        <div className={styles.scrollContent}>
          {PROJECTS.map((p, i) => (
            <ProjectRow
              key={p.id}
              project={p}
              index={i}
              rowRef={el => (rowRefs.current[i] = el)}
            />
          ))}
        </div>
      </div>

      <div className={styles.fadeTop} aria-hidden="true" />
      <div className={styles.fadeBottom} aria-hidden="true" />
    </section>
  );
}

/* ---- Mobile: dropdown jump-nav to any project ---- */
function MobileProjectDropdown({ activeIndex, onSelect, open, setOpen }) {
  const wrapRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [open, setOpen]);

  const active = PROJECTS[activeIndex];

  return (
    <div ref={wrapRef} className={styles.mDrop}>
      <button
        className={styles.mDropTrigger}
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
      >
        <span className={styles.mDropNum}>{active.id}</span>
        <span className={styles.mDropName}>{active.name}</span>
        <FiChevronDown className={`${styles.mDropChevron} ${open ? styles.mDropChevronOpen : ''}`} />
      </button>

      {open && (
        <div className={styles.mDropMenu}>
          {PROJECTS.map((p, i) => (
            <button
              key={p.id}
              className={`${styles.mDropItem} ${i === activeIndex ? styles.mDropItemActive : ''}`}
              onClick={() => { onSelect(i); setOpen(false); }}
            >
              <span className={styles.mDropNum}>{p.id}</span>
              <span className={styles.mDropItemName}>{p.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function MobileProjects() {
  const rowRefs = useRef([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [scrimMounted, setScrimMounted] = useState(false);
  const [scrimClosing, setScrimClosing] = useState(false);
  const scrimTimer = useRef(null);
  useEffect(() => {
    clearTimeout(scrimTimer.current);
    if (dropdownOpen) {
      setScrimMounted(true);
      setScrimClosing(false);
    } else if (scrimMounted) {
      setScrimClosing(true);
      scrimTimer.current = setTimeout(() => {
        setScrimMounted(false);
        setScrimClosing(false);
      }, 200);
    }
    return () => clearTimeout(scrimTimer.current);
  }, [dropdownOpen, scrimMounted]);

  useEffect(() => {
    let raf = null;
    const pick = () => {
      raf = null;
      const centre = window.innerHeight / 2;
      let best = { idx: 0, dist: Infinity };
      rowRefs.current.forEach((el, idx) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        const dist = Math.abs((r.top + r.height / 2) - centre);
        if (dist < best.dist) best = { idx, dist };
      });
      setActiveIndex(best.idx);
    };
    const onScroll = () => { if (raf == null) raf = requestAnimationFrame(pick); };
    const scroller = rowRefs.current[0]?.closest('[class*="pane"]') || window;
    scroller.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true, capture: true });
    pick();
    return () => {
      scroller.removeEventListener('scroll', onScroll);
      window.removeEventListener('scroll', onScroll, { capture: true });
      if (raf != null) cancelAnimationFrame(raf);
    };
  }, []);

  const scrollToIndex = useCallback((idx) => {
    rowRefs.current[idx]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  return (
    <section id="projects" className={styles.projects}>
      {scrimMounted && (
        <div
          className={`${styles.mDropScrim} ${scrimClosing ? styles.mDropScrimOut : ''}`}
          aria-hidden="true"
        />
      )}

      <div className={styles.mobileHeader}>
        <p className={styles.label}>
          <span className={styles.prompt}>&gt;</span> PROJECTS
        </p>
      </div>

      <div className={styles.mDropRail}>
        <MobileProjectDropdown
          activeIndex={activeIndex}
          onSelect={scrollToIndex}
          open={dropdownOpen}
          setOpen={setDropdownOpen}
        />
      </div>
      <div className={styles.mobileList}>
        {PROJECTS.map((p, i) => (
          <ProjectRow
            key={p.id}
            project={p}
            index={i}
            rowRef={el => (rowRefs.current[i] = el)}
            mobile
          />
        ))}
      </div>
    </section>
  );
}

// -- Main ----
export default function Projects() {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 1024 : false
  );

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023px)');
    const update = () => setIsMobile(mq.matches);
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  return isMobile ? <MobileProjects /> : <VerticalProjects />;
}
