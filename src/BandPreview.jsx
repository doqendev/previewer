import { CANVAS_W, CANVAS_H, LOGO_OFFSET_Y } from './previewConfig';

// Draws band-specific logo previews
export async function drawBand(ctx, specific, disp) {
  ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
  ctx.save();
  ctx.translate(0, LOGO_OFFSET_Y);

  switch (specific) {
    case 'metallica':
      ctx.font = 'bold 70px Metallica_ILL, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.lineWidth = 10;
      ctx.strokeStyle = '#000';
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
      ctx.strokeStyle = '#000';
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
      ctx.lineWidth = 8;
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
      ctx.fillText(disp, CANVAS_W / 2, CANVAS_H / 2);
      break;
    default:
      // No-op; fallback to generic if needed
      break;
  }

  ctx.restore();
}
