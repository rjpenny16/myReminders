import { useState, useEffect } from 'react';
import { useTaskStore } from '../../store/taskStore';
import { useThemeStore } from '../../store/themeStore';
import { Theme } from '../../types';
import './ThemeEditor.css';

const ThemeEditor = () => {
  const { themeEditorOpen, setThemeEditorOpen } = useTaskStore();
  const { currentTheme, setTheme, presets } = useThemeStore();
  const [editingTheme, setEditingTheme] = useState<Theme>(currentTheme);

  useEffect(() => {
    if (themeEditorOpen) {
      setEditingTheme(currentTheme);
    }
  }, [themeEditorOpen, currentTheme]);

  const handleColorChange = (key: string, value: string) => {
    setEditingTheme({
      ...editingTheme,
      colors: {
        ...editingTheme.colors,
        [key]: value,
      },
    });
  };

  const handleApply = () => {
    setTheme(editingTheme);
    setThemeEditorOpen(false);
  };

  if (!themeEditorOpen) return null;

  return (
    <div className="theme-editor-overlay" onClick={() => setThemeEditorOpen(false)}>
      <div className="theme-editor slide-up" onClick={(e) => e.stopPropagation()}>
        <div className="theme-editor-header">
          <h3>Theme Editor</h3>
          <button className="close-btn" onClick={() => setThemeEditorOpen(false)}>
            ✕
          </button>
        </div>

        <div className="theme-editor-content">
          <div className="theme-section">
            <h4>Presets</h4>
            <div className="theme-presets">
              {presets.map((preset) => (
                <button
                  key={preset.name}
                  className="theme-preset-btn"
                  onClick={() => setEditingTheme(preset)}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          <div className="theme-section">
            <h4>Colors</h4>
            <div className="color-grid">
              {Object.entries(editingTheme.colors).map(([key, value]) => (
                <div key={key} className="color-input-group">
                  <label htmlFor={`color-${key}`}>
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </label>
                  <div className="color-input-wrapper">
                    <input
                      type="color"
                      id={`color-${key}`}
                      value={value}
                      onChange={(e) => handleColorChange(key, e.target.value)}
                      className="color-picker"
                    />
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => handleColorChange(key, e.target.value)}
                      className="color-text"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="theme-section">
            <h4>Other Settings</h4>
            <div className="theme-controls">
              <div className="control-group">
                <label>Border Radius (MD)</label>
                <input
                  type="range"
                  min="0"
                  max="24"
                  value={editingTheme.borderRadius.md}
                  onChange={(e) =>
                    setEditingTheme({
                      ...editingTheme,
                      borderRadius: {
                        ...editingTheme.borderRadius,
                        md: parseInt(e.target.value),
                      },
                    })
                  }
                />
                <span>{editingTheme.borderRadius.md}px</span>
              </div>
              <div className="control-group">
                <label>Glass Opacity</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={editingTheme.opacity.glass}
                  onChange={(e) =>
                    setEditingTheme({
                      ...editingTheme,
                      opacity: {
                        glass: parseFloat(e.target.value),
                      },
                    })
                  }
                />
                <span>{editingTheme.opacity.glass.toFixed(2)}</span>
              </div>
              <div className="control-group">
                <label>Glass Blur</label>
                <input
                  type="range"
                  min="0"
                  max="32"
                  value={editingTheme.blur.glass}
                  onChange={(e) =>
                    setEditingTheme({
                      ...editingTheme,
                      blur: {
                        glass: parseInt(e.target.value),
                      },
                    })
                  }
                />
                <span>{editingTheme.blur.glass}px</span>
              </div>
            </div>
          </div>

          <button className="theme-apply-btn" onClick={handleApply}>
            Apply Theme
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThemeEditor;
