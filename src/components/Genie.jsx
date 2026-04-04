import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';

const DURATION = 2000;
const isMobile = window.innerWidth <= 1;
const EASE_RISE = gsap.parseEase(isMobile ? 'power1.in' : 'power2.out');
const EASE_TOP_W = gsap.parseEase('power1.inOut');
const EASE_BOT_W = gsap.parseEase(isMobile ? 'expo.in' : 'power1.in');
const SLICES = 20;
const CONCAVE_DEPTH = isMobile ? -0.6 : 0.6;
const CORNER_RADIUS_PX = isMobile ? 0 : 6;
const LAG_FRACTION = 0.1;
const LAYER2_SPREAD = 1.1;
const STRIP_H = 2;

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
      const WARP_STRENGTH = 0.25;
      const WARP_WIDTH = 1.5;
      const waistCenter = 1 - t * 1.5;
      const warpFade = Math.max(0, 1 - t * 1.4);
      const squeeze = WARP_STRENGTH * warpFade
        * v < waistCenter
        ? Math.exp(-Math.pow((v - waistCenter) * WARP_WIDTH * 2, 2))
        : Math.exp(-Math.pow((v - waistCenter) * WARP_WIDTH * 2, 2));
      return 1 + 0.3 * squeeze;
    };

    const fontSize = Math.round(W * 0.075);
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
        leftPts.push({ x: originX - warpedHW, y });
        rightPts.push({ x: originX + warpedHW, y });
      }

      const minHalfEdge = Math.min(topHW, botHW, shapeH / 2);
      const cornerPx = Math.min(CORNER_RADIUS_PX * (1 - t), minHalfEdge * 0.45);
      const concavePx = topHW * CONCAVE_DEPTH * (1 - t);

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
      ctx.fillStyle = fillColor;
      ctx.fill();

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

        for (let row = 0; row < textH; row += STRIP_H) {
          const screenY = destY + row;
          if (screenY < 0 || screenY > H) continue;

          const v = (screenY - topY) / shapeH;
          const clampedV = Math.max(0, Math.min(1, v));
          const rowWarp = warpFn(clampedV, tText);
          const warpedTextW = textW * rowWarp;
          if (warpedTextW < 1) continue;

          ctx.drawImage(
            textCanvas,
            0, row, textW, STRIP_H,
            originX - warpedTextW / 2, screenY, warpedTextW, STRIP_H,
          );
        }
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