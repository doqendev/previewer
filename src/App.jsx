import React, { useState, useRef, useEffect } from 'react'
import {
  Box,
  Container,
  Typography,
  TextField,
  Select,
  MenuItem,
  Paper,
  FormControl,
  InputLabel,
  Button,
  Switch,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { CANVAS_W, CANVAS_H, LOGO_OFFSET_Y, CUSTOM_BG_MAIN } from './previewConfig';
import { drawDragonBall } from './DragonBallPreview.jsx';
import { drawOnePiece } from './OnePiecePreview.jsx';
import { drawBand } from './BandPreview.jsx';

// map internal fontFamily names to Drei Text3D JSON files
const FONT_JSON_MAP = {
  AnimeFont: 'AnimeFont.json',
  ONEPIECE_IL_FINAL: 'ONEPIECE_IL_FINAL.json',
  db: 'db.json',
  Metallica_ILL: 'Metallica_ILL.json',
  Metal_Lord_Neww: 'Metal_Lord_Neww.json',
  Shredded_IL: 'Shredded_IL.json',
  Megadeth_IL: 'Megadeth_IL2.json',
  ShowFont: 'ShowFont.json',
};

const THEMES = [
  {
    label: 'Anime',
    value: 'anime',
    options: [
      { label: 'Naruto', value: 'naruto', fontFamily: 'AnimeFont', color: '#ff9900' },
      { label: 'One Piece', value: 'onepiece', fontFamily: 'AnimeFont', color: '#0099ff' },
      { label: 'Dragon Ball', value: 'dragonball', fontFamily: 'db', color: '#fbc2eb' },
    ],
  },
  {
    label: 'Band',
    value: 'band',
    options: [
      { label: 'Metallica', value: 'metallica', fontFamily: 'Metallica_ILL', color: '#e63946' },
      { label: 'Iron Maiden', value: 'ironmaiden', fontFamily: 'Metal_Lord_Neww', color: '#ffd700' },
      { label: 'Pantera', value: 'pantera', fontFamily: 'Shredded_IL', color: '#b71c1c' },
      { label: 'Megadeth', value: 'megadeth', fontFamily: 'Megadeth_IL', color: '#bfa14a' },
    ],
  },
  {
    label: 'Show',
    value: 'show',
    options: [
      { label: 'Friends', value: 'friends', fontFamily: 'ShowFont', color: '#4361ee' },
      { label: 'Breaking Bad', value: 'breakingbad', fontFamily: 'ShowFont', color: '#388e3c' },
      { label: 'Stranger Things', value: 'strangerthings', fontFamily: 'ShowFont', color: '#d7263d' },
    ],
  },
]

// Define logo variants for specific themes
const VARIANTS = {
  onepiece: [
    { label: 'Char1', value: 'char1' },
    { label: 'Char2', value: 'char2' },
    { label: 'Char3', value: 'char3' },
    { label: 'Char4', value: 'char4' },
    { label: 'Char5', value: 'char5' },
    { label: 'Char6', value: 'char6' },
    { label: 'Char7', value: 'char7' },
    { label: 'Char8', value: 'char8' },
    { label: 'Char9', value: 'char9' },
    { label: 'Char10', value: 'char10' },
    { label: 'Char11', value: 'char11' },
    { label: 'Char12', value: 'char12' },
    { label: 'Char13', value: 'char13' },
    { label: 'Char14', value: 'char14' },
    { label: 'Char15', value: 'char15' },
    { label: 'Char16', value: 'char16' },
    { label: 'Char17', value: 'char17' },
    { label: 'Char18', value: 'char18' },
  ],
}

// Style configuration for One Piece character variants
const ONEPIECE_STYLE_CONFIGS = {
  char1: { boxFilename: 'box_luffy.png', defaultStyleImage: 'style_1.png', defaultPrimaryColor: '#dc2526', defaultSecondaryColor: '#0077f1', styleScale: 1.1 },
  char2: { boxFilename: 'box_green.png', defaultStyleImage: 'style_2.png', defaultPrimaryColor: '#f4ed00', defaultSecondaryColor: '#2ab100', styleScale: 1.1  },
  char3: { boxFilename: 'box_orange.png', defaultStyleImage: 'style_3.png', defaultPrimaryColor: '#c80000', defaultSecondaryColor: '#e06f00', styleScale: 1.1 },
  char4: { boxFilename: 'box_pink.png', defaultStyleImage: 'style_4.png', defaultPrimaryColor: '#ffffff', defaultSecondaryColor: '#f003ff', styleScale: 1.2 },
  char5: { boxFilename: 'box_yellow.png', defaultStyleImage: 'style_5.png', defaultPrimaryColor: '#ffffff', defaultSecondaryColor: '#f9da06' },
  char6: { boxFilename: 'box_red.png', defaultStyleImage: 'style_6.png', defaultPrimaryColor: '#ffffff', defaultSecondaryColor: '#f30011', styleScale: 1.3 },
  char7: { boxFilename: 'box_nami.png', defaultStyleImage: 'style_7.png', defaultPrimaryColor: '#f47301', defaultSecondaryColor: '#00c892', styleScale: 1.2 },
  char8: { boxFilename: 'box.png', defaultStyleImage: 'style_8.png', defaultPrimaryColor: '#f9da06', defaultSecondaryColor: '#0077f1', styleScale: 1.15 },
  char9: { boxFilename: 'box_purple.png', defaultStyleImage: 'style_9.png', defaultPrimaryColor: '#FF0000', defaultSecondaryColor: '#6803ff', styleScale: 1.1 },
  char10: { boxFilename: 'box_yellow.png', defaultStyleImage: 'style_10.png', defaultPrimaryColor: '#a2a2a2', defaultSecondaryColor: '#e8da00', styleScale: 1.2 },
  char11: { boxFilename: 'box_grey.png', defaultStyleImage: 'style_11.png', defaultPrimaryColor: '#e8da00', defaultSecondaryColor: '#a2a2a2', styleScale: 1.2 },
  char12: { boxFilename: 'box_tropa.png', defaultStyleImage: 'style_12.png', defaultPrimaryColor: '#ffffff', defaultSecondaryColor: '#48620c', styleScale: 1.2 },
  char13: { boxFilename: 'box_boa.png', defaultStyleImage: 'style_13.png', defaultPrimaryColor: '#ff0000', defaultSecondaryColor: '#000000', styleScale: 1.2  },
  char14: { boxFilename: 'box_junbe.png', defaultStyleImage: 'style_14_k.png', defaultPrimaryColor: '#ff0000', defaultSecondaryColor: '#50aefe', styleScale: 1.1  },
  char15: { boxFilename: 'box_purple.png', defaultStyleImage: 'style_15.png', defaultPrimaryColor: '#ffffff', defaultSecondaryColor: '#6803ff', styleScale: 1.2, styleWidthScale: 1.5  },
  char16: { boxFilename: 'box_purple.png', defaultStyleImage: 'style_16.png', defaultPrimaryColor: '#ffffff', defaultSecondaryColor: '#6803ff', styleScale: 1.1  },
  char17: { boxFilename: 'box_barbagrande.png', defaultStyleImage: 'style_17.png', defaultPrimaryColor: '#ffffff', defaultSecondaryColor: '#850101', styleScale: 1.2 , styleWidthScale: 1.5 },
  char18: { boxFilename: 'box_red.png', defaultStyleImage: 'style_18.png', defaultPrimaryColor: '#ffffff', defaultSecondaryColor: '#ff0000', styleScale: 1.1  },
}

// Mapping of themespecific styles to product page URLs
const PRODUCT_PAGE_URLS = {
  naruto: 'https://example.com/naruto-logo',
  onepiece: 'https://www.weletyoucook.com/product-page/anime-custom-desksign',
  dragonball: 'https://example.com/dragon-ball-logo',
  metallica: 'https://example.com/metallica-logo',
  ironmaiden: 'https://example.com/iron-maiden-logo',
  pantera: 'https://example.com/pantera-logo',
  megadeth: 'https://example.com/megadeth-logo',
  friends: 'https://example.com/friends-logo',
  breakingbad: 'https://example.com/breaking-bad-logo',
  strangerthings: 'https://example.com/stranger-things-logo',
}

export default function App() {
  const [text, setText] = useState('preview')
  const [use3D, setUse3D] = useState(false)
  const [theme, setTheme] = useState('anime')
  const [specific, setSpecific] = useState('naruto')
  const [variant, setVariant] = useState('')
  const canvasRef = useRef(null)
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [useCustomBackground, setUseCustomBackground] = useState(false);
  // Vertical offset for all logos; adjust this value in code as needed
  const LOGO_OFFSET_Y = 0;

  const currentTheme = THEMES.find((t) => t.value === theme)
  const currentSpecific = currentTheme.options.find((o) => o.value === specific)
  // JSON font URL for Drei Text3D
  const jsonFile = FONT_JSON_MAP[currentSpecific.fontFamily]
  const fontJsonUrl = jsonFile ? `${import.meta.env.BASE_URL}fonts/${jsonFile}` : undefined
  // enable 3D preview only for Metallica logo
  const is3DAvailable = specific === 'metallica' && Boolean(fontJsonUrl)

  // reset 3D mode when switching away
  useEffect(() => {
    if (specific !== 'metallica' && use3D) setUse3D(false)
  }, [specific, use3D])

  useEffect(() => {
    const draw = async () => {
      const canvas = canvasRef.current; if (!canvas) return;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
      // Delegate to specialized previews
      if (theme === 'anime' && specific === 'dragonball') {
        await drawDragonBall(ctx, text, useCustomBackground);
        return;
      }
      if (theme === 'anime' && specific === 'onepiece') {
        await drawOnePiece(ctx, text, variant, useCustomBackground);
        return;
      }
      // Band logo previews
      if (theme === 'band') {
        await drawBand(ctx, specific, text);
        return;
      }
      // Generic custom background
      if (useCustomBackground) {
        const bg = new Image();
        bg.src = CUSTOM_BG_MAIN;
        await new Promise(r => (bg.onload = r));
        ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.drawImage(bg, 0, 0, CANVAS_W, CANVAS_H);
        ctx.restore();
      }

      // Metallica
      if (theme === 'band' && specific === 'metallica') {
        ctx.save();
        ctx.translate(0, LOGO_OFFSET_Y);
        ctx.save()
        ctx.font = 'bold 70px Metallica_ILL, sans-serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.lineJoin = 'round'
        ctx.lineCap = 'round'
        ctx.lineWidth = 10
        ctx.strokeStyle = '#000'
        ctx.strokeText(disp, CANVAS_W / 2, CANVAS_H / 2)
        ctx.fillStyle = '#fff'
        ctx.lineWidth = 4
        ctx.strokeText(disp, CANVAS_W / 2, CANVAS_H / 2)
        ctx.fillText(disp, CANVAS_W / 2, CANVAS_H / 2)
        ctx.restore()
        ctx.restore();
        return
      }

      // Pantera
      if (theme === 'band' && specific === 'pantera') {
        ctx.save();
        ctx.translate(0, LOGO_OFFSET_Y);
        ctx.save()
        await document.fonts.load('bold 120px Shredded_IL')
        ctx.font = 'bold 120px Shredded_IL, sans-serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.lineJoin = 'round'
        ctx.lineCap = 'round'
        ctx.lineWidth = 18
        ctx.strokeStyle = '#000'
        ctx.strokeText(disp, CANVAS_W / 2, CANVAS_H / 2)
        ctx.fillStyle = '#fff'
        ctx.lineWidth = 6
        ctx.strokeText(disp, CANVAS_W / 2, CANVAS_H / 2)
        ctx.fillText(disp, CANVAS_W / 2, CANVAS_H / 2)
        ctx.restore()
        ctx.restore();
        return
      }

      // Iron Maiden
      if (theme === 'band' && specific === 'ironmaiden') {
        ctx.save();
        ctx.translate(0, LOGO_OFFSET_Y);
        ctx.save()
        await document.fonts.load('bold 70px Metal_Lord_Neww')
        ctx.font = 'bold 70px Metal_Lord_Neww, sans-serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.lineWidth = 24
        ctx.strokeStyle = '#000'
        ctx.strokeText(disp, CANVAS_W / 2, CANVAS_H / 2)
        ctx.lineWidth = 8
        ctx.strokeStyle = '#fff'
        ctx.strokeText(disp, CANVAS_W / 2, CANVAS_H / 2)
        ctx.fillStyle = '#e63946'
        ctx.fillText(disp, CANVAS_W / 2, CANVAS_H / 2)
        ctx.restore()
        ctx.restore();
        return
      }

      // Megadeth
      if (theme === 'band' && specific === 'megadeth') {
        ctx.save();
        ctx.translate(0, LOGO_OFFSET_Y);
        ctx.save()
        await document.fonts.load('bold 120px Megadeth_IL')
        ctx.font = '120px Megadeth_IL, sans-serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.lineJoin = 'round'
        ctx.lineCap = 'round'
        ctx.lineWidth = 15
        ctx.strokeStyle = '#bfa14a'
        ctx.strokeText(disp, CANVAS_W / 2, CANVAS_H / 2)
        ctx.lineWidth = 5
        ctx.strokeStyle = '#fff9d1'
        ctx.strokeText(disp, CANVAS_W / 2, CANVAS_H / 2)
        ctx.fillStyle = '#ffe784'
        ctx.fillText(disp, CANVAS_W / 2, CANVAS_H / 2)
        ctx.restore()
        ctx.restore();
        return
      }

      // Shared helper to uppercase and stylize band labels
      let disp = text
      if (disp.length > 1) {
        disp =
          disp[0].toUpperCase() +
          disp.slice(1, -1) +
          disp[disp.length - 1].toUpperCase()
      } else {
        disp = disp.toUpperCase()
      }

      // Generic 2D styles
      ctx.save();
      ctx.translate(0, LOGO_OFFSET_Y);
      if (!(theme === 'anime' && specific === 'onepiece')) {
        ctx.save()
        ctx.font = `bold 70px ${currentSpecific.fontFamily}, sans-serif`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillStyle = currentSpecific.color
        ctx.fillText(text, CANVAS_W / 2, CANVAS_H / 2) // Use original text for these simpler previews
        ctx.restore()
      }
      ctx.restore();
    }

    draw()
  }, [text, theme, specific, currentSpecific?.fontFamily, currentSpecific?.color, variant, useCustomBackground])
  // 3D / display casing logic matching 2D
  const dispString = text.length > 1
    ? text[0].toUpperCase() + text.slice(1, -1) + text[text.length - 1].toUpperCase()
    : text.toUpperCase()

  return (
    <Container
      maxWidth="sm"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        bgcolor: 'background.default',
        py: 6,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: '100%',
          p: { xs: 2, sm: 5 },
          borderRadius: 6,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 5,
          backdropFilter: 'blur(12px)',
          background: 'rgba(255,255,255,0.95)',
          boxShadow: '0 10px 30px 4px #bbb5',
        }}
      >
        <Typography
          variant="h2"
          align="center"
          fontWeight={900}
          gutterBottom
          sx={{
            fontSize: { xs: '2.3rem', sm: '3.2rem' },
            letterSpacing: '0.04em',
            background: 'linear-gradient(120deg,#ff4ecd 40%,#4361ee 70%,#fff 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
          }}
        >
          Name/Logo Previewer
        </Typography>

        <Box // Box for theme and specific selectors
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            width: '100%',
          }}
        >
          <FormControl fullWidth variant="outlined">
            <InputLabel id="theme-label">Theme</InputLabel>
            <Select
              labelId="theme-label"
              id="theme-select"
              value={theme}
              label="Theme"
              onChange={(e) => {
                setTheme(e.target.value)
                const first = THEMES.find((t) => t.value === e.target.value).options[0].value
                setSpecific(first)
                setVariant(first === 'onepiece' ? VARIANTS.onepiece[0].value : '')
              }}
            >
              {THEMES.map((t) => (
                <MenuItem key={t.value} value={t.value}>
                  {t.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth variant="outlined">
            <InputLabel id="specific-label">{currentTheme?.label}</InputLabel> 
            <Select
              labelId="specific-label"
              id="specific-select"
              value={specific}
              label={currentTheme?.label} // Optional chaining
              onChange={(e) => {
                const spec = e.target.value
                setSpecific(spec)
                setVariant(spec === 'onepiece' ? VARIANTS.onepiece[0].value : '')
              }}
            >
              {currentTheme?.options.map((opt) => ( // Optional chaining
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {/* Variant selector for logos with multiple variants */}
          {specific === 'onepiece' && (
            <FormControl fullWidth variant="outlined">
              <InputLabel id="variant-label">Variant</InputLabel>
              <Select
                labelId="variant-label"
                id="variant-select"
                value={variant}
                label="Variant"
                onChange={(e) => setVariant(e.target.value)}
              >
                {VARIANTS.onepiece.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          {/* 3D preview toggle only for Metallica */}
          {is3DAvailable && (
            <FormControlLabel
              control={
                <Switch
                  checked={use3D}
                  onChange={() => setUse3D(prev => !prev)}
                />
              }
              label="3D Preview"
            />
          )}
        </Box>

        <TextField
          fullWidth
          variant="outlined"
          label="Your Text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onFocus={() => { if (text === 'preview') setText('') }}
          inputProps={{ maxLength: 32 }}
        />

        {/* Advanced Options Accordion */}
        <Box sx={{ width: '100%', mt: 2 }}>
          <Accordion expanded={showAdvanced} onChange={() => setShowAdvanced(!showAdvanced)} sx={{background: 'rgba(255,255,255,0.8)', boxShadow: 'none', border: '1px solid rgba(0,0,0,0.1)'}}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="advanced-options-content"
              id="advanced-options-header"
            >
              <Typography>Advanced Options</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <FormControlLabel
                control={
                  <Switch
                    checked={useCustomBackground}
                    onChange={(e) => setUseCustomBackground(e.target.checked)}
                  />
                }
                label="Use Custom Background"
              />
            </AccordionDetails>
          </Accordion>
        </Box>

        <Box // Box for canvas/3D preview
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            mt: 2,
            border: '1px solid #ccc', // Added a subtle border to canvas/preview area
            overflow: 'hidden', // Ensure canvas content fits
          }}
        >
          {use3D ? (
            fontJsonUrl ? (
               <ThreeDPreview
                 text={dispString}
                 fontJsonUrl={fontJsonUrl}
                 useCustomBackground={useCustomBackground}
                 customBgImgSrc={CUSTOM_BG_MAIN}
               />
            ) : (
              <Typography color="error">3D preview not available for this font</Typography>
            )
             ) : (
            <canvas ref={canvasRef} width={CANVAS_W} height={CANVAS_H} />
          )}
        </Box>

        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 4, py: 1.5, px: 5, fontSize: '1.1rem', borderRadius: 3, fontWeight: 'bold' }}
          onClick={() => {
            const url = PRODUCT_PAGE_URLS[specific] || 'https://example.com/default-product-page'
            window.open(url, '_blank')
          }}
        >
          Buy Now
        </Button>
      </Paper>

      <Typography
        variant="body2"
        color="text.secondary"
        align="center"
        sx={{ mt: 4, opacity: 0.7 }}
      >
        &copy; {new Date().getFullYear()} Logo Previewer — UI by Material UI.
      </Typography>
    </Container>
  )
}
