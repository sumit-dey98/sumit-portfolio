import { useState, useRef, useEffect, useCallback,  } from 'react';
import { useThemeContext } from '../theme/ThemeContext';
import { IoChevronDownSharp, IoChevronForwardSharp } from 'react-icons/io5';
import SvgButton from './SvgButton';
import { THEMES } from '../theme/themes';
import styles from './ThemeSwitcher.module.css';
import gsap from 'gsap';

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

// Animated chevron that rotates on open/close
function AnimatedChevron({ open, size = 10, className }) {
  const ref = useRef(null);
  const prevOpen = useRef(open);

  useEffect(() => {
    if (!ref.current) return;
    if (prevOpen.current !== open) {
      gsap.to(ref.current, {
        rotation: open ? 180 : 0,
        duration: 0.15,
        ease: 'power1.inOut',
      });
      prevOpen.current = open;
    }
  }, [open]);

  return (
    <span ref={ref} className={className} style={{ display: 'inline-flex' }}>
      <IoChevronDownSharp size={size} />
    </span>
  );
}

// Animated chevron for submenu (rotates to 90deg)
function SubmenuChevron({ active, className }) {
  const ref = useRef(null);
  const prevActive = useRef(active);

  useEffect(() => {
    if (!ref.current) return;
    if (prevActive.current !== active) {
      gsap.to(ref.current, {
        rotation: active ? 90 : 0,
        duration: 0.075,
        ease: 'power1.inOut',
      });
      prevActive.current = active;
    }
  }, [active]);

  return (
    <span ref={ref} className={className} style={{ display: 'inline-flex' }}>
      <IoChevronForwardSharp size={14} />
    </span>
  );
}

// Animated collapsible panel (replaces AnimatePresence + motion.div with height/opacity)
function CollapsePanel({ open, children, className }) {
  const ref = useRef(null);
  const [mounted, setMounted] = useState(open);
  const tweenRef = useRef(null);

  useEffect(() => {
    if (open) {
      // Mount first, then animate in on next tick once ref is valid
      setMounted(true);
    } else {
      if (!ref.current) return;
      tweenRef.current?.kill();
      tweenRef.current = gsap.to(ref.current, {
        opacity: 0,
        height: 0,
        duration: 0.2,
        ease: 'power1.inOut',
        onComplete: () => setMounted(false),
      });
    }
  }, [open]);

  // Animate in only after mount gives us a real DOM node
  const panelRef = useCallback((node) => {
    ref.current = node;
    if (!node) return;
    tweenRef.current?.kill();
    gsap.set(node, { height: 0, opacity: 0 });
    const h = node.scrollHeight;
    tweenRef.current = gsap.to(node, {
      height: h,
      opacity: 1,
      duration: 0.2,
      ease: 'power1.inOut',
      clearProps: 'height',
    });
  }, []);

  if (!mounted) return null;

  return (
    <div ref={panelRef} className={className} style={{ overflow: 'hidden' }}>
      {children}
    </div>
  );
}

// Animated panel for the dropdown menu itself (y + opacity)
function DropdownPanel({ open, children, className }) {
  const ref = useRef(null);
  const [mounted, setMounted] = useState(open);
  const tweenRef = useRef(null);

  useEffect(() => {
    if (open) {
      setMounted(true);
    } else {
      if (!ref.current) return;
      tweenRef.current?.kill();
      tweenRef.current = gsap.to(ref.current, {
        opacity: 0,
        y: -8,
        duration: 0.15,
        ease: 'power1.in',
        onComplete: () => setMounted(false),
      });
    }
  }, [open]);

  const panelRef = useCallback((node) => {
    ref.current = node;
    if (!node) return;
    tweenRef.current?.kill();
    tweenRef.current = gsap.fromTo(node,
      { opacity: 0, y: -8 },
      { opacity: 1, y: 0, duration: 0.15, ease: 'power1.out' }
    );
  }, []);

  if (!mounted) return null;
  return <div ref={panelRef} className={className}>{children}</div>;
}

// Animated submenu column (width + opacity)
function SubmenuPanel({ open, children, className }) {
  const ref = useRef(null);
  const [mounted, setMounted] = useState(open);
  const tweenRef = useRef(null);

  useEffect(() => {
    if (open) {
      setMounted(true);
    } else {
      tweenRef.current?.kill();
      tweenRef.current = gsap.to(ref.current, {
        opacity: 0,
        width: 0,
        duration: 0.2,
        ease: 'power1.inOut',
        onComplete: () => setMounted(false),
      });
    }
  }, [open]);

  useEffect(() => {
    if (!mounted || !ref.current) return;
    tweenRef.current?.kill();
    gsap.set(ref.current, { width: 'auto', opacity: 1 });
    const w = ref.current.scrollWidth;
    gsap.fromTo(ref.current,
      { width: 0, opacity: 0 },
      { width: w, opacity: 1, duration: 0.2, ease: 'power1.inOut', clearProps: 'width' }
    );
  }, [mounted]);

  if (!mounted) return null;
  return (
    <ul ref={ref} className={className} style={{ overflow: 'hidden' }}>
      {children}
    </ul>
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
        <AnimatedChevron open={open} size={10} className={styles.arrow} />
      </button>

      <CollapsePanel open={open} className={styles.listSubmenuWrapper}>
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
      </CollapsePanel>
    </>
  );
}

function HoverSlideButton({ className, activeClassName, isActive, onClick, children }) {
  const ref = useRef(null);

  const handleEnter = useCallback(() => {
    gsap.to(ref.current, { duration: 0.15, ease: 'power1.out' });
  }, []);

  const handleLeave = useCallback(() => {
    gsap.to(ref.current, { duration: 0.15, ease: 'power1.out' });
  }, []);

  return (
    <button
      ref={ref}
      className={`${className} ${isActive ? activeClassName : ''}`}
      onClick={onClick}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {children}
    </button>
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
                <HoverSlideButton
                  key={key}
                  className={styles.listItem}
                  activeClassName={styles.listActive}
                  isActive={themeKey === key}
                  onClick={() => setTheme(key)}
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
                </HoverSlideButton>
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
        <AnimatedChevron open={open} className={styles.arrow} />
      </SvgButton>

      <DropdownPanel open={open} className={styles.menu}>
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
              >
                <button className={`${styles.option} ${hasActive ? styles.active : ''}`}>
                  <span className={styles.optionLabel}>{group}</span>
                  <SubmenuChevron
                    active={hoveredGroup === group}
                    className={styles.submenuArrow}
                  />
                </button>
              </li>
            );
          })}
        </ul>

        {/* submenu column */}
        <SubmenuPanel
          open={!!hoveredGroup && !!grouped[hoveredGroup]}
          className={styles.submenu}
        >
          {hoveredGroup && grouped[hoveredGroup]?.map(([key]) => (
            <li key={key}>
              <ThemeOption
                themeKey={key}
                activeKey={themeKey}
                onSelect={handleSelect}
              />
            </li>
          ))}
        </SubmenuPanel>
      </DropdownPanel>
    </div>
  );
}