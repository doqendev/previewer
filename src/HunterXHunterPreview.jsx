import xImg from './assets/x_hxh.png';
import {
  CANVAS_W,
  CANVAS_H,
  LOGO_OFFSET_Y,
  CUSTOM_BG_MAIN,
  CUSTOM_BG_SECOND
} from './previewConfig';

// Draws the Hunter x Hunter logo preview on a 2D canvas context
export async function drawHunterXHunter(ctx, text, useCustomBackground) {
  ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

  // Optional custom background
  if (useCustomBackground) {
    const letterCount = text.replace(/\s/g, '').length;
    const bg = new Image();
    bg.src = letterCount > 6 ? CUSTOM_BG_SECOND : CUSTOM_BG_MAIN;
    await new Promise((r) => (bg.onload = r));
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.drawImage(bg, 0, 0, CANVAS_W, CANVAS_H);
    ctx.restore();
  }

  ctx.save();
  ctx.translate(0, LOGO_OFFSET_Y);

  const inputText = text.toUpperCase();
  const canvasWidth = CANVAS_W;
  const canvasHeight = CANVAS_H;
  const textOffset = 38;
  let textFontSize = 200;
  const textFontBase = 'PLZ';
  const maxWidth = canvasWidth * 0.8;
  const maxHeight = canvasHeight * 0.4;
  const baseStrokeWidth = 14;

  // Ensure the custom font is loaded
  try {
    await document.fonts.load(`${textFontSize}px ${textFontBase}`);
  } catch (e) {
    console.warn('Font load failed', e);
  }

  ctx.font = `${textFontSize}px ${textFontBase}`;
  let naiveTextWidth = ctx.measureText(inputText).width;
  let naiveTextHeight = textFontSize;
  const scaleRatio = Math.min(maxWidth / naiveTextWidth, maxHeight / naiveTextHeight);
  if (scaleRatio < 1) {
    textFontSize = Math.floor(textFontSize * scaleRatio);
    ctx.font = `${textFontSize}px ${textFontBase}`;
    naiveTextWidth = ctx.measureText(inputText).width;
  }

  ctx.lineWidth = baseStrokeWidth * scaleRatio;
  const centerY = canvasHeight / 2;
  const textStartX = (canvasWidth - naiveTextWidth) / 2;

  // Reflection
  ctx.save();
  ctx.scale(1, -1);
  const reflectionY = -(centerY + textOffset * scaleRatio);
  const reflectionGrad = ctx.createLinearGradient(
    0,
    reflectionY - (textFontSize * scaleRatio) / 2,
    0,
    reflectionY + (textFontSize * scaleRatio) / 2
  );
  reflectionGrad.addColorStop(0, '#fff');
  reflectionGrad.addColorStop(1, '#fff');
  ctx.strokeStyle = '#c60000';
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.strokeText(inputText, textStartX, reflectionY);
  ctx.fillStyle = reflectionGrad;
  ctx.fillText(inputText, textStartX, reflectionY);
  ctx.restore();

  // Main text
  const mainTextY = centerY - textOffset * scaleRatio;
  const mainGrad = ctx.createLinearGradient(
    0,
    mainTextY - (textFontSize * scaleRatio) / 2,
    0,
    mainTextY + (textFontSize * scaleRatio) / 2
  );
  mainGrad.addColorStop(0, '#fff');
  mainGrad.addColorStop(1, '#fff');
  ctx.strokeStyle = '#c60000';
  ctx.strokeText(inputText, textStartX, mainTextY);
  ctx.fillStyle = mainGrad;
  ctx.fillText(inputText, textStartX, mainTextY);

  // Overlay X image
  const img = new Image();
  img.src = xImg;
  await new Promise((r) => (img.onload = r));
  let overlayScale = 1.0;
  if (inputText.length === 1) overlayScale = 0.5;
  else if (inputText.length === 2) overlayScale = 0.7;
  const imageBaseWidth = 250;
  const imageBaseHeight = 112;
  const imageWidth = imageBaseWidth * scaleRatio * overlayScale;
  const imageHeight = imageBaseHeight * scaleRatio * overlayScale;
  let imageX;
  if (inputText.length <= 3) {
    imageX = textStartX + (naiveTextWidth * 0.5) - imageWidth / 2;
  } else {
    imageX = textStartX + (naiveTextWidth * 0.6) - imageWidth / 2;
  }
  const imageY = centerY - imageHeight / 2;
  ctx.drawImage(img, imageX, imageY, imageWidth, imageHeight);

  ctx.restore();
}

