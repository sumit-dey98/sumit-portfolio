import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeContext } from '../theme/ThemeContext';
import { IoChevronDownSharp } from 'react-icons/io5';
import SvgButton from './SvgButton';
import { THEMES } from '../theme/themes';
import styles from './ThemeSwitcher.module.css';

const ThemeIcon = ({ icon: Icon, size = 12, color }) => (
  <Icon size={size} color={color} />
);

export default function ThemeSwitcher({ variant = 'dropdown' }) {
  const { themeKey, setTheme, theme } = useThemeContext();
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

  // ---- Sidebar list variant ----
  if (variant === 'list') {
    return (
      <div className={styles.list}>
        <p className={styles.listLabel}>THEME</p>
        {Object.entries(THEMES).map(([key, t]) => (
          <button
            key={key}
            className={`${styles.listItem} ${themeKey === key ? styles.listActive : ''}`}
            onClick={() => setTheme(key)}
            style={{
              // background: t.vars['--bg'],
              // borderColor: themeKey === key ? t.vars['--accent'] : t.vars['--border'],
            }}
          >
            <span className={styles.optionIcon} style={{
              color: t.vars['--accent'],
              backgroundColor: t.vars['--bg'],
              outline: `1px solid ${t.vars['--accent']}`,
              outlineOffset: '-1px'
            }}>
              <ThemeIcon icon={t.icon}/>
            </span>
            <span className={styles.optionLabel} 
            // style={{ color: t.vars['--text'] }}
            >
              {t.label}
            </span>
            {themeKey === key && (
              <span className={styles.check} style={{ color: t.vars['--accent2'] }}><span className={styles.statusDot} /></span>
            )}
          </button>
        ))}
      </div>
    );
  }

  // ---- Desktop dropdown variant ----
  return (
    <div ref={wrapperRef} className={styles.wrapper}>
      <SvgButton
        height = {36}
        radius = {4}
        strokeWidth = {1.5}
        duration = {1000}
        maxGap = {0.4}
        fadeLength = {0.5}
        background={theme.vars['--bg']}
        color={theme.vars['--border']}
        colorHover={theme.vars['--accent']}
        className={styles.trigger}
        onClick={() => setOpen(o => !o)}
        title="Switch theme"
      >
        <span className={styles.icon} >
          <ThemeIcon icon={theme.icon} color={theme.vars['--accent']} />
        </span>
        <span className={styles.label}>{theme.label}</span>
        <span className={`${styles.arrow} ${open ? styles.arrowOpen : ''}`}>
          <IoChevronDownSharp />
        </span>
      </SvgButton>

      <AnimatePresence>
        {open && (
          <motion.ul
            className={styles.menu}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
          >
            {Object.entries(THEMES).map(([key, t]) => (
              <li key={key}>
                <button
                  className={`${styles.option} ${themeKey === key ? styles.active : ''}`}
                  onClick={() => { setTheme(key); setOpen(false); }}
                  style={{
                    // background: t.vars['--bg'],
                    // borderColor: themeKey === key ? t.vars['--accent'] : t.vars['--border'],
                  }}
                >
                  <span className={styles.optionIcon} style={{
                    color: t.vars['--accent'],
                    backgroundColor: t.vars['--bg'],
                    outline: `1px solid ${t.vars['--accent']}`,
                    outlineOffset: '-1px'
                  }}>
                    <ThemeIcon icon={t.icon} />
                  </span>
                  <span className={styles.optionLabel} 
                  // style={{ color: t.vars['--text'] }}
                  >
                    {t.label}
                  </span>
                  {themeKey === key && (
                    <span className={styles.check} style={{ color: t.vars['--accent2'] }}><span className={styles.statusDot} /></span>
                  )}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}