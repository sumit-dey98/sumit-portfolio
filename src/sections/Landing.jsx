import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import DotGrid from '../components/DotGrid';
import Button from '../components/Button';
import SvgButton from '../components/SvgButton';
import { useThemeContext } from '../theme/ThemeContext';
import { useDecryptedText } from '../hooks/useDecryptedText';
import { useTypewriter } from '../hooks/useTypewriter';
import { IoArrowForwardSharp } from 'react-icons/io5';
import styles from './Landing.module.css';

const isMobile = typeof window !== 'undefined' && window.innerWidth <= 1023;

/**
 * Variant: 'hero'
 * All content comes from the section's `data` - see src/data/sections/landing.js.
 * Any number of nameLines / roles / actions.
 */
export default function Landing({ data = {}, ready = false, onEnter, onViewProjects }) {
  const {
    boot = '',
    nameLines: NAME_LINES = [],
    roles = [],
    actions = [],
  } = data;
  const LAST = NAME_LINES.length - 1;
  const { getCssVar } = useThemeContext();
  const firedRef = useRef(false);
  const tlRef = useRef(null);

  const preRef = useRef(null);
  // One ref per hero name line, so nameLines can be any length.
  const wordRefs = useRef([]);
  const roleRef = useRef(null);
  const buttonsRef = useRef(null);
  const hintRef = useRef(null);

  const { display, start: startDecrypt } = useDecryptedText(boot, {
    speed: 50,
    revealSpeed: 1,
    autoStart: false,
  });

  const startDecryptRef = useRef(startDecrypt);
  useEffect(() => { startDecryptRef.current = startDecrypt; }, [startDecrypt]);

  const typed = useTypewriter(roles.length ? roles : [''], {
    speed: 55,
    pause: 2000,
    paused: !ready,
  });

  useEffect(() => {
    if (!ready || firedRef.current) return;
    firedRef.current = true;
    startDecryptRef.current?.();

    const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
    tlRef.current = tl;

    tl.fromTo(preRef.current,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.45 },
      0.1
    );

    tl.fromTo(wordRefs.current.filter(Boolean),
      { y: '100%' },
      { y: '0%', duration: 0.65, stagger: 0.1 },
      0.2  
    );

    tl.fromTo(roleRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.4 },
      0.3
    );

    tl.fromTo(buttonsRef.current,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.45 },
      0.4
    );

    if (hintRef.current) {
      tl.fromTo(hintRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.4 },
        0.5
      );
    }

    return () => tl.kill();
  }, [ready]);

  return (
    <section id="landing" className={styles.landing}>
      <div className={styles.grid}>
        <DotGrid
          dotSize={3}
          gap={15}
          baseColor={getCssVar('--surface')}
          activeColor={getCssVar('--accent')}
          proximity={130}
          shockRadius={260}
          shockStrength={6}
          resistance={750}
          returnDuration={1.5}
        />
      </div>

      <div className={styles.content}>

        <p ref={preRef} className={styles.pre} style={{ opacity: 0 }}>
          <span className={styles.prompt}>&gt;</span> {display}
        </p>

        <h1 className={styles.headline}>
          {NAME_LINES.map((word, i) => (
            <span key={word} className={i === LAST ? styles.lastLine : undefined} style={{ display: i === LAST ? 'flex' : 'block' }}>
              <span style={{ display: 'block', overflow: 'hidden' }}>
                <span
                  ref={el => { wordRefs.current[i] = el; }}
                  style={{ display: 'inline-block', transform: 'translateY(100%)' }}
                >
                  {word}
                </span>
              </span>
              {i === LAST && !isMobile && (
                <button
                  ref={hintRef}
                  type="button"
                  className={styles.enterArrow}
                  style={{ opacity: 0 }}
                  onClick={onEnter}
                  aria-label="Enter portfolio"
                >
                  <IoArrowForwardSharp className={styles.enterArrowIcon} />
                </button>
              )}
            </span>
          ))}
        </h1>

        <p ref={roleRef} className={styles.role} style={{ opacity: 0 }}>
          <span className={styles.typed}>
            {typed}<span className={styles.cursor}>▌</span>
          </span>
        </p>

        <div ref={buttonsRef} className={styles.buttons} style={{ opacity: 0 }}>
          {actions.map((action, i) => {
            // An action with neither href nor a known action is inert - skip it.
            const handler = action.action === 'projects' ? onViewProjects : undefined;
            if (!action.href && !handler) return null;

            if (action.style === 'svg') {
              return (
                <SvgButton
                  key={action.label || i}
                  color={getCssVar('--accent')}
                  colorHover={getCssVar('--accent2')}
                  width={186}
                  height={48}
                  radius={6}
                  duration={1500}
                  fadeLength={0.75}
                  strokeWidth={1.5}
                  direction="ccw"
                  gsap={gsap}
                  maxGap={0.5}
                  ease="expo.inOut"
                  onClick={handler}
                >
                  {action.label}
                </SvgButton>
              );
            }

            return (
              <Button
                key={action.label || i}
                variant="fill"
                href={action.href || undefined}
                onClick={handler}
                icon={IoArrowForwardSharp}
              >
                {action.label}
              </Button>
            );
          })}
        </div>

      </div>
    </section>
  );
}