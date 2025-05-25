import { CANVAS_W, CANVAS_H, LOGO_OFFSET_Y, CUSTOM_BG_MAIN, CUSTOM_BG_SECOND, ONEPIECE_STYLE_CONFIGS, ONEPIECE_SCALE_NORMAL, ONEPIECE_SCALE_SMALL, ONEPIECE_OFFSET_Y_NORMAL, ONEPIECE_OFFSET_Y_SMALL } from './previewConfig';

export async function drawOnePiece(ctx, text, variant, useCustomBackground) {
  ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
  // Draw custom background if enabled
  if (useCustomBackground) {
    const bg = new Image();
    const txtLen = text.replace(/\s/g, '').length;
    bg.src = txtLen > 6 ? CUSTOM_BG_SECOND : CUSTOM_BG_MAIN;
    await new Promise(r => (bg.onload = r));
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.drawImage(bg, 0, 0, CANVAS_W, CANVAS_H);
    ctx.restore();
  }

  const txt = text.toUpperCase().substring(0, 12);
  await document.fonts.load('bold 50px ONEPIECE_IL_FINAL');
  const cfg = ONEPIECE_STYLE_CONFIGS[variant] || ONEPIECE_STYLE_CONFIGS.char1;
  const primaryColor = cfg.defaultSecondaryColor;
  const secondaryColor = cfg.defaultPrimaryColor;
  const maxFontSize = Math.min(400, CANVAS_H * 0.5);
  const baseFontSize = txt.length > 11 ? maxFontSize * 0.7 : maxFontSize;
  const fontSize = baseFontSize;

  const off = document.createElement('canvas');
  off.width = CANVAS_W;
  off.height = CANVAS_H;
  const offCtx = off.getContext('2d');
  if (!useCustomBackground) {
    offCtx.fillStyle = '#fff'; offCtx.fillRect(0, 0, off.width, off.height);
  } else {
    offCtx.clearRect(0, 0, off.width, off.height);
  }

  const boxImg = new Image(); boxImg.src = new URL(`./assets/${cfg.boxFilename}`, import.meta.url).href;
  await new Promise(r => (boxImg.onload = r));
  const bxH = (425 / 800) * CANVAS_H;
  const bxY = CANVAS_H - bxH - (160 / 800) * CANVAS_H;
  const mainH = CANVAS_H * 0.5;
  const styleScale = cfg.styleScale ?? 1;
  const widthScale = cfg.styleWidthScale ?? styleScale;
  const imgWidth = mainH * widthScale;
  const imgHeight = mainH * styleScale;
  const styleImg = new Image(); styleImg.src = new URL(`./assets/${cfg.defaultStyleImage}`, import.meta.url).href;
  await new Promise(r => (styleImg.onload = r));

  offCtx.font = `${fontSize}px ONEPIECE_IL_FINAL`;
  offCtx.textBaseline = 'middle';
  offCtx.textAlign = 'left';
  offCtx.lineJoin = 'round';
  offCtx.lineWidth = (15 * fontSize) / 400;

  const textPadding = (-10 / 800) * CANVAS_W;
  let x = imgWidth + textPadding;
  const yMid = bxY + bxH / 2;
  const charPositions = [];
  for (let i = 0; i < txt.length; i++) {
    charPositions.push({ c: txt[i], x, idx: i });
    const w = offCtx.measureText(txt[i]).width;
    x += w - 8;
  }
  const HEIGHT_ADJ = { C: 0.95, S: 0.95, O: 1.05, A: 0.97, E: 0.95 };
  const eIndices = charPositions.filter(p => p.c === 'E').map(p => p.idx);
  const iIndices = charPositions.filter(p => p.c === 'I').map(p => p.idx);
  let highlightIdx = -1;
  if (eIndices.length === 1 && iIndices.length === 0) highlightIdx = eIndices[0];
  else if (iIndices.length === 1 && eIndices.length === 0) highlightIdx = iIndices[0];
  else if (iIndices.length === 1 && eIndices.length === 1) highlightIdx = iIndices[0];
  else if (eIndices.length > 1 || iIndices.length > 1) highlightIdx = Math.max(eIndices[eIndices.length-1]||-1, iIndices[iIndices.length-1]||-1);
  if (highlightIdx === -1) highlightIdx = txt.length > 1 ? txt.length - 2 : 0;

  if (charPositions.length > 0) {
    const lastChar = charPositions[charPositions.length - 1];
    const wLast = offCtx.measureText(lastChar.c).width;
    const textEnd = lastChar.x + wLast;
    const startX = (CANVAS_W - textEnd) / 2;
    offCtx.save(); offCtx.translate(startX, 0);
    offCtx.drawImage(boxImg, 0, bxY, textEnd + 45, bxH);
    const imgY = (CANVAS_H - imgHeight) / 2;
    offCtx.drawImage(styleImg, 0, imgY, imgWidth, imgHeight);
    offCtx.strokeStyle = '#000';
    for (let {c, x: cx, idx} of charPositions) {
      const scaleY = HEIGHT_ADJ[c] || 1;
      offCtx.save(); offCtx.translate(0, yMid); offCtx.scale(1, scaleY); offCtx.translate(0, -yMid);
      offCtx.strokeText(c, cx, yMid);
      offCtx.fillStyle = idx === highlightIdx ? secondaryColor : primaryColor;
      offCtx.fillText(c, cx, yMid);
      offCtx.restore();
    }
    offCtx.restore();
  }
  // Extrude shadow
  const shadowOff = document.createElement('canvas'); shadowOff.width = off.width; shadowOff.height = off.height;
  const shCtx = shadowOff.getContext('2d'); shCtx.drawImage(off, 0, 0);
  shCtx.globalCompositeOperation = 'source-in'; shCtx.fillStyle = '#000'; shCtx.fillRect(0,0,shadowOff.width, shadowOff.height);
  const extruded = document.createElement('canvas'); extruded.width = off.width; extruded.height = off.height;
  const eCtx = extruded.getContext('2d'); const thickness = Math.round((8 / 800) * CANVAS_H);
  for (let i = 0; i < thickness; i++) eCtx.drawImage(shadowOff, i, i);
  eCtx.drawImage(off, 0, 0);

  ctx.save(); ctx.translate(0, LOGO_OFFSET_Y);
  const letterCount = txt.replace(/\s/g, '').length;
  const s = letterCount > 6 ? ONEPIECE_SCALE_SMALL : ONEPIECE_SCALE_NORMAL;
  const offsetX = (CANVAS_W * (1 - s)) / 2;
  const offsetY = letterCount > 6 ? ONEPIECE_OFFSET_Y_SMALL : ONEPIECE_OFFSET_Y_NORMAL;
  ctx.save(); ctx.translate(offsetX, offsetY); ctx.scale(s, s);
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,0.3)';
  ctx.shadowBlur = (15 / 800) * CANVAS_H; ctx.shadowOffsetX = (10 / 800) * CANVAS_W; ctx.shadowOffsetY = (10 / 800) * CANVAS_H;
  ctx.drawImage(extruded, 0, 0);
  ctx.restore(); ctx.restore(); return;
}
