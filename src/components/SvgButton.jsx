import { useRef, useEffect, useId, useState } from "react";
import styles from './SvgButton.module.css';

/**
 * SvgButton
 *
 * Props:
 * @param {number|string} width        explicit px width, or omit for auto-measure   (default: undefined)
 * @param {number|string} height       explicit px height, or omit for auto-measure  (default: undefined)
 * @param {boolean}       fullWidth    set width: 100% on the button                 (default: false)
 * @param {boolean}       fullHeight   set height: 100% on the button                (default: false)
 * @param {number}        radius       border radius in px                           (default: 8)
 * @param {number}        strokeWidth  stroke width in px                            (default: 2)
 * @param {string}        color        idle border color                             (default: "var(--accent)")
 * @param {string}        colorHover   hover border color                            (default: "var(--accent2)")
 * @param {string}        textColor    content text color                            (default: "var(--accent2)")
 * @param {number}        duration     wipe duration in ms                           (default: 1500)
 * @param {number}        maxGap       peak gap fraction 0–1                         (default: 0.2)
 * @param {number}        fadeLength   tail fade length 0–1                          (default: 0.3)
 * @param {object}        gsap         gsap instance (optional)
 * @param {string}        ease         gsap ease string                              (default: "power2.inOut")
 * @param {string}        direction    "cw" | "ccw"                                  (default: "ccw")
 * @param {number}        startOffset  starting point along perimeter in px          (default: 0)
 * @param {function}      onClick
 * @param {node}          children
 * @param {string}        className
 */
export default function SvgButton({
  width,
  height,
  fullWidth = false,
  fullHeight = false,
  radius = 8,
  strokeWidth = 2,
  color = "var(--accent)",
  colorHover = "var(--accent2)",
  textColor = "var(--accent)",
  duration = 1500,
  maxGap = 0.2,
  fadeLength = 0.3,
  gsap,
  ease = "power2.inOut",
  onClick,
  children,
  direction = "ccw",
  startOffset = 0,
  forceActive = false,
  onMouseEnter,
  onMouseLeave,
  className = "",
  ...rest
}) {
  const iRef = useRef(null);
  const hRef = useRef(null);
  const iGradRef = useRef(null);
  const hGradRef = useRef(null);
  const btnRef = useRef(null);
  const tweenRef = useRef(null);
  const stateRef = useRef({ t: 0 });
  const intervalRef = useRef(null);
  const uid = useId().replace(/:/g, '');

  const [measuredW, setMeasuredW] = useState(0);
  const [measuredH, setMeasuredH] = useState(0);

  const hasExplicitW = typeof width === 'number';
  const hasExplicitH = typeof height === 'number';

  const svgW = hasExplicitW ? width : measuredW;
  const svgH = hasExplicitH ? height : measuredH;

  const gradIdI = `fade-i-${uid}`;
  const gradIdH = `fade-h-${uid}`;

  const p = useRef({});
  p.current = {
    svgW, svgH, radius, strokeWidth, color, colorHover,
    duration, maxGap, fadeLength, gsap, ease, direction, startOffset,
  };

  useEffect(() => {
    if (hasExplicitW && hasExplicitH) return;
    if (!btnRef.current) return;

    const measure = () => {
      const { offsetWidth, offsetHeight } = btnRef.current;
      if (!hasExplicitW && offsetWidth !== measuredW) setMeasuredW(offsetWidth);
      if (!hasExplicitH && offsetHeight !== measuredH) setMeasuredH(offsetHeight);
    };

    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(btnRef.current);
    return () => ro.disconnect();
  }, [hasExplicitW, hasExplicitH]);

  function paint() {
    const {
      svgW, svgH, radius, color, colorHover,
      maxGap, fadeLength, direction, startOffset,
    } = p.current;

    const i = iRef.current;
    const h = hRef.current;
    const iGrad = iGradRef.current;
    const hGrad = hGradRef.current;
    if (!i || !h || svgW === 0 || svgH === 0) return;

    const per = 2 * (svgW + svgH) - 8 * radius + 2 * Math.PI * radius;
    const t = stateRef.current.t;
    const gap = maxGap * Math.sin(t * Math.PI) * per;
    const iLen = (1 - t) * (per - gap);
    const hLen = t * (per - gap);

    const start = ((startOffset % per) + per) % per;
    let iOffset = direction === "cw"
      ? start + t * per
      : start - t * per;
    iOffset = ((iOffset % per) + per) % per;
    const hOffset = (iOffset + iLen + gap) % per;

    i.style.strokeDasharray = `${iLen} ${per - iLen}`;
    i.style.strokeDashoffset = String(iOffset);
    i.style.opacity = iLen > 1 ? "1" : "0";

    h.style.strokeDasharray = `${hLen} ${per - hLen}`;
    h.style.strokeDashoffset = String(hOffset);
    h.style.opacity = hLen > 1 ? "1" : "0";

    if (fadeLength > 0) {
      const iAngle = -(iOffset / per) * 360;
      const hAngle = -(hOffset / per) * 360;

      iGrad?.setAttribute('gradientTransform', `rotate(${iAngle}, 0.5, 0.5)`);
      hGrad?.setAttribute('gradientTransform', `rotate(${hAngle}, 0.5, 0.5)`);

      const fadeFraction = Math.sin(t * Math.PI);
      const tailOpacity = 1 - fadeFraction * fadeLength * 3;
      const midOpacity = 0.5 + (1 - fadeFraction) * 0.5;

      iGrad?.querySelectorAll('stop')[0]?.setAttribute('stop-opacity', String(Math.max(0, tailOpacity)));
      iGrad?.querySelectorAll('stop')[1]?.setAttribute('stop-opacity', String(midOpacity));
      hGrad?.querySelectorAll('stop')[0]?.setAttribute('stop-opacity', String(Math.max(0, tailOpacity)));
      hGrad?.querySelectorAll('stop')[1]?.setAttribute('stop-opacity', String(midOpacity));
    }
  }

  function animateTo(target) {
    const { duration, ease, gsap: gsapInstance } = p.current;

    tweenRef.current?.kill?.();
    tweenRef.current = null;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (gsapInstance) {
      tweenRef.current = gsapInstance.to(stateRef.current, {
        t: target,
        duration: duration / 1000,
        ease,
        overwrite: true,
        onUpdate: paint,
      });
    } else {
      const from = stateRef.current.t;
      const delta = target - from;
      const steps = duration / 16;
      let step = 0;
      intervalRef.current = setInterval(() => {
        step++;
        const raw = step / steps;
        const eased = raw < 0.5
          ? 4 * raw * raw * raw
          : 1 - Math.pow(-2 * raw + 2, 3) / 2;
        stateRef.current.t = from + delta * Math.min(eased, 1);
        paint();
        if (step >= steps) {
          stateRef.current.t = target;
          paint();
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }, 16);
    }
  }

  const handleEnter = () => animateTo(1);
  const handleLeave = () => { if (!forceActive) animateTo(0); };

  useEffect(() => {
    paint();
    return () => {
      tweenRef.current?.kill?.();
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => { paint(); }, [
    svgW, svgH, radius, strokeWidth, color, colorHover, fadeLength, startOffset,
  ]);

  useEffect(() => {
    if (svgW === 0 || svgH === 0) return;
    animateTo(forceActive ? 1 : 0);
  }, [forceActive, svgW, svgH]);

  const shared = {
    x: strokeWidth / 2,
    y: strokeWidth / 2,
    width: svgW - strokeWidth,
    height: svgH - strokeWidth,
    rx: radius,
    strokeWidth,
    fill: "none",
    strokeLinecap: "round",
  };

  const fadePct = `${Math.round(fadeLength * 100)}%`;

  const btnStyle = {
    '--btn-color': textColor,
    '--btn-hover-color': colorHover,
  };
  if (hasExplicitW) btnStyle.width = width;
  else if (fullWidth) btnStyle.width = '100%';
  if (hasExplicitH) btnStyle.height = height;
  else if (fullHeight) btnStyle.height = '100%';

  const handleEnterComposed = (e) => {
    handleEnter();
    onMouseEnter?.(e);
  };

  const handleLeaveComposed = (e) => {
    handleLeave();
    onMouseLeave?.(e);
  };

  return (
    <button
      ref={btnRef}
      onClick={onClick}
      onMouseEnter={handleEnterComposed}
      onMouseLeave={handleLeaveComposed}
      className={`${styles.btn} ${className}`}
      style={btnStyle}
      {...rest}
    >
      {svgW > 0 && svgH > 0 && (
        <svg
          className={styles.svg}
          width="100%"
          height="100%"
          viewBox={`0 0 ${svgW} ${svgH}`}
          fill="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient
              id={gradIdI} ref={iGradRef}
              x1="0" y1="0.5" x2="1" y2="0.5"
              gradientUnits="objectBoundingBox"
            >
              <stop offset="0%" stopColor={color} stopOpacity="0" />
              <stop offset={fadePct} stopColor={color} stopOpacity="0.5" />
              <stop offset="100%" stopColor={color} stopOpacity="1" />
            </linearGradient>

            <linearGradient
              id={gradIdH} ref={hGradRef}
              x1="0" y1="0.5" x2="1" y2="0.5"
              gradientUnits="objectBoundingBox"
            >
              <stop offset="0%" stopColor={colorHover} stopOpacity="0" />
              <stop offset={fadePct} stopColor={colorHover} stopOpacity="0.5" />
              <stop offset="100%" stopColor={colorHover} stopOpacity="1" />
            </linearGradient>
          </defs>

          <rect
            ref={iRef}
            {...shared}
            stroke={fadeLength > 0 ? `url(#${gradIdI})` : color}
          />
          <rect
            ref={hRef}
            {...shared}
            stroke={fadeLength > 0 ? `url(#${gradIdH})` : colorHover}
            style={{ strokeDasharray: "0 9999", opacity: 0 }}
          />
        </svg>
      )}

      <span className={styles.content}>
        {children}
      </span>
    </button>
  );
}