import { useRef, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import SvgButton from './SvgButton';
import styles from './MenuTrigger.module.css';

const MenuTrigger = ({ isOpen, onClick, fixed = true }) => {
  const linesRef = useRef([]);

  useEffect(() => {
    if (!linesRef.current[0]) return;
    if (!isOpen) {
      gsap.set(linesRef.current, { xPercent: 160 });
      gsap.to(linesRef.current, {
        xPercent: 0,
        duration: 0.2,
        ease: 'power3.out',
        stagger: 0.1,
        delay: 0.1,
      });
    }
  }, []);

  useEffect(() => {
    if (!linesRef.current[0]) return;
    if (isOpen) {
      gsap.to(linesRef.current[0], { y: 6.5, rotation: 45, duration: 0.3, ease: 'power2.inOut' });
      gsap.to(linesRef.current[1], { opacity: 0, duration: 0.2 });
      gsap.to(linesRef.current[2], { y: -6.5, rotation: -45, duration: 0.3, ease: 'power2.inOut' });
    } else {
      gsap.to(linesRef.current[0], { y: 0, rotation: 0, duration: 0.3, ease: 'power2.inOut' });
      gsap.to(linesRef.current[1], { opacity: 1, duration: 0.2 });
      gsap.to(linesRef.current[2], { y: 0, rotation: 0, duration: 0.3, ease: 'power2.inOut' });
    }
  }, [isOpen]);

  const handleMouseEnter = () => {
    if (isOpen) return;
    const tl = gsap.timeline();
    tl.to(linesRef.current, {
      xPercent: -150,
      duration: 0.4,
      ease: 'power2.in',
    })
      .set(linesRef.current, { xPercent: 100 })
      .to(linesRef.current, {
        xPercent: 0,
        duration: 0.3,
        ease: 'power2.out',
        stagger: 0.08,
      });
  };

  return (
    <SvgButton
      width={36}
      height={36}
      radius={4}
      strokeWidth={1.5}
      duration={500}
      maxGap={0.3}
      fadeLength={0.4}
      color="var(--border)"
      colorHover="var(--accent)"
      textColor="var(--accent)"
      direction="cw"
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      className={`${styles.trigger} ${fixed ? styles.fixed : ''} ${isOpen ? styles.isOpen : ''}`}
      aria-label="Toggle menu"
    >
      <div className={styles.lines}>
        {[0, 1, 2].map(i => (
          <div key={i} className={styles.lineWrap}>
            <div
              ref={el => linesRef.current[i] = el}
              className={styles.line}
            />
          </div>
        ))}
      </div>
    </SvgButton>
  );
};

export default MenuTrigger;