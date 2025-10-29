import {
  CANVAS_W,
  CANVAS_H,
  CUSTOM_BG_MAIN,
  CUSTOM_BG_SECOND,
  ONEPIECE_STYLE_CONFIGS,
  ONEPIECE_SCALE_NORMAL,
  ONEPIECE_SCALE_SMALL,
  ONEPIECE_OFFSET_Y_NORMAL,
  ONEPIECE_OFFSET_Y_SMALL,
} from './previewConfig';

const RENDER_SCALE = 2;
const SCALE_BOOST = 1.12;
const FONT_BOOST = 1.08;
const STYLE_HEIGHT_RATIO = 0.58;
const SHADOW_INTENSITY = 1.15;

export async function drawOnePieceNew(ctx, text, variant, useCustomBackground) {
  const baseWidth = CANVAS_W;
  const baseHeight = CANVAS_H;

  const offscreen = document.createElement('canvas');
  offscreen.width = baseWidth * RENDER_SCALE;
  offscreen.height = baseHeight * RENDER_SCALE;
  const offCtx = offscreen.getContext('2d');
  if (!offCtx) return;

  offCtx.save();
  offCtx.scale(RENDER_SCALE, RENDER_SCALE);
  offCtx.clearRect(0, 0, baseWidth, baseHeight);

  if (useCustomBackground) {
    const bg = new Image();
    const txtLen = text.replace(/\s/g, '').length;
    bg.src = txtLen > 6 ? CUSTOM_BG_SECOND : CUSTOM_BG_MAIN;
    await new Promise(r => (bg.onload = r));
    offCtx.save();
    offCtx.setTransform(1, 0, 0, 1, 0, 0);
    offCtx.drawImage(bg, 0, 0, baseWidth, baseHeight);
    offCtx.restore();
  }

  const txt = text.toUpperCase().substring(0, 12);
  await document.fonts.load(`bold ${Math.round(50 * FONT_BOOST)}px ONEPIECE_IL_FINAL`);
  const cfg = ONEPIECE_STYLE_CONFIGS[variant] || ONEPIECE_STYLE_CONFIGS.char1;
  const primaryColor = cfg.defaultSecondaryColor;
  const secondaryColor = cfg.defaultPrimaryColor;
  const maxFontSize = Math.min(450, baseHeight * 0.6) * FONT_BOOST;
  const baseFontSize = txt.length > 11 ? maxFontSize * 0.72 : maxFontSize;
  const fontSize = baseFontSize;

  const off = document.createElement('canvas');
  off.width = baseWidth;
  off.height = baseHeight;
  const drawingCtx = off.getContext('2d');
  if (!drawingCtx) return;

  if (!useCustomBackground) {
    drawingCtx.fillStyle = '#fff';
    drawingCtx.fillRect(0, 0, off.width, off.height);
  } else {
    drawingCtx.clearRect(0, 0, off.width, off.height);
  }

  const boxImg = new Image();
  boxImg.src = new URL(`./assets/${cfg.boxFilename}`, import.meta.url).href;
  await new Promise(r => (boxImg.onload = r));

  const styleImg = new Image();
  styleImg.src = new URL(`./assets/${cfg.defaultStyleImage}`, import.meta.url).href;
  await new Promise(r => (styleImg.onload = r));

  const bxH = (450 / 800) * baseHeight;
  const bxY = baseHeight - bxH - (130 / 800) * baseHeight;
  const mainH = baseHeight * STYLE_HEIGHT_RATIO * (cfg.styleScale ?? 1);

  let imgHeight = mainH;
  let imgWidth;
  if (cfg.keepAspectRatio) {
    const naturalWidth = styleImg.naturalWidth || styleImg.width || 1;
    const naturalHeight = styleImg.naturalHeight || styleImg.height || 1;
    const aspectRatio = naturalHeight > 0 ? naturalWidth / naturalHeight : 1;
    imgWidth = imgHeight * aspectRatio;
  } else {
    const widthScale = (cfg.styleWidthScale ?? cfg.styleScale ?? 1) * 1.05;
    imgWidth = baseHeight * widthScale * 0.55;
  }

  drawingCtx.font = `${fontSize}px ONEPIECE_IL_FINAL`;
  drawingCtx.textBaseline = 'middle';
  drawingCtx.textAlign = 'left';
  drawingCtx.lineJoin = 'round';
  drawingCtx.lineWidth = (18 * fontSize) / 400;

  const textPadding = (-5 / 800) * baseWidth;
  let x = imgWidth + textPadding;
  const yMid = bxY + bxH / 2;
  const charPositions = [];
  for (let i = 0; i < txt.length; i++) {
    charPositions.push({ c: txt[i], x, idx: i });
    const w = drawingCtx.measureText(txt[i]).width * 1.02;
    x += w - 6;
  }

  const HEIGHT_ADJ = { C: 0.95, S: 0.95, O: 1.05, A: 0.97, E: 0.95 };
  const eIndices = charPositions.filter(p => p.c === 'E').map(p => p.idx);
  const iIndices = charPositions.filter(p => p.c === 'I').map(p => p.idx);
  let highlightIdx;
  if (iIndices.length > 0) {
    highlightIdx = iIndices[iIndices.length - 1];
  } else if (eIndices.length > 0) {
    highlightIdx = eIndices[eIndices.length - 1];
  } else {
    highlightIdx = txt.length > 1 ? txt.length - 2 : 0;
  }

  if (charPositions.length > 0) {
    const lastChar = charPositions[charPositions.length - 1];
    const wLast = drawingCtx.measureText(lastChar.c).width;
    const textEnd = lastChar.x + wLast;
    const startX = (baseWidth - textEnd) / 2;
    drawingCtx.save();
    drawingCtx.translate(startX, 0);
    drawingCtx.drawImage(boxImg, 0, bxY, textEnd + 65, bxH);
    const imgY = (baseHeight - imgHeight) / 2.1;
    drawingCtx.drawImage(styleImg, 0, imgY, imgWidth, imgHeight);
    drawingCtx.strokeStyle = '#000';
    for (let { c, x: cx, idx } of charPositions) {
      const scaleY = HEIGHT_ADJ[c] || 1;
      drawingCtx.save();
      drawingCtx.translate(0, yMid);
      drawingCtx.scale(1, scaleY);
      drawingCtx.translate(0, -yMid);
      drawingCtx.strokeText(c, cx, yMid);
      drawingCtx.fillStyle = idx === highlightIdx ? secondaryColor : primaryColor;
      drawingCtx.fillText(c, cx, yMid);
      drawingCtx.restore();
    }
    drawingCtx.restore();
  }

  const shadowOff = document.createElement('canvas');
  shadowOff.width = drawingCtx.canvas.width;
  shadowOff.height = drawingCtx.canvas.height;
  const shCtx = shadowOff.getContext('2d');
  shCtx.drawImage(drawingCtx.canvas, 0, 0);
  shCtx.globalCompositeOperation = 'source-in';
  shCtx.fillStyle = '#000';
  shCtx.fillRect(0, 0, shadowOff.width, shadowOff.height);

  const extruded = document.createElement('canvas');
  extruded.width = drawingCtx.canvas.width;
  extruded.height = drawingCtx.canvas.height;
  const eCtx = extruded.getContext('2d');
  const thickness = Math.round((10 / 800) * baseHeight * SHADOW_INTENSITY);
  for (let i = 0; i < thickness; i++) {
    eCtx.drawImage(shadowOff, i, i);
  }
  eCtx.drawImage(drawingCtx.canvas, 0, 0);

  const letterCount = txt.replace(/\s/g, '').length;
  const baseScale = letterCount > 6 ? ONEPIECE_SCALE_SMALL : ONEPIECE_SCALE_NORMAL;
  const finalScale = Math.min(1, baseScale * SCALE_BOOST);
  const offsetX = (baseWidth * (1 - finalScale)) / 2;
  const baseOffsetY = letterCount > 6 ? ONEPIECE_OFFSET_Y_SMALL : ONEPIECE_OFFSET_Y_NORMAL;
  const offsetY = baseOffsetY - baseHeight * 0.015;

  offCtx.save();
  offCtx.translate(offsetX, offsetY);
  offCtx.scale(finalScale, finalScale);
  offCtx.save();
  offCtx.shadowColor = 'rgba(0,0,0,0.35)';
  offCtx.shadowBlur = (18 / 800) * baseHeight;
  offCtx.shadowOffsetX = (12 / 800) * baseWidth;
  offCtx.shadowOffsetY = (12 / 800) * baseHeight;
  offCtx.drawImage(extruded, 0, 0);
  offCtx.restore();
  offCtx.restore();

  offCtx.restore();

  ctx.clearRect(0, 0, baseWidth, baseHeight);
  ctx.drawImage(
    offscreen,
    0,
    0,
    baseWidth * RENDER_SCALE,
    baseHeight * RENDER_SCALE,
    0,
    0,
    baseWidth,
    baseHeight
  );
}
