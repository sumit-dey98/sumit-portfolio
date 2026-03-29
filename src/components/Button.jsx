import { useRef, useEffect, useLayoutEffect } from 'react';
import styles from './Button.module.css';

/**
 * Button variants:
 * - "fill"   - solid accent bg; on hover, bg floods in from icon side, icon moves into strip
 * - "nofill" - outline; accent strip on icon side by default with icon pinned inside it; on hover, floods full bg
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
  const btnRef = useRef(null);

  const Tag = href ? 'a' : 'button';
  const shared = { onClick, ...props };
  if (href) {
    shared.href = href;
    shared.target = '_blank';
    shared.rel = 'noopener noreferrer';
  }

  const measure = () => {
    const btn = btnRef.current;
    if (!btn) return;

    if (!Icon) {
      btn.style.setProperty('--fill-strip', '0px');
      btn.style.setProperty('--icon-offset', '0px');
      return;
    }

    const iconEl = btn.querySelector(`.${styles.iconWrap}`);
    if (!iconEl) return;

    const btnRect = btn.getBoundingClientRect();
    const iconRect = iconEl.getBoundingClientRect();

    const strip = iconRect.width + px * 2;
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

  if (variant === 'fill') {
    useEffect(() => { measure(); }, []);

    return (
      <Tag
        {...shared}
        ref={btnRef}
        onMouseEnter={measure}
        className={`${styles.btn} ${styles.fill} ${iconPosition === 'left' ? styles.iconLeft : ''} ${className}`}
      >
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

  if (variant === 'nofill') {
    useLayoutEffect(() => { measure(); }, []);

    return (
      <Tag
        {...shared}
        ref={btnRef}
        className={`${styles.btn} ${styles.nofill} ${iconPosition === 'left' ? styles.iconLeft : ''} ${className}`}
      >
        <span className={styles.nofillBg} />
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

  // ── fallback ──────────────────────────────────────────────────────────────
  return (
    <Tag {...shared} className={`${styles.btn} ${className}`}>
      <span className={styles.btnText}>{children}</span>
    </Tag>
  );
}