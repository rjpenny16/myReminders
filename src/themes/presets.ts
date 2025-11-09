import { Theme } from '../types';

export const slateGlass: Theme = {
  name: 'Slate Glass',
  colors: {
    primary: '#6366f1',
    secondary: '#8b5cf6',
    background: '#0f172a',
    surface: '#1e293b',
    text: '#f1f5f9',
    textSecondary: '#94a3b8',
    border: '#334155',
    accent: '#22d3ee',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
  },
  spacing: {
    base: 4,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
  },
  opacity: {
    glass: 0.85,
  },
  blur: {
    glass: 16,
  },
  fonts: {
    body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    heading: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: '"SF Mono", Monaco, "Cascadia Code", "Roboto Mono", monospace',
  },
};

export const noirNeon: Theme = {
  name: 'Noir Neon',
  colors: {
    primary: '#ff00ff',
    secondary: '#00ffff',
    background: '#000000',
    surface: '#111111',
    text: '#ffffff',
    textSecondary: '#888888',
    border: '#333333',
    accent: '#00ff00',
    success: '#00ff88',
    warning: '#ffaa00',
    error: '#ff0055',
  },
  spacing: {
    base: 4,
  },
  borderRadius: {
    sm: 2,
    md: 4,
    lg: 6,
  },
  opacity: {
    glass: 0.95,
  },
  blur: {
    glass: 8,
  },
  fonts: {
    body: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
    heading: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
    mono: '"Fira Code", "SF Mono", Monaco, monospace',
  },
};

export const paperWarm: Theme = {
  name: 'Paper Warm',
  colors: {
    primary: '#d97706',
    secondary: '#ea580c',
    background: '#fef3c7',
    surface: '#fef9f2',
    text: '#292524',
    textSecondary: '#78716c',
    border: '#d6d3d1',
    accent: '#dc2626',
    success: '#16a34a',
    warning: '#ca8a04',
    error: '#dc2626',
  },
  spacing: {
    base: 4,
  },
  borderRadius: {
    sm: 6,
    md: 10,
    lg: 16,
  },
  opacity: {
    glass: 0.92,
  },
  blur: {
    glass: 6,
  },
  fonts: {
    body: '"Georgia", "Times New Roman", serif',
    heading: '"Georgia", "Times New Roman", serif',
    mono: '"Courier New", Courier, monospace',
  },
};
