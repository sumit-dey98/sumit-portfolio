import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Flickity from 'flickity';
import 'flickity/dist/flickity.min.css';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMaximize2, FiMinimize2 } from 'react-icons/fi';
import styles from './ScreenSlides.module.css';

const EXIT_DURATION = 250;

export default function ScreenSlides({ screens }) {
  const [expanded, setExpanded] = useState(false);
  const [slide, setSlide] = useState(0);
  const carouselRef = useRef(null);
  const expandedCarouselRef = useRef(null);
  const flktyRef = useRef(null);
  const expandedFlktyRef = useRef(null);
  const didDragRef = useRef(false);
  const [exiting, setExiting] = useState(false);

  const handleClose = () => {
    setExiting(true);
    setTimeout(() => {
      setExpanded(false);
      setExiting(false);
    }, EXIT_DURATION);
  };

  const initFlickity = (el, ref, opts = {}) => {
    if (!el) return;
    const id = requestAnimationFrame(() => {
      ref.current = new Flickity(el, {
        cellAlign: 'left',
        contain: true,
        wrapAround: screens.length > 1,
        prevNextButtons: false,
        pageDots: false,
        draggable: screens.length > 1,
        imagesLoaded: true,
        resize: true,
        ...opts,
      });
      ref.current.on('change', index => setSlide(index));
      ref.current.on('dragStart', () => { didDragRef.current = true; });
      ref.current.on('dragEnd', () => {
        setTimeout(() => { didDragRef.current = false; }, 50);
      });
    });
    return id;
  };

  useEffect(() => {
    const el = carouselRef.current;
    if (!el || !screens?.length) return;
    const id = initFlickity(el, flktyRef);
    return () => {
      cancelAnimationFrame(id);
      flktyRef.current?.destroy();
      flktyRef.current = null;
    };
  }, [screens]);

  useEffect(() => {
    if (!expanded) {
      expandedFlktyRef.current?.destroy();
      expandedFlktyRef.current = null;
      return;
    }
    const el = expandedCarouselRef.current;
    if (!el) return;
    const id = initFlickity(el, expandedFlktyRef, {
      initialIndex: slide,
      prevNextButtons: screens.length > 1,
      percentPosition: false,
      cellAlign: 'center',
    });
    return () => {
      cancelAnimationFrame(id);
      expandedFlktyRef.current?.destroy();
      expandedFlktyRef.current = null;
    };
  }, [expanded]);

  if (!screens?.length) return null;

  const handleCellClick = () => {
    if (didDragRef.current) return;
    setExpanded(true);
  };

  return (
    <>
      {/* always in place, never changes size */}
      <div className={styles.root}>
        {/* <button
          className={styles.expandBtn}
          onClick={() => setExpanded(true)}
        >
          <FiMaximize2 size={13} />
        </button> */}

        <div
          ref={carouselRef}
          className={styles.carousel}
          onPointerDown={e => e.stopPropagation()}
          onWheel={e => e.stopPropagation()}
        >
          {screens.map((src, i) => (
            <div key={i} className={styles.cell} onClick={handleCellClick}>
              <img src={src} alt={`Screen ${i + 1}`} className={styles.cellImg} draggable={false} />
              <div className={styles.cellOverlay}>
                <FiMaximize2 size={14} />
              </div>
            </div>
          ))}
        </div>

        {screens.length > 1 && (
          <div className={styles.dotRow}>
            {screens.map((_, i) => (
              <span
                key={i}
                className={`${styles.dot} ${slide === i ? styles.dotActive : ''}`}
                onClick={() => flktyRef.current?.select(i)}
              />
            ))}
          </div>
        )}
      </div>

      {/* expanded — portalled so it never affects layout */}
      {createPortal(
        <AnimatePresence>
          {(expanded || exiting) && (
            <motion.div
              className={styles.overlay}
              initial={{ opacity: 0 }}
              animate={{ opacity: exiting ? 0 : 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <motion.div
                className={styles.overlayInner}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: exiting ? 0.95 : 1, opacity: exiting ? 0 : 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              >
                <button className={styles.closeBtn} onClick={handleClose}>
                  <FiMinimize2 size={13} />
                </button>

                <div
                  ref={expandedCarouselRef}
                  className={styles.expandedCarousel}
                  onPointerDown={e => e.stopPropagation()}
                  onWheel={e => e.stopPropagation()}
                >
                  {screens.map((src, i) => {
                    const distance = Math.abs(i - slide);
                    return (
                      <div key={i} className={styles.expandedCell}>
                        <motion.div
                          className={styles.expandedCellInner}
                          animate={{
                            scale: distance === 0 ? 1 : 0.88,
                            opacity: distance === 0 ? 1 : distance === 1 ? 0.8 : 0.8,
                          }}
                          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        >
                          <img
                            src={src}
                            alt={`Screen ${i + 1}`}
                            className={styles.expandedImg}
                            draggable={false}
                          />
                        </motion.div>
                      </div>
                    );
                  })}
                </div>

                {screens.length > 1 && (
                  <div className={styles.dotRow}>
                    {screens.map((_, i) => (
                      <span
                        key={i}
                        className={`${styles.dot} ${slide === i ? styles.dotActive : ''}`}
                        onClick={() => expandedFlktyRef.current?.select(i)}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}