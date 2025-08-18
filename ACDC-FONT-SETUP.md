# AC/DC Font Setup Instructions

## Required Font File: squealer.ttf

To complete the AC/DC preview implementation, you need to:

1. **Obtain the squealer.ttf font file**
2. **Place it in the fonts directory:** `public/fonts/squealer.ttf`
3. **Convert it to JSON format** using the existing font conversion script

## Steps to Add the Font:

### 1. Add squealer.ttf to fonts directory
```
public/fonts/squealer.ttf
```

### 2. Run the font conversion script
```bash
npm run convert-fonts
```

This will generate:
- `public/fonts/Squealer.json` (for 3D Text3D component)

### 3. Font is already integrated
The AC/DC preview is already implemented in:
- ✅ `src/App.jsx` - Added to themes and font mapping
- ✅ `src/BandPreview.jsx` - Styling implementation complete
- ✅ `src/previewConfig.js` - Scaling and offset values added

## AC/DC Styling Features:
- **Font:** Squealer (with Arial Black fallback)
- **Fill:** Red (#DC143C)
- **Inner Border:** Thin Yellow (#FFD700)
- **Outer Border:** Thick Black (#000000)
- **Dual Scaling:** Normal/Small based on text length
- **Responsive:** Works in iframe and all screen sizes

Once you add the squealer.ttf font file and run `npm run convert-fonts`, the AC/DC preview will be fully functional!
