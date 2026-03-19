import { useNavigate } from 'react-router-dom';
import ProjectTransition from '../components/ProjectTransition';
import { useState } from 'react';
import styles from './SingleProject.module.css';
import { FaLock } from 'react-icons/fa6';
import { FiArrowLeft, FiArrowUpRight } from 'react-icons/fi';

export default function SingleProject({ src, bgColor, logo, url }) {
  const [transitioning, setTransitioning] = useState(true);
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  const displayUrl = src?.startsWith('http')
    ? url
    : window.location.host + '/' + url;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      background: 'var(--bg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '10px',
    }}>
      {transitioning && (
        <ProjectTransition
          bgColor={bgColor}
          logo={logo}
          onDone={() => {
            setTransitioning(false);
            setTimeout(() => setVisible(true), 50);
          }}
        />
      )}

      {!transitioning && (
        <div
          className={styles.browserMockup}
          style={{
            opacity: visible ? 1 : 0,
            transition: 'opacity 0.4s ease',
            pointerEvents: 'all',
          }}
        >
          <div className={styles.browserBar}>
            <div className={styles.browserDots}>
              <span className={styles.dotRed} />
              <span className={styles.dotYellow} />
              <span className={styles.dotGreen} />
            </div>

            <div className={styles.browserUrl}>
              <span className={styles.browserLock}><FaLock /></span>
              {displayUrl}
            </div>

            <button
              className={styles.browserBtn}
              onClick={() => navigate(-1)}
              title="Back to portfolio"
              aria-label="Back to portfolio"
            >
              <FiArrowLeft />
            </button>

            <a
              href={src}
              target="_blank"
              rel="noreferrer"
              className={styles.browserBtn}
              title="Open in new tab"
              aria-label="Open in new tab"
            >
              <FiArrowUpRight />
            </a>
          </div>

          <iframe
            src={src}
            allow="accelerometer; camera; gyroscope; xr-spatial-tracking"
            style={{
              width: '100%',
              flex: 1,
              border: 'none',
              display: 'block',
              background: bgColor,
            }}
          />
        </div>
      )
      }
    </div >
  );
}