import { useEffect, useState } from 'react';
import { listen } from '@tauri-apps/api/event';
import { useTaskStore } from './store/taskStore';
import { useThemeStore } from './store/themeStore';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import MainLayout from './components/Layout/MainLayout';
import CommandPalette from './components/CommandPalette/CommandPalette';
import AIPanel from './components/AI/AIPanel';
import ThemeEditor from './components/Theme/ThemeEditor';
import SettingsPanel from './components/Settings/SettingsPanel';
import PomodoroTimer from './components/Pomodoro/PomodoroTimer';
import Notification from './components/Notification/Notification';
import ExportMenu from './components/ExportMenu/ExportMenu';
import './styles/App.css';

function App() {
  const { loadTasks, loadSettings, pomodoroTimerOpen, setPomodoroTimerOpen, importTasks, showNotification } = useTaskStore();
  const { applyTheme, loadTheme } = useThemeStore();
  const [isDragging, setIsDragging] = useState(false);

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

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const jsonFile = files.find(f => f.name.endsWith('.json'));

    if (!jsonFile) {
      showNotification('Please drop a JSON file', 'error');
      return;
    }

    try {
      const text = await jsonFile.text();
      const tasks = JSON.parse(text);

      // Validate it's an array of tasks
      if (!Array.isArray(tasks)) {
        showNotification('Invalid JSON format: expected an array of tasks', 'error');
        return;
      }

      // Get the file path from the dropped file
      // @ts-ignore - Tauri adds a path property to dropped files
      const filePath = jsonFile.path || '';

      if (filePath) {
        await importTasks(filePath);
      } else {
        showNotification('Unable to get file path. Please use Import from menu.', 'info');
      }
    } catch (error) {
      showNotification(`Failed to import: ${error}`, 'error');
    }
  };

  return (
    <div
      className="app"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {isDragging && (
        <div className="drag-overlay">
          <div className="drag-message">
            <div className="drag-icon">📥</div>
            <div className="drag-text">Drop JSON file to import tasks</div>
          </div>
        </div>
      )}
      <MainLayout />
      <CommandPalette />
      <AIPanel />
      <ThemeEditor />
      <SettingsPanel />
      <PomodoroTimer isOpen={pomodoroTimerOpen} onClose={() => setPomodoroTimerOpen(false)} />
      <ExportMenu />
      <Notification />
    </div>
  );
}

export default App;
