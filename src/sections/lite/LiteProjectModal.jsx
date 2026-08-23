import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { FiX, FiChevronLeft, FiChevronRight, FiArrowUpRight, FiPlay, FiPause, FiMaximize2 } from 'react-icons/fi';
import styles from './LiteProjectModal.module.css';

function requestFullscreen(el) {
  if (el.requestFullscreen) return el.requestFullscreen();
  if (el.webkitRequestFullscreen) return el.webkitRequestFullscreen();
  if (el.webkitEnterFullscreen) return el.webkitEnterFullscreen();
}

export default function LiteProjectModal({ project, total, onClose }) {
  const media = [
    ...(project.videoSrc ? [{ type: 'video', src: project.videoSrc, poster: project.preview }] : []),
    ...(project.screens || []).map((src) => ({ type: 'image', src })),
  ];
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [zoom, setZoom] = useState(false); // fullscreen image view
  const videoRef = useRef(null);
  const current = media[index];

  const go = useCallback((next) => {
    setPlaying(false);
    setIndex((i) => (i + next + media.length) % media.length);
  }, [media.length]);

  const togglePlay = () => {
    const vid = videoRef.current;
    if (!vid) return;
    if (playing) { vid.pause(); setPlaying(false); }
    else { vid.play().catch(() => setPlaying(false)); setPlaying(true); }
  };

  const goFullscreen = (e) => {
    e.stopPropagation();
    const vid = videoRef.current;
    if (!vid) return;
    if (!playing) { vid.play().catch(() => {}); setPlaying(true); }
    requestFullscreen(vid);
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') { zoom ? setZoom(false) : onClose(); }
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose, go, zoom]);

  const paragraphs = Array.isArray(project.desc) ? project.desc : [project.desc];
  const idLabel = `${project.id} / ${String(total).padStart(2, '0')}`;

  return createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.close} onClick={onClose} aria-label="Close">
          <FiX size={18} />
        </button>

        <div className={styles.scroll}>
          {/* ---- Media hero ---- */}
          <div className={styles.stage}>
            {current?.type === 'video' ? (
              <>
                <video
                  ref={videoRef}
                  className={styles.stageMedia}
                  src={current.src}
                  poster={current.poster}
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  onClick={togglePlay}
                />
                <button className={styles.playBtn} onClick={togglePlay} aria-label={playing ? 'Pause' : 'Play'}>
                  {playing ? <FiPause size={20} /> : <FiPlay size={20} />}
                </button>
                <button className={styles.zoomBtn} onClick={goFullscreen} aria-label="Fullscreen video">
                  <FiMaximize2 size={16} />
                </button>
              </>
            ) : (
              <>
                <img className={styles.stageMedia} src={current?.src} alt={project.name} onClick={() => setZoom(true)} />
                <button className={styles.zoomBtn} onClick={() => setZoom(true)} aria-label="View fullscreen">
                  <FiMaximize2 size={16} />
                </button>
              </>
            )}

            {media.length > 1 && (
              <>
                <button className={`${styles.stageNav} ${styles.stagePrev}`} onClick={() => go(-1)} aria-label="Previous">
                  <FiChevronLeft size={22} />
                </button>
                <button className={`${styles.stageNav} ${styles.stageNext}`} onClick={() => go(1)} aria-label="Next">
                  <FiChevronRight size={22} />
                </button>
                <span className={styles.counter}>{index + 1} / {media.length}</span>
              </>
            )}
          </div>

          {/* ---- Thumbnail strip ---- */}
          {media.length > 1 && (
            <div className={styles.thumbs}>
              {media.map((m, i) => (
                <button
                  key={i}
                  className={`${styles.thumb} ${i === index ? styles.thumbActive : ''}`}
                  onClick={() => { setPlaying(false); setIndex(i); }}
                  aria-label={`Media ${i + 1}`}
                >
                  <img src={m.type === 'video' ? m.poster : m.src} alt="" />
                  {m.type === 'video' && <span className={styles.thumbPlay}><FiPlay size={12} /></span>}
                </button>
              ))}
            </div>
          )}

          {/* ---- Details ---- */}
          <div className={styles.details}>
            <div className={styles.detailsHead}>
              <div>
                <span className={styles.num}>{idLabel}</span>
                <h3 className={styles.name}>{project.name}</h3>
              </div>
              {project.link && (
                <a className={styles.live} href={project.link} target="_blank" rel="noopener noreferrer">
                  LIVE PROJECT <FiArrowUpRight size={20} />
                </a>
              )}
            </div>

            <div className={styles.tags}>
              {project.tags.map((t) => (
                <span key={t} className={styles.tag}>{t}</span>
              ))}
            </div>

            <div className={styles.desc}>
              {paragraphs.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ---- Fullscreen image zoom ---- */}
      {zoom && current?.type === 'image' && (
        <div className={styles.zoomOverlay} onClick={() => setZoom(false)}>
          <button className={styles.zoomClose} onClick={() => setZoom(false)} aria-label="Close fullscreen">
            <FiX size={22} />
          </button>
          <img className={styles.zoomImg} src={current.src} alt={project.name} onClick={(e) => e.stopPropagation()} />
          {media.length > 1 && (
            <>
              <button className={`${styles.zoomNav} ${styles.stagePrev}`} onClick={(e) => { e.stopPropagation(); go(-1); }} aria-label="Previous">
                <FiChevronLeft size={28} />
              </button>
              <button className={`${styles.zoomNav} ${styles.stageNext}`} onClick={(e) => { e.stopPropagation(); go(1); }} aria-label="Next">
                <FiChevronRight size={28} />
              </button>
            </>
          )}
        </div>
      )}
    </div>,
    document.body
  );
}
