import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import styles from './SpinnerScreen.module.css';

export default function SpinnerScreen({ onReady }) {
  const containerRef = useRef(null);
  const arcRef = useRef(null);
  const spinTweenRef = useRef(null);
  const readyRef = useRef(false);
  const hasRegisteredRef = useRef(false);
  const onReadyRef = useRef(onReady);
  const [showLoadingText, setShowLoadingText] = useState(false);

  useEffect(() => {
    onReadyRef.current = onReady;
  }, [onReady]);

  const SIZE = 48;
  const STROKE = 5;
  const ARC_FRACTION = 0.28;
  const SPEED = 1.1;
  const radius = (SIZE - STROKE) / 2;
  const circumference = 2 * Math.PI * radius;
  const arcLength = circumference * ARC_FRACTION;
  const cx = SIZE / 2;
  const cy = SIZE / 2;

  useEffect(() => {
    if (!arcRef.current) return;
    spinTweenRef.current = gsap.to(arcRef.current, {
      rotation: 360,
      svgOrigin: `${cx} ${cy}`,
      duration: 1 / SPEED,
      ease: 'none',
      repeat: -1,
    });
    return () => spinTweenRef.current?.kill();
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    if (hasRegisteredRef.current) return;
    hasRegisteredRef.current = true;

    gsap.fromTo(
      containerRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.4, ease: 'power2.out' }
    );

    const slowTimer = setTimeout(() => {
      if (!readyRef.current) setShowLoadingText(true);
    }, 2000);

    const handleReady = () => {
      if (readyRef.current) return;
      readyRef.current = true;
      clearTimeout(slowTimer);

      setTimeout(() => {
        if (!containerRef.current) return;
        gsap.to(containerRef.current, {
          opacity: 0,
          duration: 0.5,
          ease: 'power2.in',
          onComplete: () => onReadyRef.current?.(),
        });
      }, 600);
    };
    const fontFamily = getComputedStyle(document.documentElement)
      .getPropertyValue('--display').trim() || 'Impact';

    document.fonts.ready
      .then(() => document.fonts.load(`400 64px ${fontFamily}`))
      .then(handleReady);

    return () => {
      clearTimeout(slowTimer);
    };
  }, []);

  return (
    <div ref={containerRef} className={styles.screen}>
      <svg
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
      >
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke="var(--border)"
          strokeWidth={STROKE - 1}
          opacity={0.6}
        />
        <g transform={`rotate(-90 ${cx} ${cy})`}>
          <circle
            ref={arcRef}
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke="var(--accent)"
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={`${arcLength} ${circumference - arcLength}`}
            strokeDashoffset={0}
          />
        </g>
      </svg>

      <p
        className={styles.loadingText}
        style={{ opacity: showLoadingText ? 1 : 0 }}
      >
        LOADING ASSETS...
      </p>
    </div>
  );
}