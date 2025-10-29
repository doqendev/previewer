import { CANVAS_W, CANVAS_H, LOGO_OFFSET_Y, CUSTOM_BG_MAIN, CUSTOM_BG_SECOND, BAND_OFFSET_Y_NORMAL, BAND_OFFSET_Y_SMALL, BAND_SCALE_NORMAL, BAND_SCALE_SMALL, ACDC_THUNDER_CONFIG } from './previewConfig';

// Draws band-specific logo previews
export async function drawBand(ctx, specific, text, useCustomBackground) {
  ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);  // Draw background if enabled - choose based on letter count like Dragon Ball/One Piece
  if (useCustomBackground) {
    const letterCount = text.replace(/\s/g, '').length;
    const bg = new Image();
    bg.src = letterCount > 6 ? CUSTOM_BG_SECOND : CUSTOM_BG_MAIN;
    await new Promise(r => (bg.onload = r));
    ctx.save();
    const scaleX = ctx.canvas.width / CANVAS_W;
    const scaleY = ctx.canvas.height / CANVAS_H;
    ctx.setTransform(scaleX, 0, 0, scaleY, 0, 0);
    ctx.drawImage(bg, 0, 0, CANVAS_W, CANVAS_H);
    ctx.restore();
  }
  
  ctx.save();
  ctx.translate(0, LOGO_OFFSET_Y);
  
  // Apply scaling and vertical offset based on text length (like Dragon Ball/One Piece)
  const letterCount = text.replace(/\s/g, '').length;
  const scale = letterCount > 6 
    ? (BAND_SCALE_SMALL[specific] || 0.8) 
    : (BAND_SCALE_NORMAL[specific] || 1.0);
  const offsetX = (CANVAS_W * (1 - scale)) / 2;
  const offsetY = letterCount > 6 
    ? (BAND_OFFSET_Y_SMALL[specific] || LOGO_OFFSET_Y + 20)
    : (BAND_OFFSET_Y_NORMAL[specific] || LOGO_OFFSET_Y);
      ctx.save();
  ctx.translate(offsetX, offsetY);
  ctx.scale(scale, scale);
  // Handle text formatting based on band
  let disp = text;
  if (specific === 'acdc') {
    // AC/DC is always fully capitalized
    disp = text.toUpperCase();
  } else {
    // Force first/last letter capital for other bands
    if (disp.length > 1) {
      disp = disp[0].toUpperCase() + disp.slice(1, -1) + disp[disp.length - 1].toUpperCase();
    } else {
      disp = disp.toUpperCase();
    }
  }
  switch (specific) {
    case 'metallica':
      // Load Metallica font with multiple attempts
      try {
        await document.fonts.load('70px Metallica_ILL');
        await document.fonts.ready;
      } catch {
        console.warn('Font loading failed, using fallback');
      }
      ctx.font = 'bold 70px Metallica_ILL, Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.lineWidth = 10;
      ctx.strokeStyle = '#101010';
      ctx.strokeText(disp, CANVAS_W / 2, CANVAS_H / 2);
      ctx.fillStyle = '#fff';
      ctx.lineWidth = 4;
      ctx.strokeText(disp, CANVAS_W / 2, CANVAS_H / 2);
      ctx.fillText(disp, CANVAS_W / 2, CANVAS_H / 2);
      break;
    case 'pantera':
      await document.fonts.load('bold 120px Shredded_IL');
      ctx.font = 'bold 120px Shredded_IL, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.lineWidth = 18;
      ctx.strokeStyle = '#101010';
      ctx.strokeText(disp, CANVAS_W / 2, CANVAS_H / 2);
      ctx.fillStyle = '#fff';
      ctx.lineWidth = 6;
      ctx.strokeText(disp, CANVAS_W / 2, CANVAS_H / 2);
      ctx.fillText(disp, CANVAS_W / 2, CANVAS_H / 2);
      break;
    case 'ironmaiden':
      await document.fonts.load('bold 70px Metal_Lord_Neww');
      ctx.font = 'bold 70px Metal_Lord_Neww, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.lineWidth = 24;
      ctx.strokeStyle = '#000';
      ctx.strokeText(disp, CANVAS_W / 2, CANVAS_H / 2);
      ctx.lineWidth = 7;
      ctx.strokeStyle = '#fff';
      ctx.strokeText(disp, CANVAS_W / 2, CANVAS_H / 2);
      ctx.fillStyle = '#e63946';
      ctx.fillText(disp, CANVAS_W / 2, CANVAS_H / 2);
      break;
    case 'megadeth':
      await document.fonts.load('bold 120px Megadeth_IL');
      ctx.font = '120px Megadeth_IL, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.lineWidth = 15;
      ctx.strokeStyle = '#bfa14a';
      ctx.strokeText(disp, CANVAS_W / 2, CANVAS_H / 2);
      ctx.lineWidth = 5;
      ctx.strokeStyle = '#fff9d1';
      ctx.strokeText(disp, CANVAS_W / 2, CANVAS_H / 2);
      ctx.fillStyle = '#ffe784';
      ctx.fillText(disp, CANVAS_W / 2, CANVAS_H / 2);      break;
    case 'acdc': {
      // Load AC/DC Squealer font
      try {
        await document.fonts.load('bold 100px Squealer');
        await document.fonts.ready;
      } catch {
        console.warn('Squealer font loading failed, using fallback');
      }
      
      ctx.font = 'bold 100px Squealer, Arial Black, sans-serif';
      ctx.textBaseline = 'middle';
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      
      // Analyze text for thunder positioning
      const { thunderMode, thunderX, beforeText, afterText } = analyzeThunderPlacement(text, ctx);
      
      if (thunderMode === ACDC_THUNDER_CONFIG.PLACEMENT_MODES.MIDDLE && beforeText && afterText) {
        // Special handling for middle thunder - render text parts separately
        const beforeWidth = ctx.measureText(beforeText).width;
        const afterWidth = ctx.measureText(afterText).width;
        const spaceWidth = 60; // Space for thunder bolt
        const totalWidth = beforeWidth + spaceWidth + afterWidth;
        const startX = (CANVAS_W - totalWidth) / 2;
        
        ctx.textAlign = 'left';
        
        // Draw first part (e.g., "AC")
        // Thick black outer border
        ctx.lineWidth = 20;
        ctx.strokeStyle = '#101010';
        ctx.strokeText(beforeText, startX, CANVAS_H / 2);
        
        // Thin yellow border
        ctx.lineWidth = 8;
        ctx.strokeStyle = '#FFff00';
        ctx.strokeText(beforeText, startX, CANVAS_H / 2);
        
        // Red fill
        ctx.fillStyle = '#ff0000';
        ctx.fillText(beforeText, startX, CANVAS_H / 2);
        
        // Draw second part (e.g., "DC")
        const secondPartX = startX + beforeWidth + spaceWidth;
        
        // Thick black outer border
        ctx.lineWidth = 20;
        ctx.strokeStyle = '#101010';
        ctx.strokeText(afterText, secondPartX, CANVAS_H / 2);
        
        // Thin yellow border
        ctx.lineWidth = 8;
        ctx.strokeStyle = '#FFff00';
        ctx.strokeText(afterText, secondPartX, CANVAS_H / 2);
        
        // Red fill
        ctx.fillStyle = '#ff0000';
        ctx.fillText(afterText, secondPartX, CANVAS_H / 2);
        
      } else {
        // Normal centered text rendering for other cases
        ctx.textAlign = 'center';
        
        // Thick black outer border
        ctx.lineWidth = 22;
        ctx.strokeStyle = '#101010';
        ctx.strokeText(disp, CANVAS_W / 2, CANVAS_H / 2);
        
        // Thin yellow border
        ctx.lineWidth = 4;
        ctx.strokeStyle = '#FFff00';
        ctx.strokeText(disp, CANVAS_W / 2, CANVAS_H / 2);
        
        // Red fill
        ctx.fillStyle = '#ff0000';
        ctx.fillText(disp, CANVAS_W / 2, CANVAS_H / 2);
      }
        // Draw thunder bolt if applicable
      if (thunderMode !== ACDC_THUNDER_CONFIG.PLACEMENT_MODES.NONE) {
        console.log('About to draw thunder bolt with mode:', thunderMode, 'at position:', thunderX);
        await drawThunderBolt(ctx, thunderMode, thunderX, CANVAS_H / 2, scale);
        console.log('Thunder bolt drawing completed');
      } else {
        console.log('No thunder bolt to draw (mode is NONE)');
      }
      break;
    }
    default:
      break;
  }
  ctx.restore(); // restore scale and offset
  ctx.restore(); // restore initial translate
}

// Helper function to analyze thunder placement based on space position in text
function analyzeThunderPlacement(text, ctx) {
  const { PLACEMENT_MODES } = ACDC_THUNDER_CONFIG;
  
  // Set font for accurate measurements
  ctx.font = 'bold 100px Squealer, Arial Black, sans-serif';
  
  console.log('Analyzing thunder placement for text:', `"${text}"`);
  
  // Check for space at start, end, or middle
  if (text.startsWith(' ')) {
    // " ACDC" - thunder at start
    const cleanText = text.trim().toUpperCase();
    const textWidth = ctx.measureText(cleanText).width;
    const thunderX = (CANVAS_W - textWidth) / 2 - 80; // Position thunder before text
    console.log('Thunder mode: START, thunderX:', thunderX);
    return {
      thunderMode: PLACEMENT_MODES.START,
      thunderX,
      beforeText: '',
      afterText: cleanText
    };
  } else if (text.endsWith(' ')) {
    // "ACDC " - thunder at end
    const cleanText = text.trim().toUpperCase();
    const textWidth = ctx.measureText(cleanText).width;
    const thunderX = (CANVAS_W + textWidth) / 2 + 40; // Position thunder after text
    console.log('Thunder mode: END, thunderX:', thunderX);
    return {
      thunderMode: PLACEMENT_MODES.END,
      thunderX,
      beforeText: cleanText,
      afterText: ''
    };
  } else if (text.includes(' ')) {
    // "AC DC" - thunder in middle
    const trimmedText = text.trim();
    const spaceIndex = trimmedText.indexOf(' ');
    const beforeText = trimmedText.substring(0, spaceIndex).toUpperCase();
    const afterText = trimmedText.substring(spaceIndex + 1).toUpperCase();
    
    // Calculate position between the two parts
    const beforeWidth = ctx.measureText(beforeText).width;
    const afterWidth = ctx.measureText(afterText).width;
    const spaceWidth = 60; // Fixed space for thunder bolt
    const totalWidth = beforeWidth + spaceWidth + afterWidth;
    const textStartX = (CANVAS_W - totalWidth) / 2;
    const thunderX = textStartX + beforeWidth + (spaceWidth / 2); // Position thunder in the space
    
    console.log('Thunder mode: MIDDLE, thunderX:', thunderX, 'beforeText:', beforeText, 'afterText:', afterText);
    return {
      thunderMode: PLACEMENT_MODES.MIDDLE,
      thunderX,
      beforeText,
      afterText
    };
  } else {
    // "ACDC" - no thunder
    console.log('Thunder mode: NONE');
    return {
      thunderMode: PLACEMENT_MODES.NONE,
      thunderX: 0,
      beforeText: text.toUpperCase(),
      afterText: ''
    };
  }
}

// Helper function to draw the thunder bolt image
async function drawThunderBolt(ctx, mode, x, y, scale) {
  try {
    console.log('Drawing thunder bolt at position:', { mode, x, y, scale });
      const img = new Image();
    img.crossOrigin = 'anonymous'; // Handle CORS issues
    img.src = '/previewer/thunder.png'; // Use public folder path
    
    await new Promise((resolve, reject) => {
      img.onload = () => {
        console.log('Thunder image loaded successfully, dimensions:', img.width, 'x', img.height);
        resolve();
      };
      img.onerror = (error) => {
        console.error('Thunder image load error:', error);
        reject(error);
      };
    });
    
    // Calculate thunder dimensions based on font size and scale
    const fontSize = 100; // Base font size used for AC/DC
    const thunderSizeMultiplier = ACDC_THUNDER_CONFIG.THUNDER_SIZE_NORMAL; // Use normal size for now
    
    const scaledSize = fontSize * thunderSizeMultiplier * scale * 0.8; // Make it more visible
    
    // Apply positioning offsets
    const finalX = x + ACDC_THUNDER_CONFIG.THUNDER_OFFSET_X;
    const finalY = y + ACDC_THUNDER_CONFIG.THUNDER_OFFSET_Y;
    
    console.log('Thunder final position:', { finalX, finalY, scaledSize });
    
    // Draw the thunder bolt
    ctx.save();
    ctx.drawImage(
      img, 
      finalX - scaledSize/2, 
      finalY - scaledSize/2, 
      scaledSize, 
      scaledSize
    );
    ctx.restore();
    
    console.log('Thunder bolt drawn successfully');
  } catch (error) {
    console.error('Failed to load thunder image:', error);
    
    // Fallback: draw a simple lightning bolt shape
    console.log('Drawing fallback thunder shape');
    ctx.save();
    ctx.fillStyle = '#FFD700';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    
    const size = 40;
    const thunderX = x + ACDC_THUNDER_CONFIG.THUNDER_OFFSET_X;
    const thunderY = y + ACDC_THUNDER_CONFIG.THUNDER_OFFSET_Y;
    
    // Simple lightning bolt path
    ctx.beginPath();
    ctx.moveTo(thunderX, thunderY - size/2);
    ctx.lineTo(thunderX + size/4, thunderY);
    ctx.lineTo(thunderX - size/4, thunderY);
    ctx.lineTo(thunderX, thunderY + size/2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }
}
