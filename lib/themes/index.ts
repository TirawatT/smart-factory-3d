// ============================================================
// Smart Factory — Theme Definitions
// 24 color palettes × 3 style themes
// ============================================================

export interface ColorPalette {
  id: string;
  name: string;
  primary: string;
  primaryRgb: string;
  glow: string;
  group: string;
}

export interface StyleTheme {
  id: string;
  name: string;
  description: string;
  radius: string;
  fontMono: string;
  cardStyle: "gradient" | "flat" | "glass";
}

// ── Color Palettes ─────────────────────────────────────────

export const COLOR_PALETTES: ColorPalette[] = [
  // Cyber
  { id: "cyber-cyan",    group: "Cyber",   name: "Cyber Cyan",   primary: "#00c8ff", primaryRgb: "0,200,255",   glow: "rgba(0,200,255,0.4)" },
  { id: "electric-blue", group: "Cyber",   name: "Electric Blue", primary: "#2563eb", primaryRgb: "37,99,235",  glow: "rgba(37,99,235,0.4)" },
  { id: "ice-blue",      group: "Cyber",   name: "Ice Blue",      primary: "#38bdf8", primaryRgb: "56,189,248", glow: "rgba(56,189,248,0.4)" },
  { id: "cobalt",        group: "Cyber",   name: "Cobalt",        primary: "#3b82f6", primaryRgb: "59,130,246", glow: "rgba(59,130,246,0.4)" },

  // Matrix
  { id: "matrix-green",  group: "Matrix",  name: "Matrix Green",  primary: "#00ff9d", primaryRgb: "0,255,157",   glow: "rgba(0,255,157,0.4)" },
  { id: "emerald",       group: "Matrix",  name: "Emerald",       primary: "#10b981", primaryRgb: "16,185,129", glow: "rgba(16,185,129,0.4)" },
  { id: "lime",          group: "Matrix",  name: "Lime",          primary: "#84cc16", primaryRgb: "132,204,22", glow: "rgba(132,204,22,0.4)" },
  { id: "mint",          group: "Matrix",  name: "Mint",          primary: "#00d4aa", primaryRgb: "0,212,170",  glow: "rgba(0,212,170,0.4)" },

  // Neon
  { id: "neon-purple",   group: "Neon",    name: "Neon Purple",   primary: "#a855f7", primaryRgb: "168,85,247",  glow: "rgba(168,85,247,0.4)" },
  { id: "violet",        group: "Neon",    name: "Violet",        primary: "#7c3aed", primaryRgb: "124,58,237", glow: "rgba(124,58,237,0.4)" },
  { id: "fuchsia",       group: "Neon",    name: "Fuchsia",       primary: "#d946ef", primaryRgb: "217,70,239", glow: "rgba(217,70,239,0.4)" },
  { id: "indigo",        group: "Neon",    name: "Indigo",        primary: "#6366f1", primaryRgb: "99,102,241", glow: "rgba(99,102,241,0.4)" },

  // Inferno
  { id: "neon-red",      group: "Inferno", name: "Neon Red",      primary: "#ff4560", primaryRgb: "255,69,96",   glow: "rgba(255,69,96,0.4)" },
  { id: "amber",         group: "Inferno", name: "Amber",         primary: "#ffb800", primaryRgb: "255,184,0",  glow: "rgba(255,184,0,0.4)" },
  { id: "orange",        group: "Inferno", name: "Orange",        primary: "#f97316", primaryRgb: "249,115,22", glow: "rgba(249,115,22,0.4)" },
  { id: "coral",         group: "Inferno", name: "Coral",         primary: "#fb7185", primaryRgb: "251,113,133",glow: "rgba(251,113,133,0.4)" },

  // Cosmic
  { id: "rose-gold",     group: "Cosmic",  name: "Rose Gold",     primary: "#f43f5e", primaryRgb: "244,63,94",   glow: "rgba(244,63,94,0.4)" },
  { id: "gold",          group: "Cosmic",  name: "Gold",          primary: "#eab308", primaryRgb: "234,179,8",  glow: "rgba(234,179,8,0.4)" },
  { id: "teal",          group: "Cosmic",  name: "Teal",          primary: "#14b8a6", primaryRgb: "20,184,166", glow: "rgba(20,184,166,0.4)" },
  { id: "aqua",          group: "Cosmic",  name: "Aqua",          primary: "#06b6d4", primaryRgb: "6,182,212",  glow: "rgba(6,182,212,0.4)" },

  // Mono
  { id: "slate",         group: "Mono",    name: "Slate",         primary: "#64748b", primaryRgb: "100,116,139", glow: "rgba(100,116,139,0.4)" },
  { id: "steel",         group: "Mono",    name: "Steel",         primary: "#94a3b8", primaryRgb: "148,163,184",glow: "rgba(148,163,184,0.4)" },
  { id: "chrome",        group: "Mono",    name: "Chrome",        primary: "#cbd5e1", primaryRgb: "203,213,225",glow: "rgba(203,213,225,0.4)" },
  { id: "graphite",      group: "Mono",    name: "Graphite",      primary: "#475569", primaryRgb: "71,85,105",  glow: "rgba(71,85,105,0.4)" },
];

// ── Style Themes ───────────────────────────────────────────

export const STYLE_THEMES: StyleTheme[] = [
  {
    id: "cyber",
    name: "Cyber",
    description: "Futuristic dark HUD",
    radius: "0.625rem",
    fontMono: "'IBM Plex Mono', monospace",
    cardStyle: "gradient",
  },
  {
    id: "professional",
    name: "Professional",
    description: "Sharp minimal industrial",
    radius: "0.25rem",
    fontMono: "'JetBrains Mono', 'IBM Plex Mono', monospace",
    cardStyle: "flat",
  },
  {
    id: "corporate",
    name: "Corporate",
    description: "Rounded modern enterprise",
    radius: "1rem",
    fontMono: "'IBM Plex Mono', monospace",
    cardStyle: "glass",
  },
];

// ── Helpers ────────────────────────────────────────────────

export function getPalette(id: string): ColorPalette {
  return COLOR_PALETTES.find((p) => p.id === id) ?? COLOR_PALETTES[0];
}

export function getStyle(id: string): StyleTheme {
  return STYLE_THEMES.find((s) => s.id === id) ?? STYLE_THEMES[0];
}
