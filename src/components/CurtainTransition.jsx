import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import styles from './CurtainTransition.module.css';

/**
 * EDGE CURVE PRESETS
 *
 * edgeCurve controls the shape of the leading edge of each curtain panel.
 * Each preset is a factory:  (W: number) => (nx: number) => number
 *   W  : screen width in px (used for responsive logic inside presets)
 *   nx : normalised x position [0, 1]  — 0 = left edge, 1 = right edge
 *   return: y-offset multiplier applied to vDepth at that x position
 *           Negative → edge bows in direction of travel  |  0 → straight  |  Positive → bows against
 *
 * Preset names (pass as string to `edgeCurve` prop):
 *   'gaussian'       – responsive bell curve, centre leads (default)
 *   'arc'            – parabolic arc, clean and symmetric
 *   'sine'           – half sine period, softer than arc
 *   'wave'           – full sine wave, flowing/organic
 *   'straight'       – no curve, flat wipe
 *   'cubicIn'        – asymmetric cubic, deepens left→right
 *   'cubicSymmetric' – symmetric cubic, more angular than arc
 *
 * Custom function:
 *   edgeCurve={(nx) => Math.sin(nx * Math.PI * 2) * -0.8}
 *   edgeCurve={(nx) => -(nx ** 3 + nx ** 2) * 0.6}
 *
 * ---
 *
 * CurtainTransition props:
 *
 * @prop {function}             onComplete     Called when the animation finishes.
 * @prop {'toTop'|'toBottom'}   direction      Which way the curtain travels. Default: 'toTop'.
 * @prop {string|function}      edgeCurve      Shape of the leading edge. Preset name or
 *                                             custom (nx: 0→1) => number. Default: 'gaussian'.
 * @prop {Array}                layers         Layer descriptors rendered back→front (index 0 = back).
 *   layer shape:
 *   {
 *     color : string  — hex/rgb ('#276bff') or CSS var name ('--accent'). Required.
 *     depth : number  — warp depth as 0→1 fraction of screen height. Default: 0.6.
 *     delay : number  — ms offset from animation start. Default: 0.
 *                       Layers with larger delay start later and lag behind leading layers.
 *   }
 * @prop {boolean}              spinner        Show the loading spinner. Default: true.
 * @prop {object}               spinnerProps   All keys optional (merged with defaults):
 *   {
 *     mode       : 'follow' | 'fixed'
 *                  'follow' – spinner rides the edge of the most-lagging layer (largest delay).
 *                  'fixed'  – spinner stays at a fixed screen position.
 *     position   : 'center' | 'top' | 'bottom' | [x, y]
 *                  Only used when mode='fixed'. [x, y] are absolute px coordinates.
 *     offset     : number (px)
 *                  'follow': distance from the layer's leading edge.
 *                  'fixed' : distance from the position anchor.
 *                  Default: responsive — 28px desktop, 24px tablet, 0px mobile.
 *     size       : number  – spinner arc radius in px. Default: 24.
 *     stroke     : number  – stroke width in px. Default: 5.
 *     edgeOffset : number  – multiplier on the lagging layer's normalised time t.
 *                  Values slightly above 1.0 push the spinner just ahead of the edge.
 *                  Default: 1.05.
 *   }
 */

export const EDGE_CURVES = {
  gaussian: (W) => (nx) => {
    const CURVATURE = W >= 1023 ? -0.25 : W >= 576 ? 0.5 : 0.4;
    const BELL_WIDTH = W >= 1023 ? 3 : W >= 576 ? 2 : 1.5;
    return -1.25 + CURVATURE * Math.exp(-Math.pow((nx - 0.5) * BELL_WIDTH, 2));
  },
  arc: () => (nx) => -1.5 * 4 * nx * (1 - nx),
  sine: () => (nx) => -1.5 * Math.sin(nx * Math.PI),
  wave: () => (nx) => -0.8 * Math.sin(nx * Math.PI * 2),
  straight: () => () => 0,
  cubicIn: () => (nx) => -(nx * nx * nx) * 1.5,
  cubicSymmetric: () => (nx) => {
    const c = nx - 0.5;
    return -1.5 * (1 - 4 * c * c) * Math.abs(1 - 4 * c * c);
  },
};

const resolveColor = (value, cs) => {
  if (!value) return null;
  if (value.startsWith('--')) return cs.getPropertyValue(value).trim();
  return value;
};

const resolveCurve = (edgeCurve, W) => {
  if (typeof edgeCurve === 'function') return edgeCurve;
  const preset = EDGE_CURVES[edgeCurve];
  if (!preset) {
    console.warn(`CurtainTransition: unknown edgeCurve preset "${edgeCurve}", falling back to "gaussian"`);
    return EDGE_CURVES.gaussian(W);
  }
  return preset(W);
};

const DEFAULT_LAYERS = [
  { color: '--accent2', depth: 1.0, delay: 0 },
  { color: '--accent', depth: 0.85, delay: 105 },
  { color: '--accent2', depth: 0.6, delay: 150 },
];

const DEFAULT_SPINNER_PROPS = {
  mode: 'follow',
  position: 'center',
  offset: null,
  size: 24,
  stroke: 5,
  edgeOffset: 1.05,
};

export default function CurtainTransition({
  onComplete,
  direction = 'toTop',
  edgeCurve = 'gaussian',
  layers = DEFAULT_LAYERS,
  spinner = true,
  spinnerProps = {},
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const W = Math.min(window.innerWidth, document.documentElement.clientWidth);
    const H = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    const DURATION = 2500;
    const STEPS = 60;
    const RISE_FRACTION = 0.5;
    const RISE_START_OFFSET = 400;
    const RISE_END_OFFSET = 120;
    const WARP_BUILD_FRACTION = 0.6;
    const WARP_DISSOLVE_START = 0.44;
    const WARP_DISSOLVE_DURATION = 0.32;

    const sp = { ...DEFAULT_SPINNER_PROPS, ...spinnerProps };

    const SPINNER_RADIUS = sp.size;
    const SPINNER_STROKE = sp.stroke;
    const SPINNER_ARC_FRAC = 0.28;
    const SPINNER_SPEED = 1.1;
    const SPINNER_EDGE_OFFSET = sp.edgeOffset;
    const SPINNER_OFFSET = sp.offset !== null
      ? sp.offset
      : (W >= 1023 ? 28 : W >= 576 ? 24 : 0);
    const SPINNER_FADE_OUT_START = 0.68;
    const SPINNER_FADE_DURATION = 0.12;

    const easeRise = gsap.parseEase('power2.in');
    const easeWarpIn = gsap.parseEase('power4.out');
    const easeWarpOut = gsap.parseEase('power2.in');

    const cs = getComputedStyle(document.documentElement);
    const spinnerColor = cs.getPropertyValue('--bg').trim() || '#ffffff';
    const spinnerColorDim = cs.getPropertyValue('--surface').trim() || '#a4a4ca';

    const resolvedLayers = layers.map((layer, i) => ({
      ...layer,
      depth: layer.depth ?? 0.6,
      delay: layer.delay ?? 0,
      fillColor: resolveColor(layer.color, cs) || (i % 2 === 0 ? '#00ffcc' : '#276bff'),
    }));

    const lagIndex = resolvedLayers.reduce(
      (maxIdx, layer, i, arr) => layer.delay >= arr[maxIdx].delay ? i : maxIdx,
      0
    );

    const curveFn = resolveCurve(edgeCurve, W);
    const bellLUT = new Float32Array(STEPS + 1);
    for (let i = 0; i <= STEPS; i++) bellLUT[i] = curveFn(i / STEPS);

    const getPanelShape = (t, depth) => {
      const riseProgress = easeRise(Math.min(t / RISE_FRACTION, 1));

      const panelBottom = direction === 'toTop'
        ? H + RISE_START_OFFSET - riseProgress * (H + RISE_START_OFFSET + RISE_END_OFFSET)
        : -RISE_START_OFFSET + riseProgress * (H + RISE_START_OFFSET + RISE_END_OFFSET);

      const warpBuild = easeWarpIn(Math.min(t / WARP_BUILD_FRACTION, 1));
      const warpDissolve = easeWarpOut(Math.max(0, (t - WARP_DISSOLVE_START) / WARP_DISSOLVE_DURATION));
      const vDepth = warpBuild * (1 - warpDissolve) * (depth * H) * 0.5;

      return { panelBottom, vDepth };
    };

    const drawLayer = (t, fillColor, depth) => {
      const { panelBottom, vDepth } = getPanelShape(t, depth);

      ctx.beginPath();

      if (direction === 'toTop') {
        ctx.moveTo(0, H + RISE_START_OFFSET);
        ctx.lineTo(W, H + RISE_START_OFFSET);
        ctx.lineTo(W, 0.9 * (panelBottom - vDepth * (1 - bellLUT[STEPS])));
        for (let i = STEPS - 1; i >= 0; i--)
          ctx.lineTo((i / STEPS) * W, 0.9 * (panelBottom - vDepth * (1 - bellLUT[i])));
      } else {
        ctx.moveTo(0, -RISE_START_OFFSET);
        ctx.lineTo(W, -RISE_START_OFFSET);
        ctx.lineTo(W, panelBottom + vDepth * (1 - bellLUT[STEPS]));
        for (let i = STEPS - 1; i >= 0; i--)
          ctx.lineTo((i / STEPS) * W, panelBottom + vDepth * (1 - bellLUT[i]));
      }

      ctx.closePath();
      ctx.fillStyle = fillColor;
      ctx.fill();
    };

    const drawSpinner = (tLag, elapsed, opacity) => {
      if (!spinner || opacity <= 0) return;

      let cx, cy;

      if (sp.mode === 'follow') {
        const { panelBottom, vDepth } = getPanelShape(tLag, resolvedLayers[lagIndex].depth);
        const bellAtCenter = bellLUT[Math.round(STEPS / 2)];

        const edgeY = direction === 'toTop'
          ? 0.9 * (panelBottom - vDepth * (1 - bellAtCenter))
          : panelBottom + vDepth * (1 - bellAtCenter);

        cx = W / 2;
        cy = direction === 'toTop'
          ? edgeY + SPINNER_RADIUS + SPINNER_OFFSET
          : edgeY - SPINNER_RADIUS - SPINNER_OFFSET;

        if (direction === 'toTop' && cy + SPINNER_RADIUS < 0) return;
        if (direction === 'toBottom' && cy - SPINNER_RADIUS > H) return;
      } else {
        const pos = sp.position;
        if (Array.isArray(pos)) {
          [cx, cy] = pos;
        } else if (pos === 'top') {
          cx = W / 2;
          cy = SPINNER_OFFSET + SPINNER_RADIUS;
        } else if (pos === 'bottom') {
          cx = W / 2;
          cy = H - SPINNER_OFFSET - SPINNER_RADIUS;
        } else {
          cx = W / 2;
          cy = H / 2;
        }
      }

      const rotation = (elapsed / 1000) * SPINNER_SPEED * Math.PI * 2;
      const arcLen = SPINNER_ARC_FRAC * Math.PI * 2;

      ctx.save();

      ctx.beginPath();
      ctx.arc(cx, cy, SPINNER_RADIUS, 0, Math.PI * 2);
      ctx.strokeStyle = spinnerColorDim;
      ctx.lineWidth = SPINNER_STROKE - 1;
      ctx.globalAlpha = opacity * 0.25;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx, cy, SPINNER_RADIUS, rotation, rotation + arcLen);
      ctx.strokeStyle = spinnerColor;
      ctx.lineWidth = SPINNER_STROKE;
      ctx.lineCap = 'round';
      ctx.globalAlpha = opacity;
      ctx.stroke();

      ctx.restore();
    };

    let startTime = null;
    let rafId;

    const draw = (ts) => {
      if (!startTime) startTime = ts;
      const elapsed = ts - startTime;
      const globalT = elapsed / DURATION;

      ctx.clearRect(0, 0, W, H);

      const layerTs = resolvedLayers.map(({ delay }) =>
        Math.min(Math.max(elapsed - delay, 0) / DURATION, 1)
      );

      resolvedLayers.forEach(({ fillColor, depth }, i) => {
        drawLayer(layerTs[i], fillColor, depth);
      });

      const tLag = Math.min(layerTs[lagIndex] * SPINNER_EDGE_OFFSET, 1);
      const fadeProgress = Math.max(0, (globalT - SPINNER_FADE_OUT_START) / SPINNER_FADE_DURATION);
      const spinnerOpacity = Math.max(0, 1 - fadeProgress);
      drawSpinner(tLag, elapsed, spinnerOpacity);

      const leadIndex = resolvedLayers.reduce(
        (minIdx, layer, i, arr) => layer.delay < arr[minIdx].delay ? i : minIdx,
        0
      );

      if (layerTs[leadIndex] < 0.9) {
        rafId = requestAnimationFrame(draw);
      } else {
        ctx.clearRect(0, 0, W, H);
        onComplete?.();
      }
    };

    rafId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafId);
  }, [direction, edgeCurve, layers, spinner, spinnerProps]);

  return <canvas ref={canvasRef} className={styles.curtain} />;
}