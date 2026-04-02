import { useRef, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { useInView } from 'react-intersection-observer';
import { IoClose, IoRemove } from 'react-icons/io5';
import ExpandIcon from '../assets/ExpandIcon';
import styles from './Terminal.module.css';

const MOBILE_BREAKPOINT = 1023;

// ── SkillItem ─────────────────────────────────────────────────────────────────
function SkillItem({ item, level, custom, isInView, isFullscreen }) {
  const rowRef = useRef(null);
  const fillRef = useRef(null);
  const tweenRef = useRef(null);   // track active progress tween so we can kill it

  // mount fade-in (opacity, no x — hover handles x separately)
  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;
    gsap.fromTo(el,
      { opacity: 0 },
      { opacity: 1, duration: 0.3, delay: custom * 0.04, ease: 'power1.out' }
    );
  }, []);

  // hover: x: 4 on enter, x: 0 on leave
  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;
    const onEnter = () => gsap.to(el, { x: 4, duration: 0.15, ease: 'power1.out' });
    const onLeave = () => gsap.to(el, { x: 0, duration: 0.15, ease: 'power1.out' });
    el.addEventListener('mouseenter', onEnter);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mouseenter', onEnter);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  // progress fill — animates when inView, re-animates when fullscreen toggles
  const animateFill = useCallback(() => {
    const el = fillRef.current;
    if (!el) return;
    tweenRef.current?.kill();
    tweenRef.current = gsap.fromTo(el,
      { width: '0%' },
      { width: `${level}%`, duration: 0.8, delay: custom * 0.08, ease: 'power1.inOut' }
    );
  }, [level, custom]);

  useEffect(() => {
    if (isInView) animateFill();
  }, [isInView]);

  useEffect(() => {
    if (isFullscreen) animateFill();
  }, [isFullscreen]);

  return (
    <div ref={rowRef} className={styles.item} style={{ opacity: 0 }}>
      <span className={styles.fileIcon}>-rw-r--r--</span>
      <span className={styles.itemName}>{item}</span>
      <span className={styles.progressBar}>
        <span ref={fillRef} className={styles.progressFill} style={{ width: 0 }} />
      </span>
      <span className={styles.itemLevel}>{level}%</span>
    </div>
  );
}

// ── Terminal ──────────────────────────────────────────────────────────────────
export default function Terminal({ isFullscreen, onExpand, data }) {
  const terminalRef = useRef(null);
  const groupRef = useRef(null);

  const isMobile = typeof window !== 'undefined' && window.innerWidth <= MOBILE_BREAKPOINT;
  const effectiveFullscreen = isMobile ? false : isFullscreen;

  // inView via react-intersection-observer (no Framer dependency)
  const { ref: inViewRef, inView } = useInView({ triggerOnce: true });

  // merge both refs onto the terminal element
  const setRefs = useCallback((el) => {
    terminalRef.current = el;
    inViewRef(el);
  }, [inViewRef]);

  // group fade-in on mount
  useEffect(() => {
    const el = groupRef.current;
    if (!el) return;
    gsap.fromTo(el,
      { opacity: 0, x: -10 },
      { opacity: 1, x: 0, duration: 0.4, delay: 0, ease: 'power1.out' }
    );
  }, []);

  // fullscreen layout tween
  useEffect(() => {
    const el = terminalRef.current;
    if (!el || isMobile) return;

    if (effectiveFullscreen) {
      gsap.to(el, {
        position: 'absolute',
        top: 14, left: 14, right: 14, bottom: 14,
        width: 'calc(100% - 28px)',
        maxWidth: 'calc(100% - 28px)',
        height: 'calc(100% - 28px)',
        maxHeight: 'calc(100% - 28px)',
        zIndex: 1000,
        borderRadius: 'var(--radius)',
        duration: 0.2,
        ease: 'power1.inOut',
      });
    } else {
      gsap.to(el, {
        position: 'relative',
        top: 0, left: 0, right: 0, bottom: 0,
        width: '100%',
        maxWidth: '100%',
        height: '100%',
        maxHeight: '100%',
        zIndex: 1,
        borderRadius: 'var(--radius)',
        duration: 0.2,
        ease: 'power1.inOut',
      });
    }
  }, [effectiveFullscreen, isMobile]);

  return (
    <div ref={setRefs} className={styles.terminal}>
      <div className={styles.terminalBar}>
        <span className={styles.termDot} style={{ background: '#ff5f57' }}>
          <IoClose color="#000" size={16} />
        </span>
        <span className={styles.termDot} style={{ background: '#ffbd2e' }}>
          <IoRemove color="#000" size={16} />
        </span>
        <span
          className={styles.termDot}
          style={{ background: '#28c840' }}
          onClick={isMobile ? undefined : onExpand}
        >
          <ExpandIcon color="#000" size={16} style={{ rotate: '-90deg', padding: '3px' }} />
        </span>
        <span className={styles.termTitle}>sumit@portfolio: ~/stack/{data.group}</span>
      </div>

      <div className={`${styles.terminalBody} ${effectiveFullscreen ? styles.terminalBodyFullscreen : ''}`}>
        {!isMobile && (
          <p className={styles.termCmd}>
            <span className={styles.termPrompt}>sumit@portfolio:~$</span> ls -la ./{data.group}
          </p>
        )}

        <div ref={groupRef} className={styles.group} style={{ opacity: 0 }}>
          <div className={styles.items}>
            {Object.entries(data.items).map(([item, level], ii) => (
              <SkillItem
                key={item}
                item={item}
                level={level}
                custom={ii}
                isInView={inView}
                isFullscreen={effectiveFullscreen}
              />
            ))}
          </div>
        </div>

        <p className={styles.termCmd} style={{ marginTop: '20px' }}>
          <span className={styles.termPrompt}>sumit@portfolio:~$</span>
          <span className={styles.cursor}>_</span>
        </p>
      </div>
    </div>
  );
}