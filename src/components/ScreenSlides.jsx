import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import Flickity from 'flickity';
import 'flickity/dist/flickity.min.css';
import { FiMaximize2, FiMinimize2 } from 'react-icons/fi';
import styles from './ScreenSlides.module.css';

const OVERLAY_EASE = 'power2.out';
const INNER_EASE = 'power4.out';   
const CELL_EASE = 'power4.out';

export default function ScreenSlides({ screens }) {
  const [expanded, setExpanded] = useState(false);
  const [slide, setSlide] = useState(0);

  const carouselRef = useRef(null);
  const expandedCarouselRef = useRef(null);
  const flktyRef = useRef(null);
  const expandedFlktyRef = useRef(null);
  const didDragRef = useRef(false);

  const overlayRef = useRef(null);
  const overlayInnerRef = useRef(null);
  const cellInnerRefs = useRef([]);   

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

  const openOverlay = () => {
    setExpanded(true);
  };

  useEffect(() => {
    if (!expanded) return;
    const overlay = overlayRef.current;
    const inner = overlayInnerRef.current;
    if (!overlay || !inner) return;

    gsap.set(overlay, { opacity: 0 });
    gsap.set(inner, { opacity: 0, scale: 0.95 });

    gsap.to(overlay, { opacity: 1, duration: 0.25, ease: OVERLAY_EASE });
    gsap.to(inner, { opacity: 1, scale: 1, duration: 0.25, ease: INNER_EASE });
  }, [expanded]);

  const closeOverlay = () => {
    const overlay = overlayRef.current;
    const inner = overlayInnerRef.current;
    if (!overlay || !inner) {
      setExpanded(false);
      return;
    }

    gsap.to(overlay, { opacity: 0, duration: 0.25, ease: 'power2.in' });
    gsap.to(inner, {
      opacity: 0,
      scale: 0.95,
      duration: 0.25,
      ease: 'power2.in',
      onComplete: () => setExpanded(false),
    });
  };

  useEffect(() => {
    if (!expanded) return;
    cellInnerRefs.current.forEach((el, i) => {
      if (!el) return;
      const distance = Math.abs(i - slide);
      gsap.to(el, {
        scale: distance === 0 ? 1 : 0.88,
        opacity: distance === 0 ? 1 : 0.8,
        duration: 0.35,
        ease: CELL_EASE,
      });
    });
  }, [slide, expanded]);

  if (!screens?.length) return null;

  const handleCellClick = () => {
    if (didDragRef.current) return;
    openOverlay();
  };

  return (
    <>
      <div className={styles.root}>
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
                <FiMaximize2 size={16} />
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

      {createPortal(
        expanded ? (
          <div ref={overlayRef} className={styles.overlay}>
            <div ref={overlayInnerRef} className={styles.overlayInner}>
              <button className={styles.closeBtn} onClick={closeOverlay}>
                <FiMinimize2 size={16} strokeWidth={2} />
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
                      <div
                        ref={el => { cellInnerRefs.current[i] = el; }}
                        className={styles.expandedCellInner}
                        style={{
                          scale: distance === 0 ? 1 : 0.88,
                          opacity: distance === 0 ? 1 : 0.8,
                        }}
                      >
                        <img
                          src={src}
                          alt={`Screen ${i + 1}`}
                          className={styles.expandedImg}
                          draggable={false}
                        />
                      </div>
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
            </div>
          </div>
        ) : null,
        document.body
      )}
    </>
  );
}