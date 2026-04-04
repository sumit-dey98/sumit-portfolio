import { BsMoonStarsFill } from 'react-icons/bs';
import { BsSunFill, BsStars, BsSnow, BsHexagonFill, BsTerminalFill } from 'react-icons/bs';
import { PiFlameLight } from 'react-icons/pi';  
import { BsCloudHazeFill, BsDiamondFill } from 'react-icons/bs';
import { PiDropFill, PiPlanetFill } from 'react-icons/pi';

export const THEMES = {
  dark: {
    label: 'NIGHT',
    group: null,
    icon: BsMoonStarsFill,
    vars: {
      '--bg': '#080810',
      '--surface': '#0E0E1A',
      '--border': '#1A1A2E',
      '--accent': '#5227FF',
      '--accent2': '#00FFCC',
      '--dim': '#7A7AAD',
      '--muted': '#6A6A88',
      '--text': '#E0E0F0',
      '--text-dim': '#A4A4CA',
    },
  },

  light: {
    label: 'LIGHT',
    group: null,
    icon: BsSunFill,
    vars: {
      '--bg': '#FFFFFF',
      '--surface': '#DFF0F5',
      '--border': '#8BC0FF',
      '--accent': '#0A35B9',
      '--accent2': '#4C91E2',
      '--dim': '#4C92E270',
      '--muted': '#0A35B9AA',
      '--text': '#030844',
      '--text-dim': '#0A35B9',
    },
  },

  cyber: {
    label: 'CYBER',
    group: null,
    icon: BsStars,
    vars: {
      '--bg': '#0D0013',
      '--surface': '#150020',
      '--border': '#2D0050',
      '--accent': '#FF00FF',
      '--accent2': '#00EEFF',
      '--dim': '#6C2C9C',
      '--muted': '#7700AA',
      '--text': '#FFCCFF',
      '--text-dim': '#BB88CC',
    },
  },

  arctic: {
    label: 'ARCTIC',
    group: null,
    icon: BsSnow,
    vars: {
      '--bg': '#F0F4F8',
      '--surface': '#E2EAF2',
      '--border': '#C8D8E8',
      '--accent': '#0055FF',
      '--accent2': '#0099FF',
      '--dim': '#8899AA',
      '--muted': '#667788',
      '--text': '#0A1628',
      '--text-dim': '#334455',
    },
  },

  solar: {
    label: 'SOLAR',
    group: null,
    icon: BsSunFill,
    vars: {
      '--bg': '#FFFBF0',
      '--surface': '#FFF3D0',
      '--border': '#FFD880',
      '--accent': '#FF4800',
      '--accent2': '#8000FF',
      '--dim': '#CC8800',
      '--muted': '#AA6600',
      '--text': '#1A0A00',
      '--text-dim': '#663300',
    },
  },

  ash: {
    label: 'ASH',
    group: 'MONO',
    icon: BsCloudHazeFill,
    vars: {
      '--bg': '#080808',
      '--surface': '#111111',
      '--border': '#222222',
      '--accent': '#CCCCCC',
      '--accent2': '#FFFFFF',
      '--dim': '#444444',
      '--muted': '#333333',
      '--text': '#EEEEEE',
      '--text-dim': '#888888',
    },
  },

  matrix: {
    label: 'MATRIX',
    group: 'MONO',
    icon: BsTerminalFill,
    vars: {
      '--bg': '#000000',
      '--surface': '#0A0A0A',
      '--border': '#003300',
      '--accent': '#009D28',
      '--accent2': '#00FF39',
      '--dim': '#006600',
      '--muted': '#006600',
      '--text': '#54FF80',
      '--text-dim': '#009D23',
    },
  },

  amber: {
    label: 'AMBER',
    group: 'MONO',
    icon: PiFlameLight,
    vars: {
      '--bg': '#0C0800',
      '--surface': '#150F00',
      '--border': '#2A1F00',
      '--accent': '#FFAA00',
      '--accent2': '#FFDD44',
      '--dim': '#7C5C00',
      '--muted': '#664400',
      '--text': '#FFDDAA',
      '--text-dim': '#AA8833',
    },
  },

  crimson: {
    label: 'CRIMSON',
    group: 'MONO',
    icon: PiDropFill,
    vars: {
      '--bg': '#0A0008',
      '--surface': '#120010',
      '--border': '#2A0020',
      '--accent': '#FF0044',
      '--accent2': '#FF88AA',
      '--dim': '#7A0040',
      '--muted': '#882255',
      '--text': '#F0D0D8',
      '--text-dim': '#CC8899',
    },
  },

  indigo: {
    label: 'INDIGO',
    group: 'MONO',
    icon: PiPlanetFill,
    vars: {
      '--bg': '#00050F',
      '--surface': '#000D1F',
      '--border': '#001A3D',
      '--accent': '#4488FF',
      '--accent2': '#88BBFF',
      '--dim': '#1A3366',
      '--muted': '#223355',
      '--text': '#CCE0FF',
      '--text-dim': '#6699CC',
    },
  },
};

export const DEFAULT_THEME = 'dark';
export const THEME_KEYS = Object.keys(THEMES);