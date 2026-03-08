import { BsMoonStarsFill } from 'react-icons/bs';
import { BsSunFill, BsStars, BsSnow, BsHexagonFill, BsTerminalFill } from 'react-icons/bs';
import { PiFlameLight } from 'react-icons/pi';  

export const THEMES = {
  dark: {
    label: 'DARK',
    icon: BsMoonStarsFill,
    vars: {
      '--bg':       '#080810',
      '--surface':  '#0e0e1a',
      '--border':   '#1a1a2e',
      '--accent':   '#5227FF',
      '--accent2':  '#00ffcc',
      '--dim':      '#7a7aad',
      '--muted':    '#6a6a88',
      '--text':     '#e0e0f0',
      '--text-dim': '#a4a4ca',
    },
  },

  // light: {
  //   label: 'LIGHT',
  //   icon: BsSunFill,
  //   vars: {
  //     '--bg': '#ffffff',  
  //     '--surface': '#DFF0F5', 
  //     '--border': '#4C91E2', 
  //     '--accent': '#0A35B9',  
  //     '--accent2': '#4C91E2',  
  //     '--dim': '#4c92e2d7',
  //     '--muted': '#0A35B9aa',
  //     '--text': '#030844',
  //     '--text-dim': '#0A35B9',
  //   },
  // },

  matrix: {
    label: 'MATRIX',
    icon: BsTerminalFill,
    vars: {
      '--bg': '#000000',
      '--surface': '#0a0a0a',
      '--border': '#003300',
      '--accent': '#009d28',
      '--accent2': '#00ff39',
      '--dim': '#006600',
      '--muted': '#006600',
      '--text': '#54ff80',
      '--text-dim': '#009d23',
    },
  },

  synthwave: {
    label: 'SYNTHWAVE',
    icon: BsStars,
    vars: {
      '--bg': '#0d0013',
      '--surface': '#150020',
      '--border': '#2d0050',
      '--accent': '#ff00ff',
      '--accent2': '#00eeff',
      '--dim': '#6c2c9c',
      '--muted': '#7700aa',
      '--text': '#ffccff',
      '--text-dim': '#bb88cc',
    },
  },

  amber: {
    label: 'AMBER',
    icon: PiFlameLight,
    vars: {
      '--bg': '#0c0800',
      '--surface': '#150f00',
      '--border': '#2a1f00',
      '--accent': '#ffaa00',
      '--accent2': '#ffdd44',
      '--dim': '#7c5c00',
      '--muted': '#664400',
      '--text': '#ffddaa',
      '--text-dim': '#aa8833',
    },
  },

  // crimson: {
  //   label: 'CRIMSON',
  //   icon: BsHexagonFill,
  //   vars: {
  //     '--bg': '#0a0008',
  //     '--surface': '#120010',
  //     '--border': '#2a0020',
  //     '--accent': '#ff0044',
  //     '--accent2': '#ff88aa',
  //     '--dim': '#7a0040',
  //     '--muted': '#882255',
  //     '--text': '#f0d0d8',
  //     '--text-dim': '#cc8899',
  //   },
  // },

  arctic: {
    label: 'ARCTIC',
    icon: BsSnow,
    vars: {
      '--bg': '#f0f4f8',
      '--surface': '#e2eaf2',
      '--border': '#c8d8e8',
      '--accent': '#0055ff',
      '--accent2': '#0099ff',
      '--dim': '#8899aa',
      '--muted': '#667788',
      '--text': '#0a1628',
      '--text-dim': '#334455',
    },
  },

  solar: {
    label: 'SOLAR',
    icon: BsSunFill,
    vars: {
      '--bg': '#fffbf0',
      '--surface': '#fff3d0',
      '--border': '#ffd880',
      '--accent': '#ff4800',
      '--accent2': '#8000ff',
      '--dim': '#cc8800',
      '--muted': '#aa6600',
      '--text': '#1a0a00',
      '--text-dim': '#663300',
    },
  }
};

export const DEFAULT_THEME = 'dark';
export const THEME_KEYS = Object.keys(THEMES);