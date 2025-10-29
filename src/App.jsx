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
import { CANVAS_W, CANVAS_H, LOGO_OFFSET_Y, CUSTOM_BG_MAIN, CUSTOM_BG_SECOND, ANIME_OFFSET_Y_NORMAL, ANIME_OFFSET_Y_SMALL, ANIME_SCALE_NORMAL, ANIME_SCALE_SMALL, SHOW_OFFSET_Y_NORMAL, SHOW_OFFSET_Y_SMALL, SHOW_SCALE_NORMAL, SHOW_SCALE_SMALL } from './previewConfig';
import { drawDragonBall } from './DragonBallPreview.jsx';
import { drawOnePiece } from './OnePiecePreview.jsx';
import { drawOnePieceNew } from './OnePiecePreviewNew.jsx';
import { drawBand } from './BandPreview.jsx';
import { drawHunterXHunter } from './HunterXHunterPreview.jsx';

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
  Squealer: 'squealer.json',
};

const THEMES = [
  {
    label: 'Anime',
    value: 'anime',
    options: [
      { label: 'Naruto', value: 'naruto', fontFamily: 'AnimeFont', color: '#ff9900' },
      { label: 'One Piece', value: 'onepiece', fontFamily: 'AnimeFont', color: '#0099ff' },
      { label: 'One Piece (New)', value: 'onepiece-new', fontFamily: 'AnimeFont', color: '#0099ff' },
      { label: 'Dragon Ball', value: 'dragonball', fontFamily: 'db', color: '#fbc2eb' },
      { label: 'Hunter x Hunter', value: 'hxh', fontFamily: 'PLZ', color: '#c60000' },
    ],
  },  {
    label: 'Band',
    value: 'band',
    options: [
      { label: 'Metallica', value: 'metallica', fontFamily: 'Metallica_ILL', color: '#e63946' },
      { label: 'Iron Maiden', value: 'ironmaiden', fontFamily: 'Metal_Lord_Neww', color: '#ffd700' },
      { label: 'Pantera', value: 'pantera', fontFamily: 'Shredded_IL', color: '#b71c1c' },
      { label: 'Megadeth', value: 'megadeth', fontFamily: 'Megadeth_IL', color: '#bfa14a' },
      { label: 'AC/DC', value: 'acdc', fontFamily: 'Squealer', color: '#ff0000' },
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
const ONEPIECE_VARIANTS = [
  { label: 'Luffy', value: 'char1' },
  { label: 'Zoro', value: 'char2' },
  { label: 'Ace', value: 'char3' },
  { label: 'Chopper', value: 'char4' },
  { label: 'Law', value: 'char5' },
  { label: 'Shanks', value: 'char6' },
  { label: 'Nami', value: 'char7' },
  { label: 'Franky', value: 'char8' },
  { label: 'Robin', value: 'char9' },
  { label: 'Sanji', value: 'char10' },
  { label: 'Brook', value: 'char11' },
  { label: 'Ussop', value: 'char12' },
  { label: 'Boa', value: 'char13' },
  { label: 'Jinbe', value: 'char14' },
  { label: 'Kaido', value: 'char15' },
  { label: 'Whitebeard', value: 'char16' },
  { label: 'Roger', value: 'char17' },
  { label: 'Buggy', value: 'char18' },
  { label: 'Blackbeard', value: 'char19' },
  { label: 'Eustass Kid', value: 'char20' },
]

const VARIANTS = {
  onepiece: ONEPIECE_VARIANTS,
  'onepiece-new': ONEPIECE_VARIANTS,
}

// Style configuration for One Piece character variants
const ONEPIECE_STYLE_CONFIGS = {
  char1: { boxFilename: 'box_luffy.png', defaultStyleImage: 'style_1.png', defaultPrimaryColor: '#dc2526', defaultSecondaryColor: '#0077f1', styleScale: 1.1 },
  char2: { boxFilename: 'box_green.png', defaultStyleImage: 'style_2.png', defaultPrimaryColor: '#f4ed00', defaultSecondaryColor: '#2ab100', styleScale: 1.1  },
  char3: { boxFilename: 'box_orange.png', defaultStyleImage: 'style_3.svg', defaultPrimaryColor: '#c80000', defaultSecondaryColor: '#e06f00', styleScale: 1.1 },
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
  char19: { boxFilename: 'box_red.png', defaultStyleImage: 'style_19.png', defaultPrimaryColor: '#ffffff', defaultSecondaryColor: '#ff0000', styleScale: 0.95, keepAspectRatio: true },
  char20: { boxFilename: 'box_red.png', defaultStyleImage: 'style_20.png', defaultPrimaryColor: '#ffff00', defaultSecondaryColor: '#ff0000', styleScale: 0.9, keepAspectRatio: true },
}

// Mapping of themespecific styles to product page URLs
const PRODUCT_PAGE_URLS = {
  naruto: 'https://example.com/naruto-logo',
  onepiece: 'https://www.weletyoucook.com/product-page/anime-custom-desksign',
  'onepiece-new': 'https://www.weletyoucook.com/product-page/anime-custom-desksign',
  dragonball: 'https://example.com/dragon-ball-logo',
  hxh: 'https://example.com/hunter-x-hunter-logo',
  metallica: 'https://example.com/metallica-logo',
  ironmaiden: 'https://example.com/iron-maiden-logo',
  pantera: 'https://example.com/pantera-logo',
  megadeth: 'https://example.com/megadeth-logo',
  acdc: 'https://example.com/acdc-logo',
  friends: 'https://example.com/friends-logo',
  breakingbad: 'https://example.com/breaking-bad-logo',
  strangerthings: 'https://example.com/stranger-things-logo',
}

export default function App() {
  const [text, setText] = useState('preview')
  const [theme, setTheme] = useState('anime')
  const [specific, setSpecific] = useState('naruto')
  const [variant, setVariant] = useState('')
  const canvasRef = useRef(null)
  const [showAdvanced, setShowAdvanced] = useState(false);
  // Background image is active by default; toggle to remove it
  const [useCustomBackground, setUseCustomBackground] = useState(true);
  // Vertical offset for all logos; adjust this value in code as needed
  const LOGO_OFFSET_Y = 0;

  const currentTheme = THEMES.find((t) => t.value === theme)
  const currentSpecific = currentTheme.options.find((o) => o.value === specific)

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
      if (theme === 'anime' && specific === 'onepiece-new') {
        await drawOnePieceNew(ctx, text, variant, useCustomBackground);
        return;
      }
      if (theme === 'anime' && specific === 'hxh') {
        await drawHunterXHunter(ctx, text, useCustomBackground);
        return;
      }
      // Band logo previews
      if (theme === 'band') {
        // pass background flag to band preview
        await drawBand(ctx, specific, text, useCustomBackground);
        return;      }
      // Generic dual background for all remaining themes (anime naruto, show themes)
      if (useCustomBackground) {
        const letterCount = text.replace(/\s/g, '').length;
        const bg = new Image();
        bg.src = letterCount > 6 ? CUSTOM_BG_SECOND : CUSTOM_BG_MAIN;
        await new Promise(r => (bg.onload = r));
        ctx.save(); 
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.drawImage(bg, 0, 0, CANVAS_W, CANVAS_H);
        ctx.restore();
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

      // Generic 2D styles with dual scaling and offsets
      ctx.save();
      ctx.translate(0, LOGO_OFFSET_Y);
      
      // Apply scaling and vertical offset based on text length and theme
      const letterCount = text.replace(/\s/g, '').length;
      let scale, offsetY;
      
      if (theme === 'anime') {
        scale = letterCount > 6 
          ? (ANIME_SCALE_SMALL[specific] || 0.8) 
          : (ANIME_SCALE_NORMAL[specific] || 1.0);
        offsetY = letterCount > 6 
          ? (ANIME_OFFSET_Y_SMALL[specific] || LOGO_OFFSET_Y + 25)
          : (ANIME_OFFSET_Y_NORMAL[specific] || LOGO_OFFSET_Y);
      } else if (theme === 'show') {
        scale = letterCount > 6 
          ? (SHOW_SCALE_SMALL[specific] || 0.8) 
          : (SHOW_SCALE_NORMAL[specific] || 1.0);
        offsetY = letterCount > 6 
          ? (SHOW_OFFSET_Y_SMALL[specific] || LOGO_OFFSET_Y + 20)
          : (SHOW_OFFSET_Y_NORMAL[specific] || LOGO_OFFSET_Y);
      } else {
        // Fallback for any other themes
        scale = letterCount > 6 ? 0.8 : 1.0;
        offsetY = letterCount > 6 ? LOGO_OFFSET_Y + 20 : LOGO_OFFSET_Y;
      }
        const offsetX = (CANVAS_W * (1 - scale)) / 2;
      ctx.save();
      ctx.translate(offsetX, offsetY);
      ctx.scale(scale, scale);
      
      if (!(theme === 'anime' && (specific === 'onepiece' || specific === 'onepiece-new'))) {
        ctx.save();
        ctx.font = `bold 70px ${currentSpecific.fontFamily}, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = currentSpecific.color;
        ctx.fillText(text, CANVAS_W / 2, CANVAS_H / 2); // Use original text for these simpler previews
        ctx.restore();
      }
      ctx.restore(); // restore scale and offset
      ctx.restore(); // restore initial translate
    }

    draw()
  }, [text, theme, specific, currentSpecific?.fontFamily, currentSpecific?.color, variant, useCustomBackground])
  // Removed dispString as 3D preview is disabled
  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: '100%',
          minHeight: '100vh',
          p: { xs: 2, sm: 3, md: 5 },
          borderRadius: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          gap: { xs: 2, sm: 3 },
          backdropFilter: 'none',
          background: 'transparent',
          boxShadow: 'none',
        }}
        >
          <Typography
            variant="h2"
            fontWeight={900}
            gutterBottom
            sx={{
              fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.75rem' },
              letterSpacing: '0.04em',
              background: 'linear-gradient(120deg,#ff4ecd 40%,#4361ee 70%,#fff 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              mb: { xs: 1, sm: 2 },
            }}
          >
            Name/Logo Previewer
        </Typography>

        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
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
                const newTheme = e.target.value
                setTheme(newTheme)
                const themeEntry = THEMES.find((t) => t.value === newTheme)
                const firstSpecific = themeEntry?.options?.[0]?.value || ''
                setSpecific(firstSpecific)
                const defaultVariant = VARIANTS[firstSpecific]?.[0]?.value || ''
                setVariant(defaultVariant)
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
                const defaultVariant = VARIANTS[spec]?.[0]?.value || ''
                setVariant(defaultVariant)
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
          {VARIANTS[specific] && (
            <FormControl fullWidth variant="outlined">
              <InputLabel id="variant-label">Variant</InputLabel>
              <Select
                labelId="variant-label"
                id="variant-select"
                value={variant}
                label="Variant"
                onChange={(e) => setVariant(e.target.value)}
              >
                {VARIANTS[specific].map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
        <Box sx={{ width: '100%' }}>
          <Accordion expanded={showAdvanced} onChange={() => setShowAdvanced(!showAdvanced)} sx={{ background: 'rgba(255,255,255,0.85)', boxShadow: 'none', border: '1px solid rgba(0,0,0,0.12)' }}>
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
                    checked={!useCustomBackground}
                    onChange={(e) => setUseCustomBackground(!e.target.checked)}
                  />
                }
                label="Remove Background"
              />
            </AccordionDetails>
          </Accordion>
        </Box>

        <Box
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            border: '1px solid rgba(0,0,0,0.15)',
            borderRadius: 3,
            overflow: 'hidden',
            backgroundColor: '#0d0d0d',
            '& canvas': {
              width: '100%',
              height: 'auto',
              display: 'block',
              aspectRatio: `${CANVAS_W} / ${CANVAS_H}`,
            }
          }}
        >
          {/* Always render 2D canvas; 3D preview on hold */}
          <canvas ref={canvasRef} width={CANVAS_W} height={CANVAS_H} />
        </Box>

        <Button
          variant="contained"
          color="primary"
          sx={{
            alignSelf: { xs: 'stretch', sm: 'flex-start' },
            py: { xs: 1, sm: 1.5 },
            px: { xs: 3, sm: 5 },
            fontSize: { xs: '0.9rem', sm: '1.1rem' },
            borderRadius: 3,
            fontWeight: 'bold'
          }}
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
        sx={{
          pt: { xs: 1, sm: 2 },
          opacity: 0.7,
          fontSize: { xs: '0.7rem', sm: '0.875rem' }
        }}
      >
        &copy; {new Date().getFullYear()} Logo Previewer - UI by Material UI.
      </Typography>
    </Container>
  )
}
