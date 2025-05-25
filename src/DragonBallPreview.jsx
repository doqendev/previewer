import { CUSTOM_BG_MAIN, CUSTOM_BG_SECOND, CANVAS_W, CANVAS_H, LOGO_OFFSET_Y, DB_RING_SRC, KERNING, WIDTH_ADJ, DRAGONBALL_SCALE_NORMAL, DRAGONBALL_SCALE_SMALL, DRAGONBALL_OFFSET_Y_NORMAL, DRAGONBALL_OFFSET_Y_SMALL } from './previewConfig';

// Draws the Dragon Ball logo preview on a 2D canvas context
export async function drawDragonBall(ctx, text, useCustomBackground) {
  ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
  // Draw custom background if enabled
  if (useCustomBackground) {
    // choose secondary background when text length >6
    const letterCountBg = text.replace(/\s/g, '').length;
    const bg = new Image();
    bg.src = letterCountBg > 6 ? CUSTOM_BG_SECOND : CUSTOM_BG_MAIN;
    await new Promise(r => (bg.onload = r));
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.drawImage(bg, 0, 0, CANVAS_W, CANVAS_H);
    ctx.restore();
  }

  ctx.save();
  ctx.translate(0, LOGO_OFFSET_Y);
  // apply scaling and vertical offset based on text length
  const letterCount = text.replace(/\s/g, '').length;
  const s = letterCount > 6 ? DRAGONBALL_SCALE_SMALL : DRAGONBALL_SCALE_NORMAL;
  const offsetX = (CANVAS_W * (1 - s)) / 2;
  const offsetY = letterCount > 6 ? DRAGONBALL_OFFSET_Y_SMALL : DRAGONBALL_OFFSET_Y_NORMAL;
  ctx.save(); ctx.translate(offsetX, offsetY); ctx.scale(s, s);
  const t = text.toUpperCase();
  await document.fonts.load('100px db');
  ctx.font = '100px db, sans-serif';
  ctx.textBaseline = 'alphabetic';
  ctx.textAlign = 'left';
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  // Measure letters
  const letters = t.split('').map(L => {
    const measured = ctx.measureText(L).width;
    const factor = WIDTH_ADJ[L] || 1;
    return { L, measured, factor, effective: measured * factor };
  });
  const n = letters.length;
  const half = Math.ceil(n / 2);
  const totalLettersWidth = letters.reduce((sum, { effective }) => sum + effective, 0);
  const ballSize = 60;
  const letterSpacing = 5;
  const totalWidth = totalLettersWidth + ballSize + letterSpacing * (n - 1);
  const xStart = (CANVAS_W - totalWidth) / 2;
  const sampleMetrics = ctx.measureText('M');
  const ascent = sampleMetrics.actualBoundingBoxAscent;
  const descent = sampleMetrics.actualBoundingBoxDescent;
  const baselineY = (CANVAS_H + ascent - descent) / 2;
  const yPos = baselineY;

  const positions = [];
  let x = xStart;
  for (let i = 0; i < half; i++) {
    if (i > 0) x += KERNING[t[i - 1] + t[i]] || 0;
    const { L, factor, effective } = letters[i];
    const d = Math.min(i, n - 1 - i);
    const scale = Math.max(1 - d * 0.05, 0.5);
    const fillColor = '#ffff00';
    positions.push({ L, x, factor, scale, fillColor, effective });
    x += effective + letterSpacing;
  }
  x += ballSize / 2;
  for (let i = half; i < n; i++) {
    if (i > half) x += KERNING[t[i - 1] + t[i]] || 0;
    const { L, factor, effective } = letters[i];
    const d = Math.min(i, n - 1 - i);
    const scale = Math.max(1 - d * 0.05, 0.5);
    const fillColor = '#ff0000';
    positions.push({ L, x, factor, scale, fillColor, effective });
    x += effective + letterSpacing;
  }

  ctx.save(); // save before translating and scaling
  // Draw letters
  for (const pos of positions) {
    ctx.save();
    ctx.translate(pos.x, yPos);
    ctx.scale(pos.factor, pos.scale);
    ctx.strokeStyle = '#161616';
    ctx.lineWidth = 15 / pos.scale;
    ctx.strokeText(pos.L, 0, 0);
    ctx.fillStyle = pos.fillColor;
    ctx.fillText(pos.L, 0, 0);
    ctx.restore();
  }
  ctx.restore(); // restore scale and offset

  // Draw ring
  const img = new Image();
  img.src = DB_RING_SRC;
  await new Promise(r => (img.onload = r));
  const ringX = positions[half - 1].x + positions[half - 1].effective - ballSize / 2;
  const ringCenterY = yPos - ascent / 2;
  const ringY = ringCenterY - ballSize / 2;
  ctx.drawImage(img, ringX + 15, ringY + 5, ballSize, ballSize);

  ctx.restore(); // restore initial translate
}
