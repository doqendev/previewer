// Global configuration and constants for logo previews
import customBgImgSrc from './assets/background.jpg'
import customBg2 from './assets/background2.jpg'
import dballRing from './assets/dball.png'

// Canvas dimensions
export const CANVAS_W = 800
export const CANVAS_H = 300

// Vertical offset for all logos
export const LOGO_OFFSET_Y = 0

// Scale factors and offsets for One Piece logo
export const ONEPIECE_SCALE_NORMAL = 0.95
export const ONEPIECE_SCALE_SMALL = 0.8
export const ONEPIECE_OFFSET_Y_NORMAL = LOGO_OFFSET_Y
export const ONEPIECE_OFFSET_Y_SMALL = LOGO_OFFSET_Y + 30

// Removed erroneous enum WIN
// Added missing exports for use in preview modules
export const CUSTOM_BG_MAIN = customBgImgSrc
export const CUSTOM_BG_SECOND = customBg2
export const DB_RING_SRC = dballRing
export const KERNING = { CO: -10, AS: -8, ZA: -18 }
export const WIDTH_ADJ = { D: 1.6, Z: 0.8 }
export const ONEPIECE_STYLE_CONFIGS = {
  char1: { boxFilename: 'box_luffy.png', defaultStyleImage: 'style_1.png', defaultPrimaryColor: '#dc2526', defaultSecondaryColor: '#0077f1', styleScale: 1.1 },
  char2: { boxFilename: 'box_green.png', defaultStyleImage: 'style_zoro.png', defaultPrimaryColor: '#f4ed00', defaultSecondaryColor: '#2ab100', styleScale: 1.1 },
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
  char13: { boxFilename: 'box_boa.png', defaultStyleImage: 'style_13.png', defaultPrimaryColor: '#ff0000', defaultSecondaryColor: '#000000', styleScale: 1.2 },
  char14: { boxFilename: 'box_junbe.png', defaultStyleImage: 'style_14_k.png', defaultPrimaryColor: '#ff0000', defaultSecondaryColor: '#50aefe', styleScale: 1.1 },
  char15: { boxFilename: 'box_purple.png', defaultStyleImage: 'style_15.png', defaultPrimaryColor: '#ffffff', defaultSecondaryColor: '#6803ff', styleScale: 1.2, styleWidthScale: 1.5 },
  char16: { boxFilename: 'box_purple.png', defaultStyleImage: 'style_16.png', defaultPrimaryColor: '#ffffff', defaultSecondaryColor: '#6803ff', styleScale: 1.1 },
  char17: { boxFilename: 'box_barbagrande.png', defaultStyleImage: 'style_17.png', defaultPrimaryColor: '#ffffff', defaultSecondaryColor: '#850101', styleScale: 1.2, styleWidthScale: 1.5 },
  char18: { boxFilename: 'box_red.png', defaultStyleImage: 'style_18.png', defaultPrimaryColor: '#ffffff', defaultSecondaryColor: '#ff0000', styleScale: 1.1 },
  char19: { boxFilename: 'box_red.png', defaultStyleImage: 'style_19.png', defaultPrimaryColor: '#ffffff', defaultSecondaryColor: '#ff0000', styleScale: 0.95, keepAspectRatio: true },
  char20: { boxFilename: 'box_red.png', defaultStyleImage: 'style_20.png', defaultPrimaryColor: '#ffff00', defaultSecondaryColor: '#ff0000', styleScale: 0.9, keepAspectRatio: true },
}
// Added Dragon Ball scaling and vertical offsets for multiple backgrounds
export const DRAGONBALL_SCALE_NORMAL = 1.2
export const DRAGONBALL_SCALE_SMALL = 1
export const DRAGONBALL_OFFSET_Y_NORMAL = LOGO_OFFSET_Y - 20
export const DRAGONBALL_OFFSET_Y_SMALL = LOGO_OFFSET_Y + 20

// Band-specific dual Y position adjustments (normal/small based on letter count)
export const BAND_OFFSET_Y_NORMAL = {
  metallica: LOGO_OFFSET_Y -73,
  pantera: LOGO_OFFSET_Y -60,
  ironmaiden: LOGO_OFFSET_Y,
  megadeth: LOGO_OFFSET_Y,
  acdc: LOGO_OFFSET_Y - 40
}

export const BAND_OFFSET_Y_SMALL = {
  metallica: LOGO_OFFSET_Y -55,
  pantera: LOGO_OFFSET_Y - 25,
  ironmaiden: LOGO_OFFSET_Y + 25,
  megadeth: LOGO_OFFSET_Y + 10,
  acdc: LOGO_OFFSET_Y - 15
}

// Band-specific dual scaling (normal/small based on letter count)
export const BAND_SCALE_NORMAL = {
  metallica: 1.2,
  pantera: 1.4,
  ironmaiden: 1.0,
  megadeth: 1.0,
  acdc: 1.3
}

export const BAND_SCALE_SMALL = {
  metallica: 1.1,
  pantera: 1.2,
  ironmaiden: 0.9,
  megadeth: 0.75,
  acdc: 1.1
}

// Anime character dual Y position adjustments (normal/small based on letter count)
export const ANIME_OFFSET_Y_NORMAL = {
  naruto: LOGO_OFFSET_Y,
  // Note: onepiece and dragonball already have their own specific constants above
}

export const ANIME_OFFSET_Y_SMALL = {
  naruto: LOGO_OFFSET_Y + 25,
  // Note: onepiece and dragonball already have their own specific constants above
}

// Anime character dual scaling (normal/small based on letter count)
export const ANIME_SCALE_NORMAL = {
  naruto: 1.0,
  // Note: onepiece and dragonball already have their own specific constants above
}

export const ANIME_SCALE_SMALL = {
  naruto: 0.8,
  // Note: onepiece and dragonball already have their own specific constants above
}

// Show theme dual Y position adjustments (normal/small based on letter count)
export const SHOW_OFFSET_Y_NORMAL = {
  friends: LOGO_OFFSET_Y,
  breakingbad: LOGO_OFFSET_Y,
  strangerthings: LOGO_OFFSET_Y
}

export const SHOW_OFFSET_Y_SMALL = {
  friends: LOGO_OFFSET_Y + 20,
  breakingbad: LOGO_OFFSET_Y + 15,
  strangerthings: LOGO_OFFSET_Y + 25
}

// Show theme dual scaling (normal/small based on letter count)
export const SHOW_SCALE_NORMAL = {
  friends: 1.0,
  breakingbad: 1.0,
  strangerthings: 1.0
}

export const SHOW_SCALE_SMALL = {
  friends: 0.85,
  breakingbad: 0.8,
  strangerthings: 0.9
}

// Legacy support - keeping original BAND_OFFSET_Y for compatibility
export const BAND_OFFSET_Y = BAND_OFFSET_Y_NORMAL

// AC/DC Thunder bolt configuration
export const ACDC_THUNDER_CONFIG = {
  // Thunder image size relative to font size
  THUNDER_SIZE_NORMAL: 1, // 80% of font height for normal scaling
  THUNDER_SIZE_SMALL: 0.75,  // 75% of font height for small scaling
  
  // Thunder positioning offsets relative to text position
  THUNDER_OFFSET_X: 0,  // Horizontal offset adjustment
  THUNDER_OFFSET_Y: 0, // Vertical offset adjustment (negative moves up)
  
  // Thunder placement modes based on space position in text
  PLACEMENT_MODES: {
    START: 'start',    // " ACDC" - thunder at start
    END: 'end',        // "ACDC " - thunder at end
    MIDDLE: 'middle',  // "AC DC" - thunder in middle
    NONE: 'none'       // "ACDC" - no thunder
  }
}
