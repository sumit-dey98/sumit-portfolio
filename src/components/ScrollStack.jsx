import { useLayoutEffect, useRef, useCallback } from 'react';
import Lenis from 'lenis';
import './ScrollStack.module.css';

export const ScrollStackItem = ({ children, itemClassName = '' }) => (
  <div className={`scroll-stack-card ${itemClassName}`.trim()}>{children}</div>
);

const ScrollStack = ({
  children,
  className = '',
  itemDistance = 100,
  itemScale = 0.03,
  itemStackDistance = 30,
  stackPosition = '20%',
  scaleEndPosition = '10%',
  baseScale = 0.85,
  rotationAmount = 0,
  blurAmount = 0,
  useWindowScroll = false,
  scrollContainerRef = null,
  onStackComplete,
}) => {
  const scrollerRef = useRef(null);
  const stackCompletedRef = useRef(false);
  const animationFrameRef = useRef(null);
  const rafScheduledRef = useRef(false);
  const lenisRef = useRef(null);
  const cardsRef = useRef([]);
  // Caches: card tops + end element top, populated once after stable layout
  const cachedCardTopsRef = useRef([]);
  const cachedPinEndRef = useRef(0);
  const lastTransformsRef = useRef(new Map());

  const getContainer = useCallback(() => {
    if (scrollContainerRef?.current) return scrollContainerRef.current;
    if (useWindowScroll) return null;
    return scrollerRef.current;
  }, [useWindowScroll, scrollContainerRef]);

  const parsePercentage = useCallback((value, containerHeight) => {
    if (typeof value === 'string' && value.includes('%')) {
      return (parseFloat(value) / 100) * containerHeight;
    }
    return parseFloat(value);
  }, []);

  // Walk offsetParent chain relative to the scroll container (stable, no reflow)
  const getOffsetRelativeTo = useCallback((element, container) => {
    let offset = 0;
    let el = element;
    while (el && el !== container) {
      offset += el.offsetTop;
      el = el.offsetParent;
    }
    return offset;
  }, []);

  // Cache all card tops AND the endElement pinEnd — called once after layout
  // and again on resize. Never called during scroll.
  const cacheOffsets = useCallback(() => {
    const container = getContainer();
    if (!container && !useWindowScroll) return;

    const viewHeight = useWindowScroll ? window.innerHeight : container.clientHeight;
    const stackPositionPx = parsePercentage(stackPosition, viewHeight);

    if (useWindowScroll) {
      cachedCardTopsRef.current = cardsRef.current.map(card => {
        if (!card) return 0;
        return card.getBoundingClientRect().top + window.scrollY;
      });

      const endEl = document.querySelector('.scroll-stack-end');
      const endTop = endEl ? endEl.getBoundingClientRect().top + window.scrollY : 0;
      cachedPinEndRef.current = endTop - viewHeight / 2;
    } else {
      cachedCardTopsRef.current = cardsRef.current.map(card =>
        card ? getOffsetRelativeTo(card, container) : 0
      );

      const endEl = container.querySelector('.scroll-stack-end');
      const endTop = endEl ? getOffsetRelativeTo(endEl, container) : 0;
      cachedPinEndRef.current = endTop - viewHeight / 2;
    }
  }, [useWindowScroll, getContainer, parsePercentage, stackPosition, getOffsetRelativeTo]);

  // Pure write-only scroll handler — reads only from cached values and
  // scroll position, never triggers layout.
  const updateCardTransforms = useCallback(() => {
    if (!cardsRef.current.length) return;

    const container = getContainer();
    const scrollTop = useWindowScroll ? window.scrollY : container?.scrollTop ?? 0;
    const viewHeight = useWindowScroll ? window.innerHeight : container?.clientHeight ?? 0;
    const stackPositionPx = parsePercentage(stackPosition, viewHeight);
    const scaleEndPositionPx = parsePercentage(scaleEndPosition, viewHeight);
    const pinEnd = cachedPinEndRef.current;

    cardsRef.current.forEach((card, i) => {
      if (!card) return;

      const cardTop = cachedCardTopsRef.current[i] ?? 0;
      const pinStart = cardTop - stackPositionPx - itemStackDistance * i;
      const triggerEnd = cardTop - scaleEndPositionPx;

      // Scale progress
      let scaleProgress = 0;
      if (scrollTop >= pinStart && scrollTop <= triggerEnd) {
        scaleProgress = (scrollTop - pinStart) / Math.max(1, triggerEnd - pinStart);
      } else if (scrollTop > triggerEnd) {
        scaleProgress = 1;
      }

      const targetScale = baseScale + i * itemScale;
      const scale = 1 - scaleProgress * (1 - targetScale);
      const rotation = rotationAmount ? i * rotationAmount * scaleProgress : 0;

      // Blur — only computed when enabled
      let blur = 0;
      if (blurAmount && scaleProgress > 0) {
        let topCardIndex = 0;
        for (let j = 0; j < cardsRef.current.length; j++) {
          const jPinStart =
            (cachedCardTopsRef.current[j] ?? 0) - stackPositionPx - itemStackDistance * j;
          if (scrollTop >= jPinStart) topCardIndex = j;
        }
        if (i < topCardIndex) blur = Math.max(0, (topCardIndex - i) * blurAmount);
      }

      // Translation
      let translateY = 0;
      if (scrollTop >= pinStart && scrollTop <= pinEnd) {
        translateY = scrollTop - cardTop + stackPositionPx + itemStackDistance * i;
      } else if (scrollTop > pinEnd) {
        translateY = pinEnd - cardTop + stackPositionPx + itemStackDistance * i;
      }
      translateY = Math.max(0, translateY);

      // Round to avoid sub-pixel thrash
      const ty = Math.round(translateY * 100) / 100;
      const sc = Math.round(scale * 1000) / 1000;
      const ro = Math.round(rotation * 100) / 100;
      const bl = Math.round(blur * 100) / 100;

      const last = lastTransformsRef.current.get(i);
      const hasChanged =
        !last ||
        Math.abs(last.ty - ty) > 0.1 ||
        Math.abs(last.sc - sc) > 0.001 ||
        Math.abs(last.ro - ro) > 0.1 ||
        Math.abs(last.bl - bl) > 0.1;

      if (hasChanged) {
        card.style.transform = `translate3d(0, ${ty}px, 0) scale(${sc}) rotate(${ro}deg)`;
        // Only set filter when blur is enabled to avoid repaint overhead
        if (blurAmount) {
          card.style.filter = bl > 0 ? `blur(${bl}px)` : 'none';
        }
        lastTransformsRef.current.set(i, { ty, sc, ro, bl });
      }

      // Stack completion callback on last card
      if (i === cardsRef.current.length - 1) {
        const inView = scrollTop >= pinStart && scrollTop <= pinEnd;
        if (inView && !stackCompletedRef.current) {
          stackCompletedRef.current = true;
          onStackComplete?.();
        } else if (!inView && stackCompletedRef.current) {
          stackCompletedRef.current = false;
        }
      }
    });
  }, [
    itemScale, itemStackDistance, stackPosition, scaleEndPosition,
    baseScale, rotationAmount, blurAmount, useWindowScroll,
    onStackComplete, parsePercentage, getContainer,
  ]);

  // rAF-throttled scroll handler — never drops a frame, deduplicates within frame
  const handleScroll = useCallback(() => {
    if (rafScheduledRef.current) return;
    rafScheduledRef.current = true;
    animationFrameRef.current = requestAnimationFrame(() => {
      rafScheduledRef.current = false;
      updateCardTransforms();
    });
  }, [updateCardTransforms]);

  useLayoutEffect(() => {
    const container = getContainer();
    if (!container && !useWindowScroll) return;

    const cards = Array.from(
      useWindowScroll
        ? document.querySelectorAll('.scroll-stack-card')
        : container.querySelectorAll('.scroll-stack-card')
    );

    cardsRef.current = cards;

    cards.forEach((card, i) => {
      if (i < cards.length - 1) card.style.marginBottom = `${itemDistance}px`;
      card.style.transformOrigin = 'top center';
      card.style.transform = 'translate3d(0, 0, 0)';
      // Explicit will-change — valid value, not empty string
      card.style.willChange = 'transform';
    });

    // Wait two frames: first for layout to stabilise, second to ensure
    // offsetTop values are fully resolved (avoids the zero-on-mount bug).
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        cacheOffsets();
        updateCardTransforms();
      });
    });

    const onResize = () => {
      requestAnimationFrame(() => {
        cacheOffsets();
        updateCardTransforms();
      });
    };
    window.addEventListener('resize', onResize, { passive: true });

    let lenis = null;
    if (useWindowScroll) {
      lenis = new Lenis({
        duration: 1.2,
        easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 2,
        wheelMultiplier: 1,
        lerp: 0.1,
        syncTouch: true,
        syncTouchLerp: 0.075,
      });
      lenis.on('scroll', handleScroll);
      const raf = time => {
        lenis.raf(time);
        animationFrameRef.current = requestAnimationFrame(raf);
      };
      animationFrameRef.current = requestAnimationFrame(raf);
    } else {
      container.addEventListener('scroll', handleScroll, { passive: true });
    }
    lenisRef.current = lenis;

    return () => {
      window.removeEventListener('resize', onResize);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (lenisRef.current) lenisRef.current.destroy();
      if (!useWindowScroll && container) {
        container.removeEventListener('scroll', handleScroll);
      }
      stackCompletedRef.current = false;
      rafScheduledRef.current = false;
      cardsRef.current = [];
      cachedCardTopsRef.current = [];
      cachedPinEndRef.current = 0;
      lastTransformsRef.current.clear();
    };
  }, [
    itemDistance, useWindowScroll, onStackComplete,
    handleScroll, updateCardTransforms, getContainer, cacheOffsets,
  ]);

  if (scrollContainerRef) {
    return (
      <div className={`scroll-stack-external ${className}`.trim()}>
        <div className="scroll-stack-inner">
          {children}
          <div className="scroll-stack-end" />
        </div>
      </div>
    );
  }

  return (
    <div className={`scroll-stack-scroller ${className}`.trim()} ref={scrollerRef}>
      <div className="scroll-stack-inner">
        {children}
        <div className="scroll-stack-end" />
      </div>
    </div>
  );
};

export default ScrollStack;