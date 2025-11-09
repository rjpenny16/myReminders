import { useState, useEffect } from 'react';
import { useTaskStore } from '../../store/taskStore';
import { useThemeStore } from '../../store/themeStore';
import { invoke } from '@tauri-apps/api/core';
import './CommandPalette.css';

interface Command {
  id: string;
  label: string;
  icon: string;
  action: () => void;
}

const CommandPalette = () => {
  const {
    commandPaletteOpen,
    setCommandPaletteOpen,
    setAIPanelOpen,
    setThemeEditorOpen,
    setSettingsPanelOpen,
  } = useTaskStore();
  const { presets, setTheme } = useThemeStore();
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const commands: Command[] = [
    {
      id: 'new-task',
      label: 'New Task',
      icon: '➕',
      action: () => {
        // Open new task form
        console.log('New task');
        setCommandPaletteOpen(false);
      },
    },
    {
      id: 'ai-draft',
      label: 'Quick AI Draft',
      icon: '✨',
      action: () => {
        setAIPanelOpen(true);
        setCommandPaletteOpen(false);
      },
    },
    {
      id: 'toggle-always-on-top',
      label: 'Toggle Always on Top',
      icon: '📌',
      action: async () => {
        await invoke('toggle_always_on_top');
        setCommandPaletteOpen(false);
      },
    },
    {
      id: 'theme-editor',
      label: 'Theme Editor',
      icon: '🎨',
      action: () => {
        setThemeEditorOpen(true);
        setCommandPaletteOpen(false);
      },
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: '⚙️',
      action: () => {
        setSettingsPanelOpen(true);
        setCommandPaletteOpen(false);
      },
    },
    ...presets.map((preset, i) => ({
      id: `theme-${i}`,
      label: `Theme: ${preset.name}`,
      icon: '🎨',
      action: () => {
        setTheme(preset);
        setCommandPaletteOpen(false);
      },
    })),
  ];

  const filteredCommands = commands.filter((cmd) =>
    cmd.label.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((i) => (i + 1) % filteredCommands.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((i) => (i - 1 + filteredCommands.length) % filteredCommands.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      filteredCommands[selectedIndex]?.action();
    }
  };

  if (!commandPaletteOpen) return null;

  return (
    <div className="command-palette-overlay" onClick={() => setCommandPaletteOpen(false)}>
      <div className="command-palette fade-in" onClick={(e) => e.stopPropagation()}>
        <input
          type="text"
          className="command-search"
          placeholder="Type a command..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
        />
        <div className="command-list">
          {filteredCommands.map((cmd, index) => (
            <button
              key={cmd.id}
              className={`command-item ${index === selectedIndex ? 'selected' : ''}`}
              onClick={cmd.action}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              <span className="command-icon">{cmd.icon}</span>
              <span className="command-label">{cmd.label}</span>
            </button>
          ))}
          {filteredCommands.length === 0 && (
            <div className="command-empty">No commands found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
