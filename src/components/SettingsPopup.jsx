import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { IoRefresh } from 'react-icons/io5';
import { useUserPrefs } from '../hooks/useUserPrefs';
import Button from './Button';
import styles from './SettingsPopup.module.css';

function ToggleThumb({ on }) {
  const ref = useRef(null);
  const prevOn = useRef(on);

  useEffect(() => {
    if (!ref.current || prevOn.current === on) return;
    prevOn.current = on;
    gsap.to(ref.current, {
      x: on ? 18 : 0,
      duration: 0.4,
      ease: 'power3.out',
    });
  }, [on]);

  return (
    <span
      ref={ref}
      className={styles.toggleThumb}
      style={{ transform: `translateX(${on ? 18 : 0}px)` }}
    />
  );
}

function CursorSetting({ localCursor, setLocalCursor }) {
  return (
    <div className={styles.settingRow}>
      <span className={styles.settingLabel}>Ring Cursor</span>
      <button
        className={`${styles.toggle} ${localCursor === 'yes' ? styles.toggleOn : ''}`}
        onClick={() => setLocalCursor(localCursor === 'yes' ? 'no' : 'yes')}
        role="switch"
        aria-checked={localCursor === 'yes'}
      >
        <span className={styles.toggleTrack}>
          <ToggleThumb on={localCursor === 'yes'} />
        </span>
      </button>
    </div>
  );
}

function GenieSetting({ localGenie, setLocalGenie }) {
  return (
    <div className={styles.settingRow}>
      <span className={styles.settingLabel}>Preloader Animation</span>
      <button
        className={`${styles.toggle} ${localGenie === 'yes' ? styles.toggleOn : ''}`}
        onClick={() => setLocalGenie(localGenie === 'yes' ? 'no' : 'yes')}
        role="switch"
        aria-checked={localGenie === 'yes'}
      >
        <span className={styles.toggleTrack}>
          <ToggleThumb on={localGenie === 'yes'} />
        </span>
      </button>
    </div>
  );
}

function WipeSetting({ localWipe, setLocalWipe }) {
  return (
    <div className={styles.settingRow}>
      <span className={styles.settingLabel}>Section Transition</span>
      <button
        className={`${styles.toggle} ${localWipe === 'yes' ? styles.toggleOn : ''}`}
        onClick={() => setLocalWipe(localWipe === 'yes' ? 'no' : 'yes')}
        role="switch"
        aria-checked={localWipe === 'yes'}
      >
        <span className={styles.toggleTrack}>
          <ToggleThumb on={localWipe === 'yes'} />
        </span>
      </button>
    </div>
  );
}

function ModeSetting({ mode, setMode }) {
  const active = mode === 'lite' ? 'lite' : 'full';
  return (
    <div className={styles.settingRow}>
      <span className={styles.settingLabel}>Experience Mode</span>
      <div className={styles.segmented} role="radiogroup" aria-label="Experience mode">
        <button
          className={`${styles.segment} ${active === 'full' ? styles.segmentOn : ''}`}
          onClick={() => setMode('full')}
          role="radio"
          aria-checked={active === 'full'}
        >
          Immersive
        </button>
        <button
          className={`${styles.segment} ${active === 'lite' ? styles.segmentOn : ''}`}
          onClick={() => setMode('lite')}
          role="radio"
          aria-checked={active === 'lite'}
        >
          Essential
        </button>
      </div>
    </div>
  );
}

export default function SettingsPopup({ onClose, variant = 'popup', onCursorChange, onReplayIntro }) {
  const { prefs, savePrefs } = useUserPrefs();
  const [name, setName] = useState(prefs?.name || '');
  const [mode, setMode] = useState(prefs?.mode || null);
  const [localCursor, setLocalCursor] = useState(
    () => localStorage.getItem('ring-cursor') ?? 'yes'
  );
  const [localGenie, setLocalGenie] = useState(
    () => localStorage.getItem('genie-enabled') ?? 'yes'
  );
  const [localWipe, setLocalWipe] = useState(
    () => localStorage.getItem('wipe-enabled') ?? 'yes'
  );

  const handleSave = () => {
    const modeChanged = mode !== (prefs?.mode || null) && mode != null;
    savePrefs({ name: name.trim(), mode });
    localStorage.setItem('ring-cursor', localCursor);
    localStorage.setItem('genie-enabled', localGenie);
    localStorage.setItem('wipe-enabled', localWipe);
    window.dispatchEvent(new CustomEvent('wipe-pref-change', { detail: localWipe === 'yes' }));
    onCursorChange?.(localCursor === 'yes');
    if (modeChanged) {
      window.location.reload();
      return;
    }
    onClose?.();
  };

  const inner = (
    <div className={`${styles.inner} ${variant === 'inline' ? styles.innerInline : ''}`}>
      <div className={styles.header}>
        <p className={styles.title}>
          <span className={styles.prompt}>&gt;</span> PREFERENCES
        </p>
        {variant === 'popup' && (
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        )}
      </div>

      <div className={styles.body}>
        <div className={styles.field}>
          <label className={styles.label}>NAME</label>
          <div className={styles.inputRow}>
            <span className={styles.inputPrompt}>&gt;</span>
            <input
              className={styles.input}
              type="text"
              placeholder="YOUR NAME"
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSave()}
              maxLength={32}
              spellCheck={false}
              autoComplete="off"
            />
          </div>
        </div>

        <ModeSetting mode={mode} setMode={setMode} />
        <CursorSetting localCursor={localCursor} setLocalCursor={setLocalCursor} />
        <GenieSetting localGenie={localGenie} setLocalGenie={setLocalGenie} />
        <WipeSetting localWipe={localWipe} setLocalWipe={setLocalWipe} />

        {onReplayIntro && (
          <button
            className={styles.replayBtn}
            onClick={onReplayIntro}
            title="Clear saved preferences and restart as a first-time visit"
          >
            <IoRefresh size={14} />
            <span>RESET WEBSITE</span>
          </button>
        )}
      </div>

      <div className={styles.footer}>
        <Button className={styles.saveBtn} onClick={handleSave}>
          SAVE CHANGES
        </Button>
        {variant === 'popup' && (
          <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
        )}
      </div>
    </div>
  );

  if (variant === 'inline') return inner;

  return (
    <div className={styles.popup}>
      {inner}
    </div>
  );
}