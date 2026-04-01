import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeContext } from '../theme/ThemeContext';
import { IoChevronDownSharp, IoChevronForwardSharp } from 'react-icons/io5';
import SvgButton from './SvgButton';
import { THEMES } from '../theme/themes';
import styles from './ThemeSwitcher.module.css';

const ThemeIcon = ({ icon: Icon, size = 12, color }) => (
  <Icon size={size} color={color} />
);

function groupThemes() {
  return Object.entries(THEMES).reduce((acc, [key, t]) => {
    const g = t.group ?? '__top__';
    if (!acc[g]) acc[g] = [];
    acc[g].push([key, t]);
    return acc;
  }, {});
}

function ThemeOption({ themeKey, activeKey, onSelect }) {
  const t = THEMES[themeKey];
  const isActive = themeKey === activeKey;
  return (
    <button
      className={`${styles.option} ${isActive ? styles.active : ''}`}
      onClick={() => onSelect(themeKey)}
    >
      <span className={styles.optionIcon} style={{
        color: t.vars['--accent'],
        backgroundColor: t.vars['--bg'],
        outline: `1px solid ${t.vars['--accent']}`,
        outlineOffset: '-1px'
      }}>
        <ThemeIcon icon={t.icon} />
      </span>
      <span className={styles.optionLabel}>{t.label}</span>
      {isActive && (
        <span className={styles.check} style={{ color: t.vars['--accent2'] }}>
          <span className={styles.statusDot} />
        </span>
      )}
    </button>
  );
}

function ListSubMenu({ group, entries, activeKey, onSelect }) {
  const [open, setOpen] = useState(false);
  const hasActive = entries.some(([key]) => key === activeKey);

  return (
    <>
      <button
        className={`${styles.listItem} ${hasActive ? styles.listActive : ''}`}
        onClick={() => setOpen(o => !o)}
      >
        <span className={styles.optionLabel}>{group}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.15 }}
          className={styles.arrow}
        >
          <IoChevronDownSharp size={10} />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className={styles.listSubmenuWrapper}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            style={{ overflow: 'hidden' }}
          >
            {entries.map(([key]) => (
              <button
                key={key}
                className={`${styles.listItem} ${activeKey === key ? styles.listActive : ''}`}
                onClick={() => onSelect(key)}
              >
                <span className={styles.optionIcon} style={{
                  color: THEMES[key].vars['--accent'],
                  backgroundColor: THEMES[key].vars['--bg'],
                  outline: `1px solid ${THEMES[key].vars['--accent']}`,
                  outlineOffset: '-1px'
                }}>
                  <ThemeIcon icon={THEMES[key].icon} />
                </span>
                <span className={styles.optionLabel}>{THEMES[key].label}</span>
                {activeKey === key && (
                  <span className={styles.check} style={{ color: THEMES[key].vars['--accent2'] }}>
                    <span className={styles.statusDot} />
                  </span>
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function ThemeSwitcher({ variant = 'dropdown' }) {
  const { themeKey, setTheme, theme } = useThemeContext();
  const [open, setOpen] = useState(false);
  const [hoveredGroup, setHoveredGroup] = useState(null);
  const wrapperRef = useRef(null);
  const grouped = groupThemes();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
        setHoveredGroup(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (key) => {
    setTheme(key);
    setOpen(false);
    setHoveredGroup(null);
  };

  // ---- Sidebar list variant ----
  if (variant === 'list') {
    return (
      <div className={styles.list}>
        <p className={styles.listLabel}>THEME</p>

        <div className={styles.listShell}>
          {Object.entries(grouped).map(([group, entries]) => {
            if (group === '__top__') {
              return entries.map(([key]) => (
                <motion.button
                  key={key}
                  className={`${styles.listItem} ${themeKey === key ? styles.listActive : ''}`}
                  onClick={() => setTheme(key)}
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.15 }}
                >
                  <span className={styles.optionIcon} style={{
                    color: THEMES[key].vars['--accent'],
                    backgroundColor: THEMES[key].vars['--bg'],
                    outline: `1px solid ${THEMES[key].vars['--accent']}`,
                    outlineOffset: '-1px'
                  }}>
                    <ThemeIcon icon={THEMES[key].icon} />
                  </span>
                  <span className={styles.optionLabel}>{THEMES[key].label}</span>
                  {themeKey === key && (
                    <span className={styles.check} style={{ color: THEMES[key].vars['--accent2'] }}>
                      <span className={styles.statusDot} />
                    </span>
                  )}
                </motion.button>
              ));
            }

            return (
              <ListSubMenu
                key={group}
                group={group}
                entries={entries}
                activeKey={themeKey}
                onSelect={setTheme}
              />
            );
          })}
        </div>
      </div>
    );
  }

  // ---- Desktop dropdown variant ----
  return (
    <div ref={wrapperRef} className={styles.wrapper}>
      <SvgButton
        height={36}
        radius={4}
        strokeWidth={1.5}
        duration={1000}
        maxGap={0.4}
        fadeLength={0.5}
        background='var(--bg)'
        color='var(--accent)'
        colorHover='var(--accent2)'
        className={styles.trigger}
        onClick={() => setOpen(o => !o)}
        title="Switch theme"
      >
        <span className={styles.icon}>
          <ThemeIcon icon={theme.icon} color={theme.vars['--accent']} />
        </span>
        <span className={styles.label}>{theme.label}</span>
        <motion.span
          className={styles.arrow}
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <IoChevronDownSharp />
        </motion.span>
      </SvgButton>

      <AnimatePresence>
        {open && (
          <motion.div
            className={styles.menu}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
          >
            {/* main column */}
            <ul className={styles.menuMain}>
              {Object.entries(grouped).map(([group, entries]) => {
                if (group === '__top__') {
                  return entries.map(([key]) => (
                    <li key={key}>
                      <ThemeOption
                        themeKey={key}
                        activeKey={themeKey}
                        onSelect={handleSelect}
                      />
                    </li>
                  ));
                }
                const hasActive = entries.some(([k]) => k === themeKey);
                return (
                  <li
                    key={group}
                    className={styles.submenuItem}
                    onClick={() => setHoveredGroup(group)}
                    // onMouseEnter={() => setHoveredGroup(group)}
                    // onMouseLeave={() => setHoveredGroup(null)}
                  >
                    <button className={`${styles.option} ${hasActive ? styles.active : ''}`}>
                      <span className={styles.optionLabel}>{group}</span>
                      <motion.span
                        className={styles.submenuArrow}
                        animate={{ rotate: hoveredGroup === group ? 90 : 0 }}
                        transition={{ duration: 0.075 }}
                      >
                        <IoChevronForwardSharp size={14} />
                      </motion.span>
                    </button>
                  </li>
                );
              })}
            </ul>

            {/* submenu column — sibling to menuMain, stretches menu */}
            <AnimatePresence>
              {hoveredGroup && grouped[hoveredGroup] && (
                <motion.ul
                  className={styles.submenu}
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ overflow: 'hidden' }}
                  onMouseEnter={() => setHoveredGroup(hoveredGroup)}
                  onMouseLeave={() => setHoveredGroup(null)}
                >
                  {grouped[hoveredGroup].map(([key]) => (
                    <li key={key}>
                      <ThemeOption
                        themeKey={key}
                        activeKey={themeKey}
                        onSelect={handleSelect}
                      />
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}