import React from 'react';
import styles from './Logo.module.css';

export default function Logo({ onClick, mobile = false, className = '' }) {
  return (
    <span
      className={`${styles.logo} ${mobile ? styles.mobileLogo : ''} ${className}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
    >
      <span className={styles.prompt}>&gt;</span>SUMIT
      <span className={styles.statusDot} />DEV
    </span>
  );
}