import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import styles from './CurtainTransition.module.css';

export default function CurtainTransition({ onComplete, color, color2 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const W = window.innerWidth;
    const H = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    // ─────────────────────────────────────────────
    // PARAMETERS
    // ─────────────────────────────────────────────
    const DURATION = 2500;          // Total animation length in ms — increase to slow everything down
    const OFFSET = 150;             // Ms stagger between layers — higher = more separation between panels
    const STEPS = 80;               // Polyline resolution of the curved edge — above 80 no visible difference
    const BELL_WIDTH = 4;           // Bell curve width — higher = narrower, more concentrated centre warp
    const CURVATURE = W >= 1023 ? -1.25 : W >= 576 ? 0.5 : 0.33; // Edge curve per breakpoint — +ve convex, -ve concave, 0 straight
    const RISE_FRACTION = 0.6;      // Fraction of DURATION spent rising — lower = exits faster, higher = slower
    const RISE_START_OFFSET =400;  // px below screen the panel starts from — higher = longer entrance
    const RISE_END_OFFSET = 100;   // px above screen the panel travels to before finishing — higher = rises further
    const WARP_BUILD_FRACTION = 0.6;     // Fraction of DURATION for bell to fully form — lower = snaps in earlier
    const WARP_DISSOLVE_START = 0.44;    // Fraction of DURATION at which bell starts dissolving
    const WARP_DISSOLVE_DURATION = 0.32; // Duration of bell dissolve as fraction of DURATION
    const DEPTH_L1 = 1.0;   // Bell depth of bottom layer (fillColor2) — fraction of H
    const DEPTH_L2 = 0.85;  // Bell depth of middle layer (fillColor)
    const DEPTH_L3 = 0.5;   // Bell depth of top layer (fillColor2) — leads the animation

    // ── Spinner parameters ──
    const SPINNER_RADIUS = 24; // Radius of the spinner arc in px
    const SPINNER_STROKE = 5;  // Stroke width
    const SPINNER_ARC_FRACTION = 0.28; // Arc length as fraction of full circle (0 → 1)
    const SPINNER_SPEED = 1.1; // Full rotations per second
    const SPINNER_Y_OFFSET = SPINNER_RADIUS + 12; // px above the top edge of the leading panel — increase to move higher
    const SPINNER_FADE_OUT_START = 0.68; // Fraction of DURATION at which spinner starts fading out
    const SPINNER_FADE_DURATION = 0.12; // Duration of spinner fade as fraction of DURATION

    // ─────────────────────────────────────────────
    // EASINGS
    // ─────────────────────────────────────────────
    const easeRise = gsap.parseEase('power2.in');    // Controls panel vertical speed — 'power2.in' accelerates upward
    const easeWarpIn = gsap.parseEase('power4.out');   // Controls how fast the bell curve appears — 'power4.out' snaps in then slows
    const easeWarpOut = gsap.parseEase('power3.in');    // Controls how fast the bell dissolves — 'power3.in' starts slow then accelerates

    // ─────────────────────────────────────────────
    // COLORS
    // ─────────────────────────────────────────────
    const cs = getComputedStyle(document.documentElement);
    const fillColor              = color  || cs.getPropertyValue('--accent').trim()  || '#276bff';
    const fillColor2            = color2 || cs.getPropertyValue('--accent2').trim() || '#00ffcc';
    const spinnerColor       = cs.getPropertyValue('--text').trim() || '#ffffff';
    const spinnerColorDim = cs.getPropertyValue('--surface').trim() || '#a4a4ca';

    // ─────────────────────────────────────────────
    // BELL LUT
    // ─────────────────────────────────────────────
    const bellLUT = new Float32Array(STEPS + 1);
    for (let i = 0; i <= STEPS; i++) {
      const nx = i / STEPS;
      bellLUT[i] = (-1.25 + CURVATURE * Math.exp(-Math.pow((nx - 0.5) * BELL_WIDTH, 2)));
    }

    // ─────────────────────────────────────────────
    // GEOMETRY
    // ─────────────────────────────────────────────
    const getPanelShape = (t, maxDepth) => {
      const riseProgress  = easeRise(Math.min(t / RISE_FRACTION, 1));
      const panelBottom  = H + RISE_START_OFFSET - riseProgress * (H + RISE_END_OFFSET);
      const warpBuild      = easeWarpIn(Math.min(t / WARP_BUILD_FRACTION, 1));
      const warpDissolve = easeWarpOut(Math.max(0, (t - WARP_DISSOLVE_START) / WARP_DISSOLVE_DURATION));
      const vDepth          = warpBuild * (1 - warpDissolve) * maxDepth * 0.5;
      return { panelBottom, vDepth };
    };

    const drawLayer = (t, fillCol, maxDepth) => {
      const { panelBottom, vDepth } = getPanelShape(t, maxDepth);

      ctx.beginPath();
      ctx.moveTo(0, H + RISE_START_OFFSET);
      ctx.lineTo(W, H + RISE_START_OFFSET);
      ctx.lineTo(W, 0.9 * (panelBottom - vDepth * (1 - bellLUT[STEPS])));

      for (let i = STEPS - 1; i >= 0; i--) {
        const x = (i / STEPS) * W;
        const y = 0.9 * (panelBottom - vDepth * (1 - bellLUT[i]));
        ctx.lineTo(x, y);
      }

      ctx.closePath();
      ctx.fillStyle = fillCol;
      ctx.fill();
    };

    // ─────────────────────────────────────────────
    // SPINNER — drawn on canvas, rides the leading panel's top edge
    // ─────────────────────────────────────────────
    const drawSpinner = (t3, elapsed, opacity) => {
      if (opacity <= 0) return;

      // Sample the top edge of the leading panel at screen centre
      const { panelBottom, vDepth } = getPanelShape(t3, H * DEPTH_L3);
      const bellAtCenter = bellLUT[Math.round(STEPS / 2)];
      const topEdgeY = 0.9 * (panelBottom - vDepth * (1 - bellAtCenter));

      const cx = W / 2;
      
      // Position the spinner 
      const cy = topEdgeY + 10 * SPINNER_Y_OFFSET;

      // Don't draw once the spinner has risen off-screen
      if (cy + SPINNER_RADIUS < 0) return;

      const rotation = (elapsed / 1000) * SPINNER_SPEED * Math.PI * 2;
      const arcLen   = SPINNER_ARC_FRACTION * Math.PI * 2;

      ctx.save();

      // Track ring (dim)
      ctx.beginPath();
      ctx.arc(cx, cy, SPINNER_RADIUS, 0, Math.PI * 2);
      ctx.strokeStyle = spinnerColorDim;
      ctx.lineWidth = SPINNER_STROKE - 1;
      ctx.globalAlpha = opacity * 0.25;
      ctx.stroke();

      // Spinning arc (bright)
      ctx.beginPath();
      ctx.arc(cx, cy, SPINNER_RADIUS, rotation, rotation + arcLen);
      ctx.strokeStyle = spinnerColor;
      ctx.lineWidth = SPINNER_STROKE;
      ctx.lineCap = 'round';
      ctx.globalAlpha = opacity;
      ctx.stroke();

      ctx.restore();
    };

    // ─────────────────────────────────────────────
    // RENDER LOOP
    // ─────────────────────────────────────────────
    let startTime = null;
    let rafId;

    const draw = (ts) => {
      if (!startTime) startTime = ts;
      const elapsed = ts - startTime;
      const globalT = elapsed / DURATION;

      ctx.clearRect(0, 0, W, H);

      const t1 = Math.min(Math.max(elapsed - OFFSET, 0) / DURATION, 1);
      const t2 = Math.min(Math.max(elapsed - OFFSET * 0.7, 0) / DURATION, 1);
      const t3 = Math.min(Math.max(elapsed, 0)  / DURATION, 1);

      drawLayer(t1, fillColor2, H * DEPTH_L1);
      drawLayer(t2, fillColor,  H * DEPTH_L2);
      drawLayer(t3, fillColor2, H * DEPTH_L3);

      // Spinner opacity: full until SPINNER_FADE_OUT_START, then fades over SPINNER_FADE_DURATION
      const fadeProgress  = Math.max(0, (globalT - SPINNER_FADE_OUT_START) / SPINNER_FADE_DURATION);
      const spinnerOpacity = Math.max(0, 1 - fadeProgress);
      drawSpinner(t1, elapsed, spinnerOpacity);

      if (t3 < 0.9) {
        rafId = requestAnimationFrame(draw);
      } else {
        ctx.clearRect(0, 0, W, H);
        onComplete?.();
      }
    };

    rafId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafId);
  }, [color, color2]);

  return <canvas ref={canvasRef} className={styles.curtain} />;
}