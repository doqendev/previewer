import React, { useState, useRef, useEffect } from 'react'
import {
  Box,
  Container,
  Typography,
  TextField,
  Select,
  MenuItem,
  Grid,
  Stack,
  Paper,
  FormControl,
  InputLabel,
  Button,
  Switch,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Slider,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { CANVAS_W, CANVAS_H, LOGO_OFFSET_Y, CUSTOM_BG_MAIN, CUSTOM_BG_SECOND, ANIME_OFFSET_Y_NORMAL, ANIME_OFFSET_Y_SMALL, ANIME_SCALE_NORMAL, ANIME_SCALE_SMALL, SHOW_OFFSET_Y_NORMAL, SHOW_OFFSET_Y_SMALL, SHOW_SCALE_NORMAL, SHOW_SCALE_SMALL, ONEPIECE_STYLE_CONFIGS } from './previewConfig';
import { drawDragonBall } from './DragonBallPreview.jsx';
import { drawOnePiece } from './OnePiecePreview.jsx';
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
}

// Mapping of themespecific styles to product page URLs
const PRODUCT_PAGE_URLS = {
  naruto: 'https://example.com/naruto-logo',
  onepiece: 'https://www.weletyoucook.com/product-page/anime-custom-desksign',
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
  // Allow users to enlarge the preview canvas for better visibility
  const [previewScale, setPreviewScale] = useState(1.8);
  const scaledCanvasWidth = Math.round(CANVAS_W * previewScale);
  const scaledCanvasHeight = Math.round(CANVAS_H * previewScale);
  const [styleVariant, setStyleVariant] = useState('');

  const currentTheme = THEMES.find((t) => t.value === theme)
  const currentSpecific = currentTheme.options.find((o) => o.value === specific)
  const displayFontFamily = currentSpecific?.fontFamily || 'AnimeFont'
  const displayColor = currentSpecific?.color || '#ffffff'
  const isOnePieceSpecific = specific === 'onepiece'
  const styleVariantOptions = isOnePieceSpecific && variant
    ? (ONEPIECE_STYLE_CONFIGS[variant]?.styleVariants || [])
    : []
  const hasStyleVariant = styleVariantOptions.length > 0
  const hasVariant = Boolean(VARIANTS[specific])
  const columnSpan = (hasVariant || hasStyleVariant) ? 4 : 6

  useEffect(() => {
    if (!isOnePieceSpecific) {
      setStyleVariant('')
      return
    }
    const variantConfig = variant ? ONEPIECE_STYLE_CONFIGS[variant] : undefined
    const options = variantConfig?.styleVariants || []
    if (options.length === 0) {
      setStyleVariant('')
      return
    }
    const defaultOption = options.find(opt => opt.value === variantConfig?.defaultStyleVariant) || options[0]
    setStyleVariant((prev) => (prev && options.some(opt => opt.value === prev) ? prev : defaultOption.value))
  }, [isOnePieceSpecific, variant])

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const defaultSetTransform = ctx.setTransform.bind(ctx);

    let cancelled = false;
    let drawing = false;
    let needsRerender = false;

    const performDraw = async () => {
      const originalSetTransform = defaultSetTransform;
      const rect = canvas.getBoundingClientRect();
      const ratio = window.devicePixelRatio || 1;
      const cssWidth = rect.width || CANVAS_W;
      const cssHeight = rect.height || CANVAS_H;
      const displayWidth = Math.max(Math.round(cssWidth * ratio), 1);
      const displayHeight = Math.max(Math.round(cssHeight * ratio), 1);

      if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
      }

      const scaleX = canvas.width / CANVAS_W;
      const scaleY = canvas.height / CANVAS_H;
      const applyDefaultTransform = () => originalSetTransform(scaleX, 0, 0, scaleY, 0, 0);
      applyDefaultTransform();

      const patchedSetTransform = (...args) => {
        if (
          args.length === 6 &&
          args[0] === 1 && args[1] === 0 &&
          args[2] === 0 && args[3] === 1 &&
          args[4] === 0 && args[5] === 0
        ) {
          applyDefaultTransform();
        } else {
          originalSetTransform(...args);
        }
      };

      ctx.setTransform = patchedSetTransform;
      ctx.__deviceScaleX = scaleX;
      ctx.__deviceScaleY = scaleY;
      ctx.__setRawTransform = originalSetTransform;
      ctx.__applyDefaultTransform = applyDefaultTransform;

      try {
        ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

        if (cancelled) return;

        if (theme === 'anime' && specific === 'dragonball') {
          await drawDragonBall(ctx, text, useCustomBackground);
          return;
        }
        if (theme === 'anime' && specific === 'onepiece') {
          await drawOnePiece(ctx, text, variant, useCustomBackground, styleVariant);
          return;
        }
        if (theme === 'anime' && specific === 'hxh') {
          await drawHunterXHunter(ctx, text, useCustomBackground);
          return;
        }
        if (theme === 'band') {
          await drawBand(ctx, specific, text, useCustomBackground);
          return;
        }

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

        let disp = text;
        if (disp.length > 1) {
          disp =
            disp[0].toUpperCase() +
            disp.slice(1, -1) +
            disp[disp.length - 1].toUpperCase();
        } else {
          disp = disp.toUpperCase();
        }

        ctx.save();
        ctx.translate(0, LOGO_OFFSET_Y);

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
          scale = letterCount > 6 ? 0.8 : 1.0;
          offsetY = letterCount > 6 ? LOGO_OFFSET_Y + 20 : LOGO_OFFSET_Y;
        }

        const offsetX = (CANVAS_W * (1 - scale)) / 2;
        ctx.save();
        ctx.translate(offsetX, offsetY);
        ctx.scale(scale, scale);

        if (!(theme === 'anime' && specific === 'onepiece')) {
          ctx.save();
          ctx.font = `bold 70px ${displayFontFamily}, sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = displayColor;
          ctx.fillText(text, CANVAS_W / 2, CANVAS_H / 2);
          ctx.restore();
        }
        ctx.restore();
        ctx.restore();
      } finally {
        ctx.setTransform = originalSetTransform;
        applyDefaultTransform();
      }
    };

    const scheduleDraw = () => {
      if (cancelled) return;
      if (drawing) {
        needsRerender = true;
        return;
      }

      drawing = true;
      performDraw()
        .catch((err) => {
          console.error('Failed to render preview', err);
        })
        .finally(() => {
          drawing = false;
          if (needsRerender && !cancelled) {
            needsRerender = false;
            scheduleDraw();
          }
        });
    };

    scheduleDraw();

    const handleResize = () => scheduleDraw();
    window.addEventListener('resize', handleResize);

    return () => {
      cancelled = true;
      window.removeEventListener('resize', handleResize);
      ctx.setTransform = defaultSetTransform;
    };
  }, [text, theme, specific, displayFontFamily, displayColor, variant, useCustomBackground, previewScale, styleVariant]);
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
          minHeight: '100vh',
          px: { xs: 2, sm: 3, md: 6 },
          py: { xs: 3, md: 5 },
          borderRadius: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: { xs: 3, md: 4 },
          background: 'transparent',
          boxShadow: 'none',
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: 1320,
            mx: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: { xs: 3, md: 4 },
          }}
        >
          <Typography
            variant="h2"
            fontWeight={900}
            gutterBottom
            sx={{
              fontSize: { xs: '1.75rem', sm: '2.1rem', md: '2.5rem' },
              letterSpacing: '0.04em',
              background: 'linear-gradient(120deg,#ff4ecd 40%,#4361ee 70%,#fff 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              textAlign: 'center',
            }}
          >
            Name/Logo Previewer
          </Typography>

          <Grid container spacing={2} alignItems="flex-end">
            <Grid item xs={12} md={columnSpan}>
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
            </Grid>

            <Grid item xs={12} md={columnSpan}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="specific-label">{currentTheme?.label}</InputLabel>
                <Select
                  labelId="specific-label"
                  id="specific-select"
                  value={specific}
                  label={currentTheme?.label}
                  onChange={(e) => {
                    const spec = e.target.value
                    setSpecific(spec)
                    const defaultVariant = VARIANTS[spec]?.[0]?.value || ''
                    setVariant(defaultVariant)
                  }}
                >
                  {currentTheme?.options.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {hasVariant && (
              <Grid item xs={12} md={4}>
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
              </Grid>
            )}

            {hasStyleVariant && (
              <Grid item xs={12} md={4}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="style-variant-label">Style</InputLabel>
                  <Select
                    labelId="style-variant-label"
                    id="style-variant-select"
                    value={styleVariant}
                    label="Style"
                    onChange={(e) => setStyleVariant(e.target.value)}
                  >
                    {styleVariantOptions.map((opt) => (
                      <MenuItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}

            <Grid item xs={12}>
              <TextField
                fullWidth
                variant="outlined"
                label="Your Text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onFocus={() => { if (text === 'preview') setText('') }}
                inputProps={{ maxLength: 32 }}
              />
            </Grid>
          </Grid>

          <Accordion
            expanded={showAdvanced}
            onChange={() => setShowAdvanced(!showAdvanced)}
            sx={{
              background: 'rgba(255,255,255,0.85)',
              boxShadow: 'none',
              border: '1px solid rgba(0,0,0,0.12)',
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="advanced-options-content"
              id="advanced-options-header"
            >
              <Typography>Advanced Options</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack
                direction={{ xs: 'column', md: 'row' }}
                spacing={{ xs: 2, md: 3 }}
                alignItems={{ xs: 'flex-start', md: 'center' }}
                justifyContent="space-between"
              >
                <FormControlLabel
                  control={
                    <Switch
                      checked={!useCustomBackground}
                      onChange={(e) => setUseCustomBackground(!e.target.checked)}
                    />
                  }
                  label="Remove Background"
                />
                <Box sx={{ flex: 1, minWidth: { xs: '100%', md: 280 } }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Preview Size
                  </Typography>
                  <Slider
                    value={previewScale}
                    onChange={(_, value) => {
                      if (Array.isArray(value)) return
                      setPreviewScale(Number(value.toFixed(2)))
                    }}
                    min={1}
                    max={3}
                    step={0.1}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => `${Math.round(value * 100)}%`}
                  />
                  <Typography variant="caption" color="text.secondary">
                    Canvas renders at {scaledCanvasWidth}px x {scaledCanvasHeight}px
                  </Typography>
                </Box>
              </Stack>
            </AccordionDetails>
          </Accordion>

          <Box
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              border: '1px solid rgba(0,0,0,0.15)',
              borderRadius: 3,
              backgroundColor: '#0d0d0d',
              p: { xs: 2, md: 3 },
              '& canvas': {
                width: `${scaledCanvasWidth}px`,
                maxWidth: '95vw',
                height: 'auto',
                display: 'block',
                margin: '0 auto',
              },
            }}
          >
            <canvas ref={canvasRef} width={CANVAS_W} height={CANVAS_H} />
          </Box>

          <Button
            variant="contained"
            color="primary"
            sx={{
              alignSelf: { xs: 'stretch', sm: 'flex-start' },
              py: { xs: 1, sm: 1.3 },
              px: { xs: 3, sm: 4 },
              fontSize: { xs: '0.95rem', sm: '1.05rem' },
              borderRadius: 3,
              fontWeight: 'bold',
            }}
            onClick={() => {
              const url = PRODUCT_PAGE_URLS[specific] || 'https://example.com/default-product-page'
              window.open(url, '_blank')
            }}
          >
            Buy Now
          </Button>
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          sx={{
            opacity: 0.7,
            fontSize: { xs: '0.7rem', sm: '0.875rem' },
          }}
        >
          &copy; {new Date().getFullYear()} Logo Previewer - UI by Material UI.
        </Typography>
      </Paper>
    </Container>
  )
}
