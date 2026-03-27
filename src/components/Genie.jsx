import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const DURATION = 2000;
const isMobile = window.innerWidth <= 768;
const EASE_RISE = gsap.parseEase(isMobile ? 'power1.in' : 'power1.out');
const EASE_TOP_W = gsap.parseEase('power1.inOut');
const EASE_BOT_W = gsap.parseEase(isMobile ? 'expo.in' : 'power1.in');
const SLICES = 60;
const CONCAVE_DEPTH = isMobile ? -0.6 : 0.6;
const CORNER_RADIUS_PX = isMobile ? 0: 6;
const LAG_FRACTION = 0.1;
const LAYER2_SPREAD = 1.1;

export default function Genie({ anchorRef, color, onComplete, label = 'HOME' }) {

  const canvasRef = useRef(null);

  useEffect(() => {
    let startTime = null;
    let rafId;

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

    const cs = getComputedStyle(document.documentElement);
    const fillColor = color || cs.getPropertyValue('--accent').trim() || '#276bff';
    const fillColor2 = cs.getPropertyValue('--accent2').trim() || '#00ffcc';
    const textColor = cs.getPropertyValue('--bg').trim() || '#080810';
    const fontFamily = cs.getPropertyValue('--display').trim() || 'Impact';

    let originX = W / 2;
    let originY = H;

    if (anchorRef?.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      originX = rect.left + rect.width / 2;
      originY = rect.top + rect.height / 2;
    }

    const warpFn = (v, t) => {
      const WARP_STRENGTH = 0.25;
      const WARP_WIDTH = 1;

      const waistCenter = 0.25 - t * 0.5;
      const warpFade = Math.max(0, 1 - t * 1.4);
      const squeeze = WARP_STRENGTH * warpFade
        * v < waistCenter
        ? Math.exp(-Math.pow((v - waistCenter) * WARP_WIDTH * 2.5, 2))
        : Math.exp(-Math.pow((v - waistCenter) * WARP_WIDTH * 2.5, 2))
      return 1 + squeeze;
    };

    const funnelFn = (v, t) => {
      const neckPos = 0.5;
      const neckWidth = 0.12;
      const spoutFlare = 0.9;
      const sharpness = 2.5;
      const fade = Math.max(0, 1 - t * 1.4);

      const blend = 1 / (1 + Math.exp(-(v - neckPos) * 100)); 

      const taperP = v / neckPos;
      const taper = 1 - (1 - neckWidth) * Math.pow(Math.min(taperP, 1), sharpness);

      const flareP = (v - neckPos) / (1 - neckPos);
      const flare = neckWidth + spoutFlare * Math.max(flareP, 0);

      const width = taper * (1 - blend) + flare * blend;

      const concavity = CONCAVE_DEPTH * (1 - t) * Math.exp(-v * 8);

      return (1 - (1 - width) * fade) - concavity;
    };

    const fontSize = Math.round(W * 0.1);
    const textCanvas = document.createElement('canvas');
    const textCtx = textCanvas.getContext('2d');
    textCtx.font = `400 ${fontSize}px ${fontFamily}`;
    const measured = textCtx.measureText(label).width;
    const textW = Math.ceil(measured * 1.5) + 128;
    const textH = Math.ceil(fontSize * 1.6);

    textCanvas.width = textW;
    textCanvas.height = textH;

    textCtx.clearRect(0, 0, textW, textH);
    textCtx.font = `400 ${fontSize}px ${fontFamily}`;
    textCtx.letterSpacing = '4px';
    textCtx.fillStyle = textColor;
    textCtx.textAlign = 'center';
    textCtx.textBaseline = 'middle';
    textCtx.fillText(label, textW / 2, textH / 2);

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
      ctx.quadraticCurveTo(topMidX, topMidY, arcTR_start.x, arcTR_start.y);
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

    const draw = (elapsed) => {
      ctx.clearRect(0, 0, W, H);
      const t = Math.min(elapsed / DURATION, 1);

      const topY = originY - (originY + H * 0.03) * EASE_RISE(t);
      const topHW = (W / 2) * EASE_TOP_W(t);
      const botY = originY + (H - originY) * EASE_RISE(Math.pow(t, 2.5));
      const botHW = (W / 2) * EASE_BOT_W(t);
      const shapeH = botY - topY;
      if (shapeH <= 0) return;

      const leftPts = [];
      const rightPts = [];
      for (let i = 0; i <= SLICES; i++) {
        const v = i / SLICES;
        const y = topY + shapeH * v;
        const hw = topHW + (botHW - topHW) * v;
        const warpedHW = hw * warpFn(v, t);
        // const warpedHW = hw * funnelFn(v, t);
        leftPts.push({ x: originX - warpedHW, y });
        rightPts.push({ x: originX + warpedHW, y });
      }

      const minHalfEdge = Math.min(topHW, botHW, shapeH / 2);
      const cornerPx = Math.min(CORNER_RADIUS_PX * (1 - t), minHalfEdge * 0.45);
      const concavePx = topHW * CONCAVE_DEPTH * (1 - t);

      const t2 = t;

      if (t2 > 0) {
        const topY2 = originY - (originY + H * 0.03) * EASE_RISE(t2);
        const topHW2 = (W / 2) * EASE_TOP_W(t2) * LAYER2_SPREAD;
        const botY2 = originY + (H - originY) * EASE_RISE(Math.pow(t2, 2.5));
        const botHW2 = (W / 2) * EASE_BOT_W(t2) * LAYER2_SPREAD;
        const shapeH2 = botY2 - topY2;

        if (shapeH2 > 0) {
          const leftPts2 = [];
          const rightPts2 = [];
          for (let i = 0; i <= SLICES; i++) {
            const v = i / SLICES;
            const y = topY2 + shapeH2 * v;
            const hw = topHW2 + (botHW2 - topHW2) * v;
            const warpedHW = hw * warpFn(v, t2);
            // const warpedHW = hw * funnelFn(v, t2);
            leftPts2.push({ x: originX - warpedHW, y });
            rightPts2.push({ x: originX + warpedHW, y });
          }
          const minHalfEdge2 = Math.min(topHW2, botHW2, shapeH2 / 2);
          const cornerPx2 = Math.min(CORNER_RADIUS_PX * (1 - t2), minHalfEdge2 * 0.45);
          const concavePx2 = topHW2 * CONCAVE_DEPTH * (1 - t2);

          ctx.save();
          ctx.globalAlpha = 1;
          buildPath(leftPts2, rightPts2, cornerPx2, concavePx2);
          ctx.fillStyle = fillColor2;
          ctx.fill();
          ctx.restore();
        }
      }

      ctx.save();
      ctx.globalAlpha = 1;
      buildPath(leftPts, rightPts, cornerPx, concavePx);
      ctx.fillStyle = fillColor;
      ctx.fill();
      ctx.restore();

      if (t >= 1) {
        ctx.globalAlpha = 1;
        ctx.fillStyle = fillColor;
        ctx.fillRect(0, 0, W, H);
        return;
      }

      const fadeInSpeed = 1.5;
      const fadeOutStart = 0.95;
      const fadeOutDur = 0.05;

      const textOpacity = Math.min(t * fadeInSpeed, 1)
        * Math.max(0, 1 - (t - fadeOutStart) / fadeOutDur);
      if (textOpacity <= 0) return;

      const visibleTop = Math.max(topY, 0);
      const visibleBot = Math.min(botY, H);
      const visibleCenterY = (visibleTop + visibleBot) / 2;
      const destY = visibleCenterY - textH / 2;

      ctx.save();

      if (t < 0.98) {
        buildPath(leftPts, rightPts, cornerPx, concavePx);
        ctx.clip();
      }

      ctx.globalAlpha = textOpacity;

      for (let row = 0; row < textH; row++) {
        const screenY = destY + row;
        if (screenY < 0 || screenY > H) continue;

        const v = (screenY - topY) / shapeH;
        const clampedV = Math.max(0, Math.min(1, v));
        const rowWarp = warpFn(clampedV, t);
        // const rowWarp = funnelFn(clampedV, t);
        const warpedTextW = textW * rowWarp;

        if (warpedTextW < 1) continue;

        ctx.drawImage(
          textCanvas,
          0, row, textW, 1,
          originX - warpedTextW / 2, screenY, warpedTextW, 1,
        );
      }

      ctx.restore();
    };

    const tick = (ts) => {
      if (!startTime) startTime = ts;
      const elapsed = ts - startTime;
      draw(elapsed);
      if (elapsed < DURATION) {
        rafId = requestAnimationFrame(tick);
      } else {
        onComplete?.();
      }
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'fixed', inset: 0, zIndex: 6000, pointerEvents: 'none' }}
    />
  );
} 