import { CANVAS_W, CANVAS_H, LOGO_OFFSET_Y, CUSTOM_BG_MAIN, CUSTOM_BG_SECOND, ONEPIECE_STYLE_CONFIGS, ONEPIECE_SCALE_NORMAL, ONEPIECE_SCALE_SMALL, ONEPIECE_OFFSET_Y_NORMAL, ONEPIECE_OFFSET_Y_SMALL } from './previewConfig';

export async function drawOnePiece(ctx, text, variant, useCustomBackground, styleVariantKey) {
  const currentTransform = typeof ctx.getTransform === 'function' ? ctx.getTransform() : { a: 1, d: 1 };
  const scaleX = ctx.__deviceScaleX || currentTransform.a || 1;
  const scaleY = ctx.__deviceScaleY || currentTransform.d || 1;
  const inverseScaleX = scaleX !== 0 ? 1 / scaleX : 1;
  const inverseScaleY = scaleY !== 0 ? 1 / scaleY : 1;
  const rawSetTransform = ctx.__setRawTransform || null;
  const setIdentityTransform = () => {
    if (typeof rawSetTransform === 'function') {
      rawSetTransform(1, 0, 0, 1, 0, 0);
    } else {
      ctx.transform(inverseScaleX, 0, 0, inverseScaleY, 0, 0);
    }
  };
  const deviceWidth = Math.max(1, Math.round(CANVAS_W * scaleX));
  const deviceHeight = Math.max(1, Math.round(CANVAS_H * scaleY));
  const maxDeviceScale = Math.max(scaleX, scaleY);
  const oversample = maxDeviceScale >= 2 ? 1 : 2;
  const renderScaleX = scaleX * oversample;
  const renderScaleY = scaleY * oversample;
  const renderWidth = Math.max(1, Math.round(CANVAS_W * renderScaleX));
  const renderHeight = Math.max(1, Math.round(CANVAS_H * renderScaleY));
  const smoothingSupported = 'imageSmoothingQuality' in ctx;
  const forceBlackBackground = variant === 'char13';
  const shouldUseCustomBackground = useCustomBackground && !forceBlackBackground;

  ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

  if (shouldUseCustomBackground) {
    const bg = new Image();
    const txtLen = text.replace(/\s/g, '').length;
    bg.src = txtLen > 6 ? CUSTOM_BG_SECOND : CUSTOM_BG_MAIN;
    await new Promise(r => (bg.onload = r));
    ctx.save();
    setIdentityTransform();
    ctx.imageSmoothingEnabled = true;
    if (smoothingSupported) ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(bg, 0, 0, deviceWidth, deviceHeight);
    ctx.restore();
  } else if (forceBlackBackground) {
    ctx.save();
    setIdentityTransform();
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, deviceWidth, deviceHeight);
    ctx.restore();
  }

  const txt = text.toUpperCase().substring(0, 12);
  await document.fonts.load('bold 50px ONEPIECE_IL_FINAL');
  const cfg = ONEPIECE_STYLE_CONFIGS[variant] || ONEPIECE_STYLE_CONFIGS.char1;
  const styleVariantOptions = cfg.styleVariants || [];
  const fallbackVariant = styleVariantOptions.find((opt) => opt.value === cfg.defaultStyleVariant) || styleVariantOptions[0];
  const activeStyleVariant = styleVariantOptions.find((opt) => opt.value === styleVariantKey) || fallbackVariant || null;
  const activeStyleImage = activeStyleVariant?.styleImage || cfg.defaultStyleImage;
  const primaryColor = activeStyleVariant?.secondaryColor || cfg.defaultSecondaryColor;
  const secondaryColor = activeStyleVariant?.primaryColor || cfg.defaultPrimaryColor;
  const effectiveStyleScale = activeStyleVariant?.styleScale ?? cfg.styleScale ?? 1;
  const effectiveStyleWidthScale = activeStyleVariant?.styleWidthScale ?? cfg.styleWidthScale;
  const effectiveKeepAspectRatio = activeStyleVariant?.keepAspectRatio ?? cfg.keepAspectRatio;
  const maxFontSize = Math.min(400, CANVAS_H * 0.5);
  const baseFontSize = txt.length > 11 ? maxFontSize * 0.7 : maxFontSize;
  const fontSize = baseFontSize;

  const off = document.createElement('canvas');
  off.width = renderWidth;
  off.height = renderHeight;
  const offCtx = off.getContext('2d');
  if (!offCtx) return;
  offCtx.imageSmoothingEnabled = true;
  if ('imageSmoothingQuality' in offCtx) offCtx.imageSmoothingQuality = 'high';
  offCtx.scale(renderScaleX, renderScaleY);

  if (shouldUseCustomBackground) {
    offCtx.clearRect(0, 0, CANVAS_W, CANVAS_H);
  } else {
    offCtx.fillStyle = forceBlackBackground ? '#000000' : '#fff';
    offCtx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  }

  const boxImg = new Image();
  boxImg.src = new URL(`./assets/${cfg.boxFilename}`, import.meta.url).href;
  await new Promise(r => (boxImg.onload = r));
  const bxH = (425 / 800) * CANVAS_H;
  const bxY = CANVAS_H - bxH - (160 / 800) * CANVAS_H;
  const mainH = CANVAS_H * 0.5;
  let imgHeight = mainH * effectiveStyleScale;
  let imgWidth;
  const styleImg = new Image();
  styleImg.src = new URL(`./assets/${activeStyleImage}`, import.meta.url).href;
  await new Promise(r => (styleImg.onload = r));
  if (effectiveKeepAspectRatio) {
    const naturalWidth = styleImg.naturalWidth || styleImg.width || 1;
    const naturalHeight = styleImg.naturalHeight || styleImg.height || 1;
    const aspectRatio = naturalHeight > 0 ? naturalWidth / naturalHeight : 1;
    imgWidth = imgHeight * aspectRatio;
  } else {
    const widthScale = effectiveStyleWidthScale ?? effectiveStyleScale;
    imgWidth = mainH * widthScale;
  }

  let styleSource = styleImg;
  if (typeof createImageBitmap === 'function') {
    try {
      styleSource = await createImageBitmap(styleImg, {
        resizeWidth: Math.max(1, Math.round(imgWidth * renderScaleX)),
        resizeHeight: Math.max(1, Math.round(imgHeight * renderScaleY)),
        resizeQuality: 'high',
      });
    } catch (_) {
      styleSource = styleImg;
    }
  }

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
    const wLast = offCtx.measureText(lastChar.c).width;
    const textEnd = lastChar.x + wLast;
    const startX = (CANVAS_W - textEnd) / 2;
    offCtx.save();
    offCtx.translate(startX, 0);
    let boxSource = boxImg;
    if (typeof createImageBitmap === 'function') {
      try {
        boxSource = await createImageBitmap(boxImg, {
          resizeWidth: Math.max(1, Math.round((textEnd + 45) * renderScaleX)),
          resizeHeight: Math.max(1, Math.round(bxH * renderScaleY)),
          resizeQuality: 'high',
        });
      } catch (_) {
        boxSource = boxImg;
      }
    }
    offCtx.drawImage(boxSource, 0, bxY, textEnd + 45, bxH);
    const imgY = (CANVAS_H - imgHeight) / 2;
    offCtx.drawImage(styleSource, 0, imgY, imgWidth, imgHeight);
    offCtx.strokeStyle = '#000';
    for (let { c, x: cx, idx } of charPositions) {
      const scaleY = HEIGHT_ADJ[c] || 1;
      offCtx.save();
      offCtx.translate(0, yMid);
      offCtx.scale(1, scaleY);
      offCtx.translate(0, -yMid);
      offCtx.strokeText(c, cx, yMid);
      offCtx.fillStyle = idx === highlightIdx ? secondaryColor : primaryColor;
      offCtx.fillText(c, cx, yMid);
      offCtx.restore();
    }
    if (boxSource !== boxImg && typeof boxSource.close === 'function') {
      boxSource.close();
    }
    offCtx.restore();
  }
  if (styleSource !== styleImg && typeof styleSource.close === 'function') {
    styleSource.close();
  }

  const shadowOff = document.createElement('canvas');
  shadowOff.width = off.width;
  shadowOff.height = off.height;
  const shCtx = shadowOff.getContext('2d');
  shCtx.drawImage(off, 0, 0);
  shCtx.globalCompositeOperation = 'source-in';
  shCtx.fillStyle = '#000';
  shCtx.fillRect(0, 0, shadowOff.width, shadowOff.height);

  const extruded = document.createElement('canvas');
  extruded.width = off.width;
  extruded.height = off.height;
  const eCtx = extruded.getContext('2d');
  const baseThickness = (8 / 800) * CANVAS_H;
  const thickness = Math.max(1, Math.round(baseThickness * Math.max(renderScaleX, renderScaleY)));
  for (let i = 0; i < thickness; i++) {
    eCtx.drawImage(shadowOff, i, i);
  }
  eCtx.drawImage(off, 0, 0);

  const letterCount = txt.replace(/\s/g, '').length;
  const scaleFactor = letterCount > 6 ? ONEPIECE_SCALE_SMALL : ONEPIECE_SCALE_NORMAL;
  const offsetX = (CANVAS_W * (1 - scaleFactor)) / 2;
  const offsetY = letterCount > 6 ? ONEPIECE_OFFSET_Y_SMALL : ONEPIECE_OFFSET_Y_NORMAL;
  const totalOffsetX = offsetX;
  const totalOffsetY = LOGO_OFFSET_Y + offsetY;
  const deviceOffsetX = totalOffsetX * scaleX;
  const deviceOffsetY = totalOffsetY * scaleY;
  const destWidth = Math.max(1, Math.round((extruded.width * scaleFactor) / oversample));
  const destHeight = Math.max(1, Math.round((extruded.height * scaleFactor) / oversample));
  const avgScale = Math.max(scaleX, scaleY);

  ctx.save();
  setIdentityTransform();
  ctx.imageSmoothingEnabled = true;
  if (smoothingSupported) ctx.imageSmoothingQuality = 'high';
  ctx.shadowColor = 'rgba(0,0,0,0.3)';
  ctx.shadowBlur = ((15 / 800) * CANVAS_H) * avgScale;
  ctx.shadowOffsetX = ((10 / 800) * CANVAS_W) * scaleX;
  ctx.shadowOffsetY = ((10 / 800) * CANVAS_H) * scaleY;
  ctx.drawImage(
    extruded,
    0,
    0,
    extruded.width,
    extruded.height,
    deviceOffsetX,
    deviceOffsetY,
    destWidth,
    destHeight
  );
  ctx.restore();
}
