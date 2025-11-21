// Era-Evolving UI Styles - Visual themes that progress through history
// Fonts, colors, and decorative elements change by era

import { Era } from '../types';

export interface EraStyle {
  era: Era;
  name: string;
  period: string;

  // Typography
  fonts: {
    heading: string;
    body: string;
    accent: string;
  };
  fontWeights: {
    heading: number;
    body: number;
  };

  // Colors
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textMuted: string;
    border: string;
    gold: string;
    danger: string;
    success: string;
  };

  // Decorative elements
  decorations: {
    borderStyle: string;
    cornerStyle: string;
    dividerStyle: string;
    shadowStyle: string;
  };

  // Textures and patterns
  textures: {
    background: string;
    paper: string;
    overlay: string;
  };

  // UI Element styles
  buttons: {
    borderRadius: string;
    textTransform: string;
    letterSpacing: string;
  };

  // Descriptions for flavor
  description: string;
  musicalStyle: string;
}

export const ERA_STYLES: Record<Era, EraStyle> = {
  EARLY_MODERN: {
    era: 'EARLY_MODERN',
    name: 'Early Modern',
    period: '1500-1750',
    fonts: {
      heading: "'Cinzel', 'Times New Roman', serif",
      body: "'EB Garamond', 'Garamond', serif",
      accent: "'Pinyon Script', cursive"
    },
    fontWeights: { heading: 700, body: 400 },
    colors: {
      primary: '#8B4513',      // Saddle brown
      secondary: '#DAA520',    // Goldenrod
      accent: '#800020',       // Burgundy
      background: '#F5DEB3',   // Wheat
      surface: '#FFF8DC',      // Cornsilk
      text: '#3E2723',         // Dark brown
      textMuted: '#795548',    // Medium brown
      border: '#8B4513',       // Saddle brown
      gold: '#FFD700',         // Gold
      danger: '#B22222',       // Firebrick
      success: '#228B22'       // Forest green
    },
    decorations: {
      borderStyle: '3px double',
      cornerStyle: 'ornate-corners',
      dividerStyle: 'fleur-de-lis',
      shadowStyle: '4px 4px 8px rgba(0,0,0,0.3)'
    },
    textures: {
      background: 'parchment-aged',
      paper: 'vellum',
      overlay: 'candlelight'
    },
    buttons: {
      borderRadius: '0px',
      textTransform: 'uppercase',
      letterSpacing: '0.15em'
    },
    description: 'Ornate baroque styling with rich browns and golds, illuminated manuscript aesthetics',
    musicalStyle: 'Baroque - harpsichord, chamber orchestra'
  },

  ENLIGHTENMENT: {
    era: 'ENLIGHTENMENT',
    name: 'Age of Enlightenment',
    period: '1750-1800',
    fonts: {
      heading: "'Playfair Display', 'Georgia', serif",
      body: "'Libre Baskerville', 'Baskerville', serif",
      accent: "'Great Vibes', cursive"
    },
    fontWeights: { heading: 600, body: 400 },
    colors: {
      primary: '#4A5568',      // Slate gray
      secondary: '#D4AF37',    // Metallic gold
      accent: '#1E3A5F',       // Navy blue
      background: '#F7FAFC',   // Light gray
      surface: '#FFFFF0',      // Ivory
      text: '#2D3748',         // Dark slate
      textMuted: '#718096',    // Gray
      border: '#4A5568',       // Slate gray
      gold: '#D4AF37',         // Metallic gold
      danger: '#C53030',       // Red
      success: '#2F855A'       // Green
    },
    decorations: {
      borderStyle: '2px solid',
      cornerStyle: 'neoclassical',
      dividerStyle: 'greek-key',
      shadowStyle: '2px 2px 4px rgba(0,0,0,0.2)'
    },
    textures: {
      background: 'laid-paper',
      paper: 'wove-paper',
      overlay: 'clear'
    },
    buttons: {
      borderRadius: '2px',
      textTransform: 'capitalize',
      letterSpacing: '0.1em'
    },
    description: 'Neoclassical elegance with balanced proportions, rationalist aesthetic',
    musicalStyle: 'Classical - Mozart, Haydn, string quartets'
  },

  REVOLUTIONARY: {
    era: 'REVOLUTIONARY',
    name: 'Age of Revolution',
    period: '1789-1848',
    fonts: {
      heading: "'Oswald', 'Impact', sans-serif",
      body: "'Source Serif Pro', 'Georgia', serif",
      accent: "'Satisfy', cursive"
    },
    fontWeights: { heading: 700, body: 400 },
    colors: {
      primary: '#DC2626',      // Revolutionary red
      secondary: '#1E40AF',    // Deep blue
      accent: '#FBBF24',       // Yellow/gold
      background: '#FFFBEB',   // Warm white
      surface: '#FEF3C7',      // Light yellow
      text: '#1F2937',         // Near black
      textMuted: '#6B7280',    // Gray
      border: '#DC2626',       // Red
      gold: '#F59E0B',         // Amber
      danger: '#B91C1C',       // Dark red
      success: '#047857'       // Emerald
    },
    decorations: {
      borderStyle: '3px solid',
      cornerStyle: 'sharp',
      dividerStyle: 'tricolor',
      shadowStyle: '3px 3px 6px rgba(0,0,0,0.25)'
    },
    textures: {
      background: 'broadsheet',
      paper: 'newsprint',
      overlay: 'torchlight'
    },
    buttons: {
      borderRadius: '0px',
      textTransform: 'uppercase',
      letterSpacing: '0.2em'
    },
    description: 'Bold, dramatic styling with revolutionary tricolors, broadsheet aesthetics',
    musicalStyle: 'Romantic - Beethoven, dramatic overtures'
  },

  INDUSTRIAL: {
    era: 'INDUSTRIAL',
    name: 'Industrial Age',
    period: '1800-1900',
    fonts: {
      heading: "'Roboto Slab', 'Rockwell', serif",
      body: "'Merriweather', 'Times New Roman', serif",
      accent: "'Archivo Black', sans-serif"
    },
    fontWeights: { heading: 700, body: 400 },
    colors: {
      primary: '#374151',      // Iron gray
      secondary: '#92400E',    // Rust brown
      accent: '#7C3AED',       // Industrial purple
      background: '#F9FAFB',   // Off white
      surface: '#E5E7EB',      // Light gray
      text: '#111827',         // Near black
      textMuted: '#6B7280',    // Gray
      border: '#374151',       // Iron gray
      gold: '#B45309',         // Bronze
      danger: '#991B1B',       // Dark red
      success: '#065F46'       // Dark green
    },
    decorations: {
      borderStyle: '4px solid',
      cornerStyle: 'industrial',
      dividerStyle: 'gear-border',
      shadowStyle: '4px 4px 0px rgba(0,0,0,0.3)'
    },
    textures: {
      background: 'machine-paper',
      paper: 'ledger',
      overlay: 'gaslight'
    },
    buttons: {
      borderRadius: '4px',
      textTransform: 'uppercase',
      letterSpacing: '0.15em'
    },
    description: 'Industrial strength styling with iron grays and mechanical motifs',
    musicalStyle: 'Romantic - Brahms, Wagner, orchestral power'
  },

  IMPERIAL: {
    era: 'IMPERIAL',
    name: 'Age of Empire',
    period: '1870-1914',
    fonts: {
      heading: "'Cormorant Garamond', 'Garamond', serif",
      body: "'Crimson Text', 'Georgia', serif",
      accent: "'Tangerine', cursive"
    },
    fontWeights: { heading: 600, body: 400 },
    colors: {
      primary: '#7C2D12',      // Imperial brown
      secondary: '#1E3A8A',    // Imperial blue
      accent: '#B91C1C',       // Empire red
      background: '#FEFCE8',   // Cream
      surface: '#FEF9C3',      // Light cream
      text: '#292524',         // Dark brown
      textMuted: '#78716C',    // Stone
      border: '#7C2D12',       // Imperial brown
      gold: '#CA8A04',         // Dark gold
      danger: '#DC2626',       // Red
      success: '#15803D'       // Green
    },
    decorations: {
      borderStyle: '2px solid',
      cornerStyle: 'imperial',
      dividerStyle: 'laurel',
      shadowStyle: '3px 3px 6px rgba(0,0,0,0.2)'
    },
    textures: {
      background: 'colonial-map',
      paper: 'fine-linen',
      overlay: 'electric-light'
    },
    buttons: {
      borderRadius: '3px',
      textTransform: 'capitalize',
      letterSpacing: '0.1em'
    },
    description: 'Grand imperial styling with colonial motifs and confident authority',
    musicalStyle: 'Late Romantic - Elgar, Mahler, nationalist anthems'
  },

  GREAT_WAR: {
    era: 'GREAT_WAR',
    name: 'The Great War',
    period: '1914-1918',
    fonts: {
      heading: "'Anton', 'Impact', sans-serif",
      body: "'IBM Plex Serif', 'Georgia', serif",
      accent: "'Bebas Neue', sans-serif"
    },
    fontWeights: { heading: 400, body: 400 },
    colors: {
      primary: '#57534E',      // Khaki brown
      secondary: '#0F172A',    // Near black
      accent: '#B91C1C',       // Blood red
      background: '#D6D3D1',   // Ash gray
      surface: '#E7E5E4',      // Light stone
      text: '#1C1917',         // Black
      textMuted: '#78716C',    // Stone
      border: '#57534E',       // Khaki
      gold: '#78350F',         // Mud brown
      danger: '#7F1D1D',       // Dark red
      success: '#3F6212'       // Olive
    },
    decorations: {
      borderStyle: '3px solid',
      cornerStyle: 'military',
      dividerStyle: 'barbed-wire',
      shadowStyle: '2px 2px 4px rgba(0,0,0,0.4)'
    },
    textures: {
      background: 'trench-map',
      paper: 'telegram',
      overlay: 'muddy'
    },
    buttons: {
      borderRadius: '0px',
      textTransform: 'uppercase',
      letterSpacing: '0.2em'
    },
    description: 'Stark wartime styling with muted colors and military severity',
    musicalStyle: 'Early Modern - Holst, wartime marches, requiems'
  },

  INTERWAR: {
    era: 'INTERWAR',
    name: 'Interwar Period',
    period: '1918-1939',
    fonts: {
      heading: "'Poiret One', 'Arial', sans-serif",
      body: "'Nunito Sans', 'Helvetica', sans-serif",
      accent: "'Pacifico', cursive"
    },
    fontWeights: { heading: 400, body: 400 },
    colors: {
      primary: '#0D9488',      // Teal
      secondary: '#7C3AED',    // Art Deco purple
      accent: '#F59E0B',       // Jazz gold
      background: '#ECFDF5',   // Mint
      surface: '#F0FDFA',      // Light teal
      text: '#134E4A',         // Dark teal
      textMuted: '#5EEAD4',    // Teal
      border: '#0D9488',       // Teal
      gold: '#D97706',         // Orange gold
      danger: '#E11D48',       // Rose
      success: '#059669'       // Emerald
    },
    decorations: {
      borderStyle: '2px solid',
      cornerStyle: 'art-deco',
      dividerStyle: 'chevron',
      shadowStyle: '3px 3px 0px rgba(0,0,0,0.2)'
    },
    textures: {
      background: 'art-deco-pattern',
      paper: 'glossy',
      overlay: 'neon-glow'
    },
    buttons: {
      borderRadius: '0px',
      textTransform: 'uppercase',
      letterSpacing: '0.3em'
    },
    description: 'Art Deco glamour with geometric patterns and Jazz Age energy',
    musicalStyle: 'Jazz Age - Gershwin, swing, early radio'
  },

  WORLD_WAR: {
    era: 'WORLD_WAR',
    name: 'World War II',
    period: '1939-1945',
    fonts: {
      heading: "'Archivo Black', 'Impact', sans-serif",
      body: "'Source Sans Pro', 'Arial', sans-serif",
      accent: "'Righteous', cursive"
    },
    fontWeights: { heading: 400, body: 400 },
    colors: {
      primary: '#1E3A8A',      // Military blue
      secondary: '#7F1D1D',    // War red
      accent: '#FBBF24',       // Warning yellow
      background: '#F1F5F9',   // Steel blue
      surface: '#E2E8F0',      // Light slate
      text: '#0F172A',         // Navy
      textMuted: '#64748B',    // Slate
      border: '#1E3A8A',       // Military blue
      gold: '#A16207',         // Bronze
      danger: '#DC2626',       // Alert red
      success: '#15803D'       // Allied green
    },
    decorations: {
      borderStyle: '4px solid',
      cornerStyle: 'sharp-military',
      dividerStyle: 'propeller',
      shadowStyle: '4px 4px 8px rgba(0,0,0,0.3)'
    },
    textures: {
      background: 'strategic-map',
      paper: 'military-dispatch',
      overlay: 'searchlight'
    },
    buttons: {
      borderRadius: '2px',
      textTransform: 'uppercase',
      letterSpacing: '0.15em'
    },
    description: 'Wartime urgency with military precision and propaganda poster aesthetic',
    musicalStyle: 'Mid-Century - Shostakovich, wartime anthems, radio broadcasts'
  },

  COLD_WAR: {
    era: 'COLD_WAR',
    name: 'Cold War',
    period: '1945-1991',
    fonts: {
      heading: "'Space Grotesk', 'Arial', sans-serif",
      body: "'Inter', 'Helvetica', sans-serif",
      accent: "'Orbitron', sans-serif"
    },
    fontWeights: { heading: 700, body: 400 },
    colors: {
      primary: '#1E40AF',      // NATO blue
      secondary: '#B91C1C',    // Soviet red
      accent: '#10B981',       // Radar green
      background: '#1F2937',   // Dark slate
      surface: '#374151',      // Gray
      text: '#F9FAFB',         // White
      textMuted: '#9CA3AF',    // Light gray
      border: '#4B5563',       // Medium gray
      gold: '#F59E0B',         // Amber
      danger: '#EF4444',       // Red alert
      success: '#22C55E'       // Green
    },
    decorations: {
      borderStyle: '2px solid',
      cornerStyle: 'angular',
      dividerStyle: 'circuit',
      shadowStyle: '0px 0px 20px rgba(16, 185, 129, 0.3)'
    },
    textures: {
      background: 'radar-screen',
      paper: 'computer-printout',
      overlay: 'crt-glow'
    },
    buttons: {
      borderRadius: '4px',
      textTransform: 'uppercase',
      letterSpacing: '0.1em'
    },
    description: 'Space Age modernism with technological aesthetics and Cold War tension',
    musicalStyle: 'Mid-Century Modern - Bernstein, electronic experimentation'
  },

  MODERN: {
    era: 'MODERN',
    name: 'Modern Era',
    period: '1991-Present',
    fonts: {
      heading: "'Poppins', 'Helvetica Neue', sans-serif",
      body: "'Open Sans', 'Arial', sans-serif",
      accent: "'Montserrat', sans-serif"
    },
    fontWeights: { heading: 600, body: 400 },
    colors: {
      primary: '#3B82F6',      // Digital blue
      secondary: '#8B5CF6',    // Tech purple
      accent: '#06B6D4',       // Cyan
      background: '#FFFFFF',   // White
      surface: '#F3F4F6',      // Light gray
      text: '#111827',         // Near black
      textMuted: '#6B7280',    // Gray
      border: '#E5E7EB',       // Light border
      gold: '#F59E0B',         // Amber
      danger: '#EF4444',       // Red
      success: '#10B981'       // Emerald
    },
    decorations: {
      borderStyle: '1px solid',
      cornerStyle: 'rounded',
      dividerStyle: 'minimal',
      shadowStyle: '0px 4px 6px rgba(0, 0, 0, 0.1)'
    },
    textures: {
      background: 'clean',
      paper: 'digital',
      overlay: 'none'
    },
    buttons: {
      borderRadius: '8px',
      textTransform: 'none',
      letterSpacing: '0em'
    },
    description: 'Clean digital styling with flat design and modern minimalism',
    musicalStyle: 'Contemporary - ambient, electronic, global fusion'
  }
};

// Get style for current era
export function getEraStyle(era: Era): EraStyle {
  return ERA_STYLES[era] || ERA_STYLES.ENLIGHTENMENT;
}

// Generate CSS variables for era
export function getEraCSSVariables(era: Era): Record<string, string> {
  const style = getEraStyle(era);

  return {
    '--era-font-heading': style.fonts.heading,
    '--era-font-body': style.fonts.body,
    '--era-font-accent': style.fonts.accent,
    '--era-font-weight-heading': String(style.fontWeights.heading),
    '--era-font-weight-body': String(style.fontWeights.body),
    '--era-color-primary': style.colors.primary,
    '--era-color-secondary': style.colors.secondary,
    '--era-color-accent': style.colors.accent,
    '--era-color-background': style.colors.background,
    '--era-color-surface': style.colors.surface,
    '--era-color-text': style.colors.text,
    '--era-color-text-muted': style.colors.textMuted,
    '--era-color-border': style.colors.border,
    '--era-color-gold': style.colors.gold,
    '--era-color-danger': style.colors.danger,
    '--era-color-success': style.colors.success,
    '--era-border-style': style.decorations.borderStyle,
    '--era-shadow': style.decorations.shadowStyle,
    '--era-button-radius': style.buttons.borderRadius,
    '--era-button-transform': style.buttons.textTransform,
    '--era-button-spacing': style.buttons.letterSpacing
  };
}

// Get transition narrative between eras
export function getStyleTransitionNarrative(fromEra: Era, toEra: Era): string {
  const from = ERA_STYLES[fromEra];
  const to = ERA_STYLES[toEra];

  return `The world transforms from the ${from.name} to the ${to.name}. ${to.description}. The sounds of ${to.musicalStyle} fill the air.`;
}
