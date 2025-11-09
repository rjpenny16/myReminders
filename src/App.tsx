import { useEffect } from 'react';
import { listen } from '@tauri-apps/api/event';
import { useTaskStore } from './store/taskStore';
import { useThemeStore } from './store/themeStore';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import MainLayout from './components/Layout/MainLayout';
import CommandPalette from './components/CommandPalette/CommandPalette';
import AIPanel from './components/AI/AIPanel';
import ThemeEditor from './components/Theme/ThemeEditor';
import SettingsPanel from './components/Settings/SettingsPanel';
import './styles/App.css';

function App() {
  const { loadTasks, loadSettings } = useTaskStore();
  const { applyTheme, loadTheme } = useThemeStore();

  // Enable keyboard shortcuts
  useKeyboardShortcuts();

  useEffect(() => {
    // Load theme first
    loadTheme();
    applyTheme();

    // Load initial data
    loadTasks();
    loadSettings();

    // Listen for reminder events
    const unlisten = listen('reminder-due', (event) => {
      console.log('Reminder due:', event);
      // Handle reminder notification
    });

    return () => {
      unlisten.then((fn) => fn());
    };
  }, []);

  return (
    <div className="app">
      <MainLayout />
      <CommandPalette />
      <AIPanel />
      <ThemeEditor />
      <SettingsPanel />
    </div>
  );
}

export default App;
