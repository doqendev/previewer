const functions = require('firebase-functions');
const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');

// Style configuration for each variant
const styleConfigs = {
  '1': {
    boxFilename: 'box_luffy.png',
    defaultStyleImage: 'style_luffy.png',
    defaultPrimaryColor: '#dc2526',
    defaultSecondaryColor: '#0077f1',
  },
  '2': {
    boxFilename: 'box_green.png',
    defaultStyleImage: 'style_2.png',
    defaultPrimaryColor: '#f4ed00',
    defaultSecondaryColor: '#2ab100',
  },
  // ... repeat for variants 3 through 18
};

async function generateTextImageGeneric(
  styleConfig,
  text,
  primaryColor,
  secondaryColor,
  styleImageName,
  response
) {
  try {
    text = text.substring(0, 12);

    // load main style image
    const styleImagePath = path.join(__dirname, styleImageName);
    if (!fs.existsSync(styleImagePath)) {
      return response.status(404).send('Main style image file not found');
    }
    const image = await loadImage(styleImagePath);

    // load box image
    const boxImagePath = path.join(__dirname, styleConfig.boxFilename);
    if (!fs.existsSync(boxImagePath)) {
      return response.status(404).send('Box image file not found');
    }
    const boxImage = await loadImage(boxImagePath);

    // load wall background
    const wallImagePath = path.join(__dirname, 'wall.jpg');
    if (!fs.existsSync(wallImagePath)) {
      return response.status(404).send('Wall background image not found');
    }
    const wallImage = await loadImage(wallImagePath);

    const baseCanvasHeight = 800;
    const textPadding = -10;
    const extraMargin = 100;
    const mainImageHeight = baseCanvasHeight * 0.5;
    const maxFontSize = Math.min(400, baseCanvasHeight * 0.7);
    let fontSize = text.length > 11 ? maxFontSize * 0.7 : maxFontSize;

    const tempCanvas = createCanvas(1, 1);
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.font = `${fontSize}px ONEPIECE_IL_FINAL`;
    // kerning table omitted for brevity
    const kerningTable = {};

    let measuredTextWidth = 0;
    for (let i = 0; i < text.length; i++) {
      measuredTextWidth += tempCtx.measureText(text[i]).width;
      if (i < text.length - 1) {
        measuredTextWidth += kerningTable[text[i] + text[i + 1]] || 10;
      }
    }
    const computedCanvasWidth =
      mainImageHeight + textPadding + measuredTextWidth + extraMargin;

    // draw design canvas
    const designCanvas = createCanvas(computedCanvasWidth, baseCanvasHeight);
    const designCtx = designCanvas.getContext('2d');
    designCtx.fillStyle = '#FFFFFF';
    designCtx.fillRect(0, 0, designCanvas.width, designCanvas.height);

    const manualBoxHeight = 425;
    const finalBoxWidth = designCanvas.width + 25;
    const finalBoxHeight = manualBoxHeight;
    const manualBoxX = -30;
    const manualBoxY = baseCanvasHeight - finalBoxHeight - 160;
    designCtx.drawImage(
      boxImage,
      manualBoxX,
      manualBoxY,
      finalBoxWidth,
      finalBoxHeight
    );

    const mainImageYFinal = (baseCanvasHeight - mainImageHeight) / 2;
    designCtx.drawImage(image, 0, mainImageYFinal, mainImageHeight, mainImageHeight);

    designCtx.font = `${fontSize}px ONEPIECE_IL_FINAL`;
    designCtx.textAlign = 'left';
    designCtx.textBaseline = 'middle';
    designCtx.lineJoin = 'round';
    designCtx.lineWidth = 15;

    // compute colored letter indexes omitted
    const coloredIndexes = [];

    let currentX = mainImageHeight + textPadding;
    const textYFinal = baseCanvasHeight / 2;
    for (let i = 0; i < text.length; i++) {
      const letter = text[i];
      designCtx.save();
      designCtx.translate(currentX, textYFinal);
      designCtx.strokeStyle = '#000';
      designCtx.fillStyle = coloredIndexes.includes(i) ? primaryColor : secondaryColor;
      designCtx.strokeText(letter, 0, 0);
      designCtx.fillText(letter, 0, 0);
      designCtx.restore();
      currentX += designCtx.measureText(letter).width;
      if (i < text.length - 1) {
        currentX += kerningTable[letter + text[i + 1]] || 10;
      }
    }

    // extrude effect
    const shadowCanvas = createCanvas(computedCanvasWidth, baseCanvasHeight);
    const shadowCtx = shadowCanvas.getContext('2d');
    shadowCtx.drawImage(designCanvas, 0, 0);
    shadowCtx.globalCompositeOperation = 'source-in';
    shadowCtx.fillStyle = '#000000';
    shadowCtx.fillRect(0, 0, shadowCanvas.width, shadowCanvas.height);

    const thickness = 8;
    const extrudedCanvas = createCanvas(computedCanvasWidth, baseCanvasHeight);
    const extrudedCtx = extrudedCanvas.getContext('2d');
    for (let i = 0; i < thickness; i++) {
      extrudedCtx.drawImage(shadowCanvas, i, i);
    }
    extrudedCtx.drawImage(designCanvas, 0, 0);

    const mainCanvas = createCanvas(computedCanvasWidth, baseCanvasHeight);
    const mainCtx = mainCanvas.getContext('2d');
    mainCtx.drawImage(wallImage, 0, 0, mainCanvas.width, mainCanvas.height);
    mainCtx.save();
    mainCtx.shadowColor = 'rgba(0,0,0,0.3)';
    mainCtx.shadowBlur = 15;
    mainCtx.shadowOffsetX = 10;
    mainCtx.shadowOffsetY = 10;
    mainCtx.drawImage(extrudedCanvas, 0, 0);
    mainCtx.restore();

    response.set('Content-Type', 'image/png');
    const stream = mainCanvas.createPNGStream();
    stream.pipe(response);
    stream.on('error', (err) => {
      console.error('Error streaming image:', err);
      response.status(500).send('Error streaming image');
    });
  } catch (error) {
    console.error('Error generating image:', error);
    response.status(500).send('Internal Server Error');
  }
}

// Export functions for each variant
Object.keys(styleConfigs).forEach((key) => {
  exports[`generateStyle${key}`] = functions.https.onRequest(async (req, res) => {
    const styleConfig = styleConfigs[key];
    const text = (req.query.text || 'DEFAULT').toUpperCase();
    const primaryColor = req.query.primaryColor || styleConfig.defaultPrimaryColor;
    const secondaryColor = req.query.secondaryColor || styleConfig.defaultSecondaryColor;
    const styleImageName = req.query.image || styleConfig.defaultStyleImage;
    await generateTextImageGeneric(
      styleConfig,
      text,
      primaryColor,
      secondaryColor,
      styleImageName,
      res
    );
  });
});
