import { useMemo } from 'react';
import useThemeStore from '../store/useThemeStore';

const sharedBase: Record<string, any> = {
  // Brand
  PRIMARY: '#1A73E8',
  PRIMARY_LIGHT: '#4FC3F7',
  PRIMARY_20: '#1A73E820',
  PRIMARY_50: '#1A73E850',
  PRIMARY_80: '#1A73E880',
  SECONDARY: '#4FC3F7',
  SECONDARY_20: '#4FC3F720',
  SECONDARY_50: '#4FC3F750',
  SECONDARY_80: '#4FC3F780',

  // Alerts & State
  SUCCESS: '#2ECC71',
  SUCCESS_20: '#2ECC7120',
  SUCCESS_50: '#2ECC7150',
  SUCCESS_80: '#2ECC7180',
  WARNING: '#F2C94C',
  ALERT: '#EB5757',
  RED: '#EB5757',
  RED_50: '#EB575780',
  warning: '#F2C94C',

  // Utility
  WHITE: '#FFFFFF',
  WHITE_80: '#FFFFFFCC',
  WHITE_50: '#FFFFFF80',
  WHITE_20: '#FFFFFF20',
  BLACK: '#0E1525',
  BLACK_80: '#0E1525CC',
  BLACK_50: '#0E152580',
  BLACK_20: '#0E152533',
  BLACK_FONT: '#1C1C1E',
  transparent: 'transparent',

  // Grays & Neutrals
  GREY: '#9CA3AF',
  GRAY: '#9CA3AF',
  gray: '#9CA3AF',
  GRAY_LIGHT: '#ECEFF1',
  GRAY_MEDIUM: '#CFD8DC',
  GRAY_DARK: '#6B7280',
  GRAY_BLACK: '#607D8B',
  GRAY_WHITE: '#F2F4F7',
  LIGHT_GRAY: '#E5E7EB',
  SOFT_GRAY: '#E5E7EB',
  charcoal: '#4B5563',
  charcoal05opacity: '#4B556333',
  charcoal07opacity: '#4B55634D',
  charcoal09opacity: '#4B556366',
  smoke: '#F8FAFC',
  borderStone: '#E5E7EB',

  // Additional palette (used across legacy screens)
  PINK: '#FAD4E2',
  PURPLE: '#9B51E0',
  YELLOW: '#F2C94C',
  LIGHT_BLUE: '#E6F0FF',
  LIGHT_KHAKI: '#F9F5E7',
  LIGHT_STEEL_BLUE: '#B0C4DE',
  LIGHT_STEEL_PINK: '#E4C6D5',
  MEDIUM_AQUAMARINE: '#66CDAA',
  MEDIUM_TURQUOISE: '#48D1CC',
  MOUNTBATTEN_PINK: '#997A8D',
  NEW_YORK_PINK: '#D7837F',
  PALE_TURQUOISE: '#AFEEEE',
  POWDER_BLUE: '#B0E0E6',
  QUILL_GRAY: '#D6D6D6',
  RAJAH: '#F7B267',
  SALMON: '#FA8072',
  SILVER_CHALICE: '#BDBDBD',
  SKEPTIC: '#CFE8CF',
  STEEL_BLUE: '#4682B4',
  THISTLE: '#D8BFD8',
  TOMATO: '#FF6347',
  TURQUOISE_GREEN: '#A4D3C9',
  WHEAT: '#F5DEB3',
  ANTIQUE_WHITE: '#FAEBD7',
  BARLEY_CORN: '#A68B5B',
  BEAUTY_BUSH: '#EEC9D2',
  BROWN: '#A52A2A',
  BURLY_WOOD: '#DEB887',
  DARK_OLIVE_GREEN: '#556B2F',
  DARK_SEA_GREEN: '#8FBC8F',
  DARK_SLATE_BLUE: '#483D8B',
  DARK_SLATE_GREY: '#2F4F4F',
  DUST_STORM: '#E5CCC9',
  INDIAN_RED: '#CD5C5C',
  LIGHT_SLATE_GREY: '#778899',
  YOUR_PINK: '#FFC1CC',
  PRIMARY_LIGHT_ALT: '#5CB3FF',
  BLUE_BADGE: '#2563EB',
  HIGHLIGHT: '#E0ECFF',
  LIGHT_STEEL: '#F1F5F9',
  SOFT_WHITE: '#F6F8FB',
  SOFT_PRIMARY: '#A5C9FF',
  SOFT_DIM: '#F2F4F8',
  LIGHT_STEEL_BLUE_ALT: '#D7E3F4',
  LIGHT_STEEL_PINK_ALT: '#F3DDE8',
  MUTE_BLUE: '#334155',
  find: '#1A73E8',
  fontLabel: '#9CA3AF',
  greenlight: '#34D399',
  orangelight: '#FDBA74',
  redlight: '#FCA5A5',
  vermilion: '#E34234',
};

const buildPalette = (overrides: Record<string, any>) => {
  const palette = { ...sharedBase, ...overrides };
  return new Proxy(palette, {
    get(target, prop: string) {
      if (prop in target) {
        return target[prop];
      }
      return sharedBase[prop] ?? sharedBase.PRIMARY;
    },
  });
};

const lightPalette: any = buildPalette({
  BACKGROUND: '#F4F7FA',
  BACK_COLOR: '#F5F7FA',
  CARD: '#FFFFFF',
  TEXT: '#1F2937',
  TextPrimary: '#1F2937',
  GREY: '#6B7280',
  GRAY_DARK: '#6B7280',
  GRAY_LIGHT: '#E5E7EB',
  GRADIENT_ROYAL: ['#69B8FF', '#1A73E8'],
  GRADIENT_ROYAL90: ['#69B8FFB8', '#1A73E8B8'],
  GRADIENT_ROYAL50: ['#69B8FF80', '#1A73E880'],
  GRADIENT_SKY: ['#4FC3F7', '#1A73E8'],
  GRADIENT_EMERALD: ['#43CEA2', '#185A9D'],
  GRADIENT_SUNSET: ['#F2994A', '#F2C94C'],
  GRADIENT_PURPLE_HAZE: ['#6A11CB', '#2575FC'],
  HAZE: '#EEF4FF',
});

const darkPalette: any = buildPalette({
  BACKGROUND: '#0D1B2D',
  BACK_COLOR: '#0D1B2D',
  CARD: '#15263F',
  TEXT: '#F7F9FD',
  TextPrimary: '#F7F9FD',
  GREY: '#9FB2CE',
  GRAY_DARK: '#9FB2CE',
  GRAY_LIGHT: '#1F3147',
  WHITE: '#F7F9FD',
  WHITE_80: '#F7F9FDD9',
  WHITE_50: '#F7F9FD80',
  WHITE_20: '#F7F9FD33',
  GRADIENT_ROYAL: ['#12284A', '#0B1A35'],
  GRADIENT_ROYAL90: ['#12284AB8', '#0B1A35B8'],
  GRADIENT_ROYAL50: ['#12284A80', '#0B1A3580'],
  GRADIENT_SKY: ['#1E8CFF', '#0B64D6'],
  GRADIENT_EMERALD: ['#1F3E5A', '#102237'],
  GRADIENT_SUNSET: ['#F2994A', '#F2C94C'],
  GRADIENT_PURPLE_HAZE: ['#2A2E8F', '#15234C'],
  SOFT_DIM: '#0E1929',
  SOFT_WHITE: '#1E2B3E',
  SOFT_PRIMARY: '#1E7CF4',
  HAZE: '#0E1929',
});

export const lightColors = lightPalette;
export const darkColors = darkPalette;

export const getThemeColors = (theme: any): any =>
  theme === 'dark' ? darkPalette : lightPalette;

const getActiveTheme = () => useThemeStore.getState().theme;
export const getActiveColors = () => getThemeColors(getActiveTheme());

export const useThemeColors = (): any => {
  const theme = useThemeStore(state => state.theme);
  return useMemo(() => getThemeColors(theme), [theme]);
};

const ColorsProxy: any = new Proxy(
  {},
  {
    get(_, prop: string) {
      const palette = getActiveColors();
      if (prop in palette) {
        return palette[prop];
      }
      return sharedBase[prop];
    },
  },
);

export default ColorsProxy;
