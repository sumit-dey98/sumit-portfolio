import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from './Button.module.css';

/**
 * Button variants:
 * - "fill"      — liquid fill slides in from left on hover
 * - "border"    — border draws around then fills on hover
 * - "magnetic"  — button and text follow the cursor
 */

export default function Button({
  variant = 'fill',
  children,
  onClick,
  href,
  icon: Icon,
  iconSize = 16,
  px = 12,
  iconPosition = 'right', 
  className = '',
  ...props
}) {
  const magnetRef = useRef(null);
  const textRef = useRef(null);
  const btnRef = useRef(null);

  // Magnetic logic 
  const handleMagneticMove = (e) => {
    if (variant !== 'magnetic') return;
    const btn = magnetRef.current;
    const text = textRef.current;
    if (!btn || !text) return;
    const { left, top, width, height } = btn.getBoundingClientRect();
    const x = e.clientX - (left + width / 2);
    const y = e.clientY - (top + height / 2);
    btn.style.transform = `translate(${x * 0.35}px, ${y * 0.35}px)`;
    text.style.transform = `translate(${x * 0.2}px,  ${y * 0.2}px)`;
  };

  const handleMagneticLeave = () => {
    if (variant !== 'magnetic') return;
    const btn = magnetRef.current;
    const text = textRef.current;
    if (btn) btn.style.transform = 'translate(0,0)';
    if (text) text.style.transform = 'translate(0,0)';
  };

  const Tag = href ? 'a' : 'button';
  const shared = { onClick, className: `${styles.btn} ${styles[variant]} ${className}`, ...props };
  if (href) {
    shared.href = href;
    shared.target = '_blank';
    shared.rel = 'noopener noreferrer';
  }

  // Fill variant 
  if (variant === 'fill') {
    useEffect(() => {
      handleFillMove();
    }, []);

    const handleFillMove = () => {
      if (!btnRef.current) return;
      const btn = btnRef.current;
      if (!Icon) {
        btn.style.setProperty('--fill-strip', '0px');
        btn.style.setProperty('--icon-offset', '0px');
        return;
      }
      
      const iconEl = btn.querySelector(`.${styles.iconWrap}`); 
      if (!iconEl) return;
      const btnRect = btn.getBoundingClientRect();
      const iconRect = iconEl.getBoundingClientRect();

      const strip = iconRect.width + px*2;
      btn.style.setProperty('--fill-strip', `${strip}px`);

      if (iconPosition === 'left') {
        const stripCenter = btnRect.left + strip / 2;
        const iconCenter = iconRect.left + iconRect.width / 2;
        btn.style.setProperty('--icon-offset', `${iconCenter - stripCenter}px`);
      } else {
        const stripCenter = btnRect.right - strip / 2;
        const iconCenter = iconRect.left + iconRect.width / 2;
        btn.style.setProperty('--icon-offset', `${stripCenter - iconCenter}px`);
      }
    };

    return (
      <Tag {...shared} ref={btnRef} onMouseEnter={handleFillMove} className={`${styles.btn} ${styles.fill} ${iconPosition === 'left' ? styles.iconLeft : ''} ${className}`} >
        <span className={styles.fillBg} />
        {Icon && iconPosition === 'left' && (
          <span className={styles.iconWrap}>
            <Icon className={styles.icon} size={iconSize} />
          </span>
        )}
        <span className={styles.btnText}>{children}</span>
        {Icon && iconPosition === 'right' && (
          <span className={styles.iconWrap}>
            <Icon className={styles.icon} size={iconSize} />
          </span>
        )}
      </Tag>
    );
  }

  // Border draw variant 
  if (variant === 'border') {
    return (
      <Tag {...shared}>
        <span className={styles.borderTop} />
        <span className={styles.borderRight} />
        <span className={styles.borderBottom} />
        <span className={styles.borderLeft} />
        <span className={styles.borderFill} />
        <span className={styles.btnText}>{children}</span>
      </Tag>
    );
  }

  // Magnetic variant 
  if (variant === 'magnetic') {
    return (
      <span
        className={styles.magneticWrap}
        onMouseMove={handleMagneticMove}
        onMouseLeave={handleMagneticLeave}
      >
        <Tag
          {...shared}
          ref={magnetRef}
          style={{ transition: 'transform 0.3s cubic-bezier(0.23,1,0.32,1)' }}
        >
          <span
            ref={textRef}
            className={styles.btnText}
            style={{ display: 'inline-block', transition: 'transform 0.3s cubic-bezier(0.23,1,0.32,1)' }}
          >
            {children}
          </span>
        </Tag>
      </span>
    );
  }

  return <Tag {...shared}><span className={styles.btnText}>{children}</span></Tag>;
}