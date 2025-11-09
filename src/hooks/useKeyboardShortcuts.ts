import { useEffect } from 'react';
import { useTaskStore } from '../store/taskStore';

export const useKeyboardShortcuts = () => {
  const {
    setCommandPaletteOpen,
    setAIPanelOpen,
    setThemeEditorOpen,
    commandPaletteOpen,
    aiPanelOpen,
    themeEditorOpen,
    settingsPanelOpen,
  } = useTaskStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in an input
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        // Allow Escape to close modals even when typing
        if (e.key === 'Escape') {
          if (commandPaletteOpen) setCommandPaletteOpen(false);
          if (aiPanelOpen) setAIPanelOpen(false);
          if (themeEditorOpen) setThemeEditorOpen(false);
          if (settingsPanelOpen) setThemeEditorOpen(false);
        }
        return;
      }

      // Cmd/Ctrl+K: Command Palette
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
        return;
      }

      // N: New Task
      if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        // Open new task modal (to be implemented)
        console.log('New task shortcut');
        return;
      }

      // /: Quick search/filter
      if (e.key === '/') {
        e.preventDefault();
        setCommandPaletteOpen(true);
        return;
      }

      // A: Theme Editor
      if (e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        setThemeEditorOpen(!themeEditorOpen);
        return;
      }

      // Escape: Close all modals
      if (e.key === 'Escape') {
        if (commandPaletteOpen) setCommandPaletteOpen(false);
        if (aiPanelOpen) setAIPanelOpen(false);
        if (themeEditorOpen) setThemeEditorOpen(false);
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    commandPaletteOpen,
    aiPanelOpen,
    themeEditorOpen,
    settingsPanelOpen,
    setCommandPaletteOpen,
    setAIPanelOpen,
    setThemeEditorOpen,
  ]);
};
