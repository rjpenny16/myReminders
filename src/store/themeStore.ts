import { create } from 'zustand';
import { Theme } from '../types';
import { slateGlass, noirNeon, paperWarm } from '../themes/presets';

interface ThemeStore {
  currentTheme: Theme;
  presets: Theme[];
  setTheme: (theme: Theme) => void;
  applyTheme: () => void;
  loadTheme: () => void;
  saveTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeStore>((set, get) => ({
  currentTheme: slateGlass,
  presets: [slateGlass, noirNeon, paperWarm],

  setTheme: (theme: Theme) => {
    set({ currentTheme: theme });
    get().applyTheme();
    get().saveTheme(theme);
  },

  applyTheme: () => {
    const theme = get().currentTheme;
    const root = document.documentElement;

    // Apply colors
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(
        `--color-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`,
        value
      );
    });

    // Apply spacing
    root.style.setProperty('--spacing-base', `${theme.spacing.base}px`);

    // Apply border radius
    root.style.setProperty('--border-radius-sm', `${theme.borderRadius.sm}px`);
    root.style.setProperty('--border-radius-md', `${theme.borderRadius.md}px`);
    root.style.setProperty('--border-radius-lg', `${theme.borderRadius.lg}px`);

    // Apply opacity and blur
    root.style.setProperty('--opacity-glass', `${theme.opacity.glass}`);
    root.style.setProperty('--blur-glass', `${theme.blur.glass}px`);

    // Apply fonts
    root.style.setProperty('--font-body', theme.fonts.body);
    root.style.setProperty('--font-heading', theme.fonts.heading);
    root.style.setProperty('--font-mono', theme.fonts.mono);
  },

  loadTheme: () => {
    const saved = localStorage.getItem('ultrawide-todo-theme');
    if (saved) {
      try {
        const theme = JSON.parse(saved) as Theme;
        set({ currentTheme: theme });
        get().applyTheme();
      } catch (e) {
        console.error('Failed to load theme:', e);
      }
    }
  },

  saveTheme: (theme: Theme) => {
    localStorage.setItem('ultrawide-todo-theme', JSON.stringify(theme));
  },
}));
