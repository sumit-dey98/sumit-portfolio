import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';

const DURATION = 2000;
const isMobile = window.innerWidth <= 1023;

// Swap this to try each mobile rise: 'snappy' | 'elastic' | 'glide'
const MOBILE_RISE = 'glide';
const MOBILE_RISE_EASES = {
  snappy: 'expo.out',
  elastic: 'back.out(1.4)',
  glide: 'sine.out',
};

const EASE_RISE = gsap.parseEase(isMobile ? MOBILE_RISE_EASES[MOBILE_RISE] : 'power2.out');
const EASE_TOP_W = gsap.parseEase('power1.inOut');
const EASE_BOT_W = gsap.parseEase(isMobile ? 'power1.in' : 'power1.in');
const SLICES = 20;
const CONCAVE_DEPTH = isMobile ? -0.6 : 0.6;
const CORNER_RADIUS_PX = isMobile ? 0 : 6;
const LAG_FRACTION = 0.1;
const LAYER2_SPREAD = 1.1;
const STRIP_H = 2;

// Effect 1 - Liquid & light: gradient fill, moving specular band, neon glow edge.
const LIQUID_LIGHT = false;
// Rippling top edge so the leading surface reads as liquid, not a flat bar.
const WAVE_EDGE = false;
const WAVE_SEGMENTS = 24;
const WAVE_COUNT = 2.5;        // ripples across the width
const WAVE_AMP_FRAC = 0.05;    // amplitude as a fraction of shape height

// Effect 2 - Livelier motion: trailing droplets behind the neck + elastic settle.
const LIVELIER_MOTION = false;
const DROPLET_COUNT = 3;

// Effect 3 - Fancier text: RGB-split glitch on the label near the end.
const TEXT_GLITCH = false;

// Effect 4 - Particle finish: the filled screen shatters into particles that
// scatter as the content is handed off.
const PARTICLE_FINISH = false;
const PARTICLE_DURATION = 650;                 // ms, runs after the main fill
const PARTICLE_COUNT = isMobile ? 90 : 180;

export default function Genie({ anchorRef, color, onComplete, label1 = "LET'S GET", label2 = "STARTED" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const _cs = getComputedStyle(document.documentElement);
    const CSS_ACCENT = _cs.getPropertyValue('--accent').trim();
    const CSS_ACCENT2 = _cs.getPropertyValue('--accent2').trim();
    const CSS_BG = _cs.getPropertyValue('--bg').trim() || '#080810';
    const CSS_DISPLAY = _cs.getPropertyValue('--display').trim() || 'Impact';
    
    let startTime = null;
    let rafId;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const W = document.documentElement.clientWidth;
    const H = document.documentElement.clientHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.top = '0px';
    canvas.style.left = '0px';
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    const fillColor = color || CSS_ACCENT || '#276bff';
    const fillColor2 = CSS_ACCENT2;
    const textColor = CSS_BG;
    const fontFamily = CSS_DISPLAY;

    let originX = W / 2;
    let originY = H;

    if (anchorRef?.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      originX = rect.left + rect.width / 2;
      originY = rect.top + rect.height / 2;
    }

    const warpFn = (v, t) => {
      // A pinched "waist" (Gaussian dip) that travels up the shape as it rises,
      // strongest early and fading as the shape fills. Returns a width
      // multiplier < 1 at the waist so the sides deform inward like liquid.
      const WAIST_DEPTH = 0.55;   // how hard the sides pinch (0..1)
      const WAIST_WIDTH = 2.2;    // higher = tighter/narrower waist band
      const waistCenter = 1 - t * 1.4;               // travels from base -> top
      const fade = Math.max(0, 1 - t * 1.3);         // relaxes as it fills
      const gaussian = Math.exp(-Math.pow((v - waistCenter) * WAIST_WIDTH, 2));
      return 1 - WAIST_DEPTH * fade * gaussian;
    };

    const fontSize = Math.round(W * (isMobile ? 0.14 : 0.075));
    const textCanvas = document.createElement('canvas');
    const textCtx = textCanvas.getContext('2d');
    textCtx.font = `400 ${fontSize}px ${fontFamily}`;

    const measured = textCtx.measureText(label1).width;
    const textW = Math.ceil(measured * 1.5) + 128;
    const textH = Math.ceil(fontSize * 1.6 * 2);

    textCanvas.width = textW;
    textCanvas.height = textH;

    textCtx.font = `400 ${fontSize}px ${fontFamily}`;
    textCtx.letterSpacing = '4px';
    textCtx.fillStyle = textColor;
    textCtx.textAlign = 'center';
    textCtx.textBaseline = 'middle';

    if (label2?.trim()) {
      const lineHeight = fontSize * 1.2;
      const totalTextH = lineHeight * 2;
      const startY = (textH - totalTextH) / 2 + lineHeight / 2;
      textCtx.fillText(label1, textW / 2, startY);
      textCtx.fillText(label2, textW / 2, startY + lineHeight);
    } else {
      textCtx.fillText(label1, textW / 2, textH / 2);
    }

    // Pre-tinted copies of the text bitmap for the RGB-split glitch (Effect 3).
    // source-in recolors the glyph pixels while preserving their alpha mask.
    const makeTinted = (tint) => {
      const c = document.createElement('canvas');
      c.width = textW;
      c.height = textH;
      const cx = c.getContext('2d');
      cx.drawImage(textCanvas, 0, 0);
      cx.globalCompositeOperation = 'source-in';
      cx.fillStyle = tint;
      cx.fillRect(0, 0, textW, textH);
      return c;
    };
    const textCanvasMag = TEXT_GLITCH ? makeTinted('#ff0040') : null;
    const textCanvasCyan = TEXT_GLITCH ? makeTinted('#00e5ff') : null;

    // Set by draw() before each buildPath call to ripple the top edge.
    let waveAmp = 0;
    let wavePhase = 0;

    const buildPath = (leftPts, rightPts, cornerPx, concavePx) => {
      const TL = leftPts[0];
      const TR = rightPts[0];
      const BL = leftPts[leftPts.length - 1];
      const BR = rightPts[rightPts.length - 1];

      const leftDx = leftPts[0].x - leftPts[1].x;
      const leftDy = leftPts[0].y - leftPts[1].y;
      const leftLen = Math.hypot(leftDx, leftDy) || 1;
      const leftNx = leftDx / leftLen;
      const leftNy = leftDy / leftLen;

      const rightDx = rightPts[1].x - rightPts[0].x;
      const rightDy = rightPts[1].y - rightPts[0].y;
      const rightLen = Math.hypot(rightDx, rightDy) || 1;
      const rightNx = rightDx / rightLen;
      const rightNy = rightDy / rightLen;

      const topEdgeDx = TR.x - TL.x;
      const topEdgeDy = TR.y - TL.y;
      const topEdgeLen = Math.hypot(topEdgeDx, topEdgeDy) || 1;
      const topEdgeNx = topEdgeDx / topEdgeLen;
      const topEdgeNy = topEdgeDy / topEdgeLen;

      const rBotDx = BR.x - rightPts[rightPts.length - 2].x;
      const rBotDy = BR.y - rightPts[rightPts.length - 2].y;
      const rBotLen = Math.hypot(rBotDx, rBotDy) || 1;
      const rBotNx = rBotDx / rBotLen;
      const rBotNy = rBotDy / rBotLen;

      const botEdgeDx = BL.x - BR.x;
      const botEdgeDy = BL.y - BR.y;
      const botEdgeLen = Math.hypot(botEdgeDx, botEdgeDy) || 1;
      const botEdgeNx = botEdgeDx / botEdgeLen;
      const botEdgeNy = botEdgeDy / botEdgeLen;

      const lBotDx = leftPts[leftPts.length - 2].x - BL.x;
      const lBotDy = leftPts[leftPts.length - 2].y - BL.y;
      const lBotLen = Math.hypot(lBotDx, lBotDy) || 1;
      const lBotNx = lBotDx / lBotLen;
      const lBotNy = lBotDy / lBotLen;

      const arcTL_start = { x: TL.x - leftNx * cornerPx, y: TL.y - leftNy * cornerPx };
      const arcTL_end = { x: TL.x + topEdgeNx * cornerPx, y: TL.y + topEdgeNy * cornerPx };

      const arcTR_start = { x: TR.x - topEdgeNx * cornerPx, y: TR.y - topEdgeNy * cornerPx };
      const arcTR_end = { x: TR.x + rightNx * cornerPx, y: TR.y + rightNy * cornerPx };

      const arcBR_start = { x: BR.x - rBotNx * cornerPx, y: BR.y - rBotNy * cornerPx };
      const arcBR_end = { x: BR.x + botEdgeNx * cornerPx, y: BR.y + botEdgeNy * cornerPx };

      const arcBL_start = { x: BL.x - botEdgeNx * cornerPx, y: BL.y - botEdgeNy * cornerPx };
      const arcBL_end = { x: BL.x + lBotNx * cornerPx, y: BL.y + lBotNy * cornerPx };

      const topMidX = (arcTL_end.x + arcTR_start.x) / 2;
      const topMidY = (arcTL_end.y + arcTR_start.y) / 2 + concavePx;

      ctx.beginPath();

      ctx.moveTo(arcTL_start.x, arcTL_start.y);
      ctx.quadraticCurveTo(TL.x, TL.y, arcTL_end.x, arcTL_end.y);

      if (waveAmp > 0.5) {
        // Rippling top edge: sine wave between the two top corners, with a
        // baseline concave dip preserved via the midpoint offset.
        const ax = arcTL_end.x, ay = arcTL_end.y;
        const bx = arcTR_start.x, by = arcTR_start.y;
        for (let s = 1; s <= WAVE_SEGMENTS; s++) {
          const f = s / WAVE_SEGMENTS;
          const x = ax + (bx - ax) * f;
          const baseY = ay + (by - ay) * f;
          // envelope: 0 at both corners, 1 in the middle (keeps ends anchored)
          const env = Math.sin(f * Math.PI);
          const ripple = Math.sin(f * Math.PI * 2 * WAVE_COUNT + wavePhase) * waveAmp * env;
          const dip = concavePx * env; // fold the old concave dip into the edge
          ctx.lineTo(x, baseY + ripple + dip);
        }
      } else {
        ctx.quadraticCurveTo(topMidX, topMidY, arcTR_start.x, arcTR_start.y);
      }

      ctx.quadraticCurveTo(TR.x, TR.y, arcTR_end.x, arcTR_end.y);

      for (let i = 0; i < rightPts.length - 3; i++) {
        const curr = rightPts[i], next = rightPts[i + 1];
        ctx.quadraticCurveTo(curr.x, curr.y, (curr.x + next.x) / 2, (curr.y + next.y) / 2);
      }
      const rLast = rightPts[rightPts.length - 2];
      ctx.quadraticCurveTo(rLast.x, rLast.y, arcBR_start.x, arcBR_start.y);

      ctx.quadraticCurveTo(BR.x, BR.y, arcBR_end.x, arcBR_end.y);
      ctx.lineTo(arcBL_start.x, arcBL_start.y);
      ctx.quadraticCurveTo(BL.x, BL.y, arcBL_end.x, arcBL_end.y);

      for (let i = leftPts.length - 2; i > 1; i--) {
        const curr = leftPts[i], next = leftPts[i - 1];
        ctx.quadraticCurveTo(curr.x, curr.y, (curr.x + next.x) / 2, (curr.y + next.y) / 2);
      }
      const lFirst = leftPts[1];
      ctx.quadraticCurveTo(lFirst.x, lFirst.y, arcTL_start.x, arcTL_start.y);

      ctx.closePath();
    };

    // Resolve any CSS color string to [r,g,b] via the canvas, then scale toward
    // white (amount > 0) or black (amount < 0).
    const _rgbCache = {};
    const toRGB = (col) => {
      if (_rgbCache[col]) return _rgbCache[col];
      ctx.save();
      ctx.fillStyle = '#000';
      ctx.fillStyle = col;
      const resolved = ctx.fillStyle; // normalized to #rrggbb or rgba(...)
      ctx.restore();
      let rgb = [39, 107, 255];
      if (resolved[0] === '#') {
        const h = resolved.slice(1);
        const n = h.length === 3
          ? h.split('').map((c) => parseInt(c + c, 16))
          : [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
        rgb = n;
      } else {
        const m = resolved.match(/[\d.]+/g);
        if (m) rgb = [Number(m[0]), Number(m[1]), Number(m[2])];
      }
      _rgbCache[col] = rgb;
      return rgb;
    };
    const mix = (col, amount) => {
      const [r, g, b] = toRGB(col);
      const target = amount >= 0 ? 255 : 0;
      const a = Math.abs(amount);
      const c = (x) => Math.round(x + (target - x) * a);
      return `rgb(${c(r)}, ${c(g)}, ${c(b)})`;
    };
    const lightenColor = (col, amount) => mix(col, amount);
    const darkenColor = (col, amount) => mix(col, -amount);

    const draw = (elapsed) => {
      ctx.clearRect(0, 0, W, H);
      const t = Math.min(elapsed / DURATION, 1);

      // Elastic settle: a damped-sine width wobble that ramps in over the last
      // ~25% of the animation, so the shape "lands" instead of stopping dead.
      let settle = 1;
      if (LIVELIER_MOTION && t > 0.75) {
        const s = (t - 0.75) / 0.25;          // 0..1 across the settle window
        settle = 1 + Math.sin(s * Math.PI * 3) * 0.06 * (1 - s);
      }

      const topY = originY - (originY + H * 0.03) * EASE_RISE(t);
      const topHW = (W / 2) * EASE_TOP_W(t) * settle;
      const botY = originY + (H - originY) * EASE_RISE(Math.pow(t, 2.5));
      const botHW = (W / 2) * EASE_BOT_W(t) * settle;
      const shapeH = botY - topY;
      if (shapeH <= 0) return;

      // Rippling top edge, strongest mid-rise and relaxing to flat as it fills.
      waveAmp = WAVE_EDGE ? shapeH * WAVE_AMP_FRAC * Math.max(0, 1 - t * 1.2) : 0;
      wavePhase = elapsed * 0.006;

      const leftPts = [];
      const rightPts = [];
      for (let i = 0; i <= SLICES; i++) {
        const v = i / SLICES;
        const y = topY + shapeH * v;
        const hw = topHW + (botHW - topHW) * v;
        const warpedHW = hw * warpFn(v, t);
        leftPts.push({ x: originX - warpedHW, y });
        rightPts.push({ x: originX + warpedHW, y });
      }

      const minHalfEdge = Math.min(topHW, botHW, shapeH / 2);
      const cornerPx = Math.min(CORNER_RADIUS_PX * (1 - t), minHalfEdge * 0.45);
      const concavePx = topHW * CONCAVE_DEPTH * (1 - t);

      // Trailing droplets: small blobs that lag above the neck while rising,
      // fading out as the shape approaches full. Drawn first so the neck covers
      // their base.
      if (LIVELIER_MOTION && t > 0.05 && t < 0.9) {
        const dropletFade = Math.min(1, t / 0.2) * Math.max(0, 1 - (t - 0.6) / 0.3);
        ctx.save();
        ctx.fillStyle = fillColor;
        for (let d = 1; d <= DROPLET_COUNT; d++) {
          const lag = LAG_FRACTION * d;
          const dy = topY - shapeH * lag;               // above the neck
          if (dy < -40) continue;
          const r = Math.max(2, topHW * (0.5 / d) * (1 - t));
          ctx.globalAlpha = dropletFade * (1 - d / (DROPLET_COUNT + 1));
          ctx.beginPath();
          ctx.arc(originX, dy, r, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      if (true) {
        const topHW2 = (W / 2) * EASE_TOP_W(t) * LAYER2_SPREAD;
        const botHW2 = (W / 2) * EASE_BOT_W(t) * LAYER2_SPREAD;
        const shapeH2 = botY - topY;

        if (shapeH2 > 0) {
          const leftPts2 = [];
          const rightPts2 = [];
          for (let i = 0; i <= SLICES; i++) {
            const v = i / SLICES;
            const y = topY + shapeH2 * v;
            const hw = topHW2 + (botHW2 - topHW2) * v;
            const warpedHW = hw * warpFn(v, t);
            leftPts2.push({ x: originX - warpedHW, y });
            rightPts2.push({ x: originX + warpedHW, y });
          }
          const minHalfEdge2 = Math.min(topHW2, botHW2, shapeH2 / 2);
          const cornerPx2 = Math.min(CORNER_RADIUS_PX * (1 - t), minHalfEdge2 * 0.45);
          const concavePx2 = topHW2 * CONCAVE_DEPTH * (1 - t);

          ctx.save();
          buildPath(leftPts2, rightPts2, cornerPx2, concavePx2);
          ctx.fillStyle = fillColor2;
          ctx.fill();
          ctx.restore();
        }
      }

      ctx.save();
      buildPath(leftPts, rightPts, cornerPx, concavePx);

      if (LIQUID_LIGHT) {
        // Neon glow edge (fades out as it fills the screen).
        ctx.save();
        ctx.shadowColor = fillColor;
        ctx.shadowBlur = 24 * (1 - t);
        ctx.fillStyle = fillColor;
        ctx.fill();
        ctx.restore();

        // Vertical gradient body: brighter near the neck, base color at the base.
        const grad = ctx.createLinearGradient(0, topY, 0, botY);
        grad.addColorStop(0, lightenColor(fillColor, 0.18));
        grad.addColorStop(0.5, fillColor);
        grad.addColorStop(1, darkenColor(fillColor, 0.12));
        ctx.fillStyle = grad;
        ctx.fill();

        // Moving specular band, clipped to the shape, sweeping top->bottom.
        ctx.save();
        ctx.clip();
        const sweep = topY + shapeH * (t * 1.3 - 0.15);
        const bandH = Math.max(40, shapeH * 0.18);
        const gloss = ctx.createLinearGradient(0, sweep - bandH, 0, sweep + bandH);
        gloss.addColorStop(0, 'rgba(255,255,255,0)');
        gloss.addColorStop(0.5, `rgba(255,255,255,${0.35 * (1 - t)})`);
        gloss.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = gloss;
        ctx.fillRect(originX - W / 2, sweep - bandH, W, bandH * 2);
        ctx.restore();
      } else {
        ctx.fillStyle = fillColor;
        ctx.fill();
      }

      if (t >= 1) {
        ctx.restore();
        ctx.fillStyle = fillColor;
        ctx.fillRect(0, 0, W, H);
        return;
      }

      const fadeInSpeed = 1.5;
      const fadeOutStart = 0.85;
      const fadeOutDur = 0.1;
      const tText = Math.min(t / fadeOutStart, 1);

      const textOpacity = Math.min(tText * fadeInSpeed, 1)
        * Math.max(0, 1 - (t - fadeOutStart) / fadeOutDur);

      if (textOpacity > 0) {
        if (t < 0.98) {
          buildPath(leftPts, rightPts, cornerPx, concavePx);
          ctx.clip();
        }

        ctx.globalAlpha = textOpacity;

        const visibleTop = Math.max(topY, 0);
        const visibleBot = Math.min(botY, H);
        const visibleCenterY = (visibleTop + visibleBot) / 2;
        const destY = visibleCenterY - textH / 2;

        // Glitch ramps in over the last 30% before the text starts fading out.
        const glitchAmt = TEXT_GLITCH
          ? Math.max(0, (tText - 0.7) / 0.3)
          : 0;

        for (let row = 0; row < textH; row += STRIP_H) {
          const screenY = destY + row;
          if (screenY < 0 || screenY > H) continue;

          const v = (screenY - topY) / shapeH;
          const clampedV = Math.max(0, Math.min(1, v));
          const rowWarp = warpFn(clampedV, tText);
          const warpedTextW = textW * rowWarp;
          if (warpedTextW < 1) continue;

          const dx = originX - warpedTextW / 2;

          if (glitchAmt > 0) {
            // Per-row horizontal jitter, scaled by how far the glitch has ramped.
            const jitter = (Math.sin(row * 12.9898 + t * 60) * 0.5 + 0.5);
            const shift = (4 + jitter * 10) * glitchAmt;
            const prevComp = ctx.globalCompositeOperation;
            ctx.globalCompositeOperation = 'lighter';

            ctx.globalAlpha = textOpacity * 0.7 * glitchAmt;
            ctx.drawImage(textCanvasMag, 0, row, textW, STRIP_H,
              dx - shift, screenY, warpedTextW, STRIP_H); // magenta ghost
            ctx.drawImage(textCanvasCyan, 0, row, textW, STRIP_H,
              dx + shift, screenY, warpedTextW, STRIP_H); // cyan ghost

            ctx.globalCompositeOperation = prevComp;
            ctx.globalAlpha = textOpacity;
          }

          ctx.drawImage(
            textCanvas,
            0, row, textW, STRIP_H,
            dx, screenY, warpedTextW, STRIP_H,
          );
        }
      }

      ctx.restore();
    };

    // Build a grid of particles covering the screen, each with an outward
    // velocity (biased away from the origin) so the fill "shatters" apart.
    let particles = null;
    const buildParticles = () => {
      const arr = [];
      const cols = Math.ceil(Math.sqrt(PARTICLE_COUNT * (W / H)));
      const rows = Math.ceil(PARTICLE_COUNT / cols);
      const cw = W / cols;
      const ch = H / rows;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const px = (c + 0.5) * cw;
          const py = (r + 0.5) * ch;
          const ang = Math.atan2(py - originY, px - originX) + (Math.random() - 0.5) * 0.8;
          const spd = (0.6 + Math.random() * 0.9) * Math.max(W, H) * 0.0016;
          arr.push({
            x: px, y: py,
            vx: Math.cos(ang) * spd * (0.5 + Math.random()),
            vy: Math.sin(ang) * spd * (0.5 + Math.random()) - 0.4,
            size: Math.min(cw, ch) * (0.7 + Math.random() * 0.5),
            rot: Math.random() * Math.PI,
            vrot: (Math.random() - 0.5) * 0.3,
          });
        }
      }
      return arr;
    };

    const drawParticles = (pElapsed) => {
      const pt = Math.min(pElapsed / PARTICLE_DURATION, 1);
      ctx.clearRect(0, 0, W, H);
      if (!particles) return;
      const ease = 1 - Math.pow(1 - pt, 2);
      ctx.save();
      ctx.fillStyle = fillColor;
      for (const p of particles) {
        const dist = ease * 260;
        const x = p.x + p.vx * dist;
        const y = p.y + p.vy * dist + ease * ease * 120; // slight gravity
        const s = p.size * (1 - pt * 0.9);
        if (s <= 0.5) continue;
        ctx.globalAlpha = 1 - ease;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(p.rot + p.vrot * pElapsed * 0.05);
        ctx.fillRect(-s / 2, -s / 2, s, s);
        ctx.restore();
      }
      ctx.restore();
    };

    let completed = false;
    let particleStart = null;

    const tick = (ts) => {
      if (!startTime) startTime = ts;
      const elapsed = ts - startTime;

      if (elapsed < DURATION) {
        draw(elapsed);
        rafId = requestAnimationFrame(tick);
        return;
      }

      if (!PARTICLE_FINISH) {
        onComplete?.();
        return;
      }

      // Fill is complete. Hand off to content immediately, raise the canvas
      // above it, and shatter on top.
      if (!completed) {
        completed = true;
        particleStart = ts;
        particles = buildParticles();
        if (canvasRef.current) canvasRef.current.style.zIndex = '9000';
        onComplete?.();
      }

      const pElapsed = ts - particleStart;
      drawParticles(pElapsed);
      if (pElapsed < PARTICLE_DURATION) {
        rafId = requestAnimationFrame(tick);
      } else {
        ctx.clearRect(0, 0, W, H);
      }
    };

    rafId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(rafId);
  }, []);

  const canvas = (
    <canvas
      ref={canvasRef}
      style={{ position: 'fixed', zIndex: 6000, pointerEvents: 'none' }}
    />
  );

  return createPortal(canvas, document.body);
}