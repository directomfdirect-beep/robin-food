/**
 * Robin Food Design System v3 — Design Tokens
 * Three-layer color architecture: Base (70%) + Semantic (20%) + Vibrant (10%)
 */

// ===== COLOR PALETTE — LAYER 1: BASE (structure) =====
export const baseColors = {
  surface: '#FAFAFA',
  card: '#FFFFFF',
  'card-elevated': '#FFFFFF',
  divider: '#E8E8E8',
  'nav-bar': '#FFFFFF',
  'text-primary': '#1A1A1A',
  'text-secondary': '#757575',
  'text-tertiary': '#BDBDBD',
  'text-inverse': '#FFFFFF',
  disabled: '#E0E0E0',
};

// ===== COLOR PALETTE — LAYER 2: SEMANTIC (badges, statuses, CTA) =====
export const semanticColors = {
  fresh: '#2DB87A',
  good: '#FFCC00',
  lastday: '#FF8A3D',
  urgent: '#E53935',
  discount: '#FF6D00',
  'cta-primary': '#2DB87A',
  success: '#2DB87A',
  error: '#E53935',
  warning: '#FFCC00',
  info: '#2196F3',
};

// Vibrant variants (for emphasis contexts)
export const semanticVibrant = {
  fresh: '#00E676',
  good: '#FFD740',
  lastday: '#FF6D00',
  urgent: '#FF1744',
  discount: '#FF3D00',
  'cta-primary': '#00E676',
};

// ===== COLOR PALETTE — LAYER 3: VIBRANT (promo, onboarding, celebration) =====
export const vibrantColors = {
  'gradient-start': '#00E676',
  'gradient-end': '#FFD740',
  splash: '#FF6D00',
  'story-bg-1-start': '#00E676',
  'story-bg-1-end': '#00BFA5',
  'story-bg-2-start': '#FF6D00',
  'story-bg-2-end': '#FF3D00',
  'celebration-start': '#FFD740',
  'celebration-end': '#FF6D00',
  'eco-accent-start': '#00E676',
  'eco-accent-end': '#00BFA5',
};

// ===== TYPOGRAPHY =====
export const typography = {
  fontFamily: {
    display: "'Manrope', system-ui, sans-serif",
    body: "'Inter', system-ui, sans-serif",
  },

  tokens: {
    'display-hero': { fontFamily: 'display', fontSize: 32, lineHeight: 40, fontWeight: 800, letterSpacing: -0.5 },
    'heading-xl': { fontFamily: 'display', fontSize: 28, lineHeight: 34, fontWeight: 700, letterSpacing: -0.3 },
    'heading-l': { fontFamily: 'display', fontSize: 22, lineHeight: 28, fontWeight: 600, letterSpacing: -0.2 },
    'heading-m': { fontFamily: 'display', fontSize: 18, lineHeight: 24, fontWeight: 600, letterSpacing: 0 },
    'heading-s': { fontFamily: 'display', fontSize: 16, lineHeight: 22, fontWeight: 600, letterSpacing: 0 },
    'body-l': { fontFamily: 'body', fontSize: 16, lineHeight: 22, fontWeight: 400, letterSpacing: 0 },
    'body-m': { fontFamily: 'body', fontSize: 14, lineHeight: 20, fontWeight: 400, letterSpacing: 0.1 },
    'body-s': { fontFamily: 'body', fontSize: 12, lineHeight: 16, fontWeight: 400, letterSpacing: 0.2 },
    'body-xs': { fontFamily: 'body', fontSize: 10, lineHeight: 14, fontWeight: 400, letterSpacing: 0.3 },
    'label-price-hero': { fontFamily: 'display', fontSize: 24, lineHeight: 28, fontWeight: 800, letterSpacing: -0.3 },
    'label-price': { fontFamily: 'body', fontSize: 20, lineHeight: 24, fontWeight: 700, letterSpacing: 0 },
    'label-price-old': { fontFamily: 'body', fontSize: 14, lineHeight: 18, fontWeight: 400, letterSpacing: 0 },
    'label-discount': { fontFamily: 'display', fontSize: 14, lineHeight: 18, fontWeight: 800, letterSpacing: 0.5 },
    'label-discount-hero': { fontFamily: 'display', fontSize: 18, lineHeight: 22, fontWeight: 800, letterSpacing: 0.5 },
    'label-button': { fontFamily: 'body', fontSize: 16, lineHeight: 20, fontWeight: 600, letterSpacing: 0.3 },
    'label-button-s': { fontFamily: 'body', fontSize: 14, lineHeight: 18, fontWeight: 600, letterSpacing: 0.3 },
    'label-tab': { fontFamily: 'body', fontSize: 10, lineHeight: 14, fontWeight: 500, letterSpacing: 0.5 },
  },
};

// ===== SPACING SCALE (4px base unit) =====
export const spacing = {
  '2xs': 2,
  xs: 4,
  s: 8,
  m: 12,
  l: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
};

// ===== BORDER RADIUS =====
export const radius = {
  xs: 4,
  s: 8,
  m: 12,
  l: 16,
  xl: 20,
  full: 999,
};

// ===== ELEVATION (shadows) =====
export const elevation = {
  0: 'none',
  1: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)',
  2: '0 4px 12px rgba(0,0,0,0.10), 0 2px 4px rgba(0,0,0,0.06)',
  3: '0 8px 24px rgba(0,0,0,0.14), 0 4px 8px rgba(0,0,0,0.08)',
  nav: '0 -1px 4px rgba(0,0,0,0.06)',
};

// ===== TRANSITIONS =====
export const transitions = {
  fast: '150ms ease',
  normal: '200ms ease',
  slow: '300ms ease',
  spring: '300ms cubic-bezier(0.34, 1.56, 0.64, 1)',
  'bottom-sheet': '250ms cubic-bezier(0.33, 1, 0.68, 1)',
  'page-transition': '300ms cubic-bezier(0.4, 0, 0.2, 1)',
};

// ===== Z-INDEX =====
export const zIndex = {
  base: 0,
  dropdown: 100,
  sticky: 200,
  modal: 300,
  popover: 400,
  nav: 500,
  toast: 600,
  max: 9999,
};

// ===== COMPONENT TOKENS =====
export const components = {
  button: {
    height: { s: 32, m: 40, l: 48 },
    radius: { s: radius.s, m: radius.s, l: radius.m },
    shadow: {
      primary: '0 4px 12px rgba(45,184,122,0.25)',
      'primary-vibrant': '0 6px 16px rgba(0,230,118,0.35)',
      urgent: '0 6px 16px rgba(255,109,0,0.35)',
    },
  },
  card: {
    padding: spacing.s,
    radius: radius.m,
  },
  productCard: {
    photoRatio: '4/3',
    ctaHeight: 36,
  },
  storeCard: {
    height: 88,
    logoSize: 40,
  },
  bottomNav: {
    height: 56,
    iconSize: 24,
    badgeSize: 18,
  },
  searchBar: {
    height: 44,
  },
  input: {
    height: 48,
    radius: radius.s,
  },
  filterChip: {
    height: 32,
  },
  quantityStepper: {
    height: 32,
    width: 96,
  },
  toast: {
    height: 48,
  },
  bottomSheet: {
    handleWidth: 36,
    handleHeight: 4,
    maxHeight: '90%',
  },
};

// ===== FRESHNESS BADGE CONFIG =====
export const freshnessBadge = {
  fresh: { color: semanticColors.fresh, label: 'Свежий', size: 'small' },
  good: { color: semanticColors.good, label: 'Хороший', size: 'small', textDark: true },
  lastday: { color: semanticColors.lastday, label: 'Последний день', size: 'medium' },
  urgent: { color: semanticColors.urgent, label: 'Забрать сегодня', size: 'large' },
};

export default {
  baseColors,
  semanticColors,
  semanticVibrant,
  vibrantColors,
  typography,
  spacing,
  radius,
  elevation,
  transitions,
  zIndex,
  components,
  freshnessBadge,
};
