import { useState, useEffect } from 'react';
import { useTaskStore } from '../../store/taskStore';
import { AppSettings } from '../../types';
import './SettingsPanel.css';

const SettingsPanel = () => {
  const { settingsPanelOpen, setSettingsPanelOpen, settings, updateSettings } = useTaskStore();
  const [editingSettings, setEditingSettings] = useState<AppSettings | null>(settings);

  useEffect(() => {
    if (settingsPanelOpen && settings) {
      setEditingSettings(settings);
    }
  }, [settingsPanelOpen, settings]);

  const handleSave = async () => {
    if (editingSettings) {
      await updateSettings(editingSettings);
      setSettingsPanelOpen(false);
    }
  };

  if (!settingsPanelOpen || !editingSettings) return null;

  return (
    <div className="settings-overlay" onClick={() => setSettingsPanelOpen(false)}>
      <div className="settings-panel slide-up" onClick={(e) => e.stopPropagation()}>
        <div className="settings-header">
          <h3>Settings</h3>
          <button className="close-btn" onClick={() => setSettingsPanelOpen(false)}>
            ✕
          </button>
        </div>

        <div className="settings-content">
          <div className="settings-section">
            <h4>General</h4>
            <label className="settings-checkbox">
              <input
                type="checkbox"
                checked={editingSettings.alwaysOnTop}
                onChange={(e) =>
                  setEditingSettings({ ...editingSettings, alwaysOnTop: e.target.checked })
                }
              />
              <span>Always on top</span>
            </label>
            <label className="settings-checkbox">
              <input
                type="checkbox"
                checked={editingSettings.enableBurnInMitigation}
                onChange={(e) =>
                  setEditingSettings({
                    ...editingSettings,
                    enableBurnInMitigation: e.target.checked,
                  })
                }
              />
              <span>Enable burn-in mitigation</span>
            </label>
          </div>

          <div className="settings-section">
            <h4>AI</h4>
            <div className="settings-field">
              <label>Mode</label>
              <select
                value={editingSettings.aiMode}
                onChange={(e) =>
                  setEditingSettings({
                    ...editingSettings,
                    aiMode: e.target.value as 'embedded' | 'external',
                  })
                }
              >
                <option value="embedded">Embedded</option>
                <option value="external">External</option>
              </select>
            </div>
            <div className="settings-field">
              <label>Model</label>
              <input
                type="text"
                value={editingSettings.aiModel}
                onChange={(e) =>
                  setEditingSettings({ ...editingSettings, aiModel: e.target.value })
                }
              />
            </div>
            <div className="settings-field">
              <label>Base URL</label>
              <input
                type="text"
                value={editingSettings.aiBaseUrl}
                onChange={(e) =>
                  setEditingSettings({ ...editingSettings, aiBaseUrl: e.target.value })
                }
              />
            </div>
            <div className="settings-field">
              <label>Temperature</label>
              <input
                type="number"
                min="0"
                max="2"
                step="0.1"
                value={editingSettings.aiTemperature}
                onChange={(e) =>
                  setEditingSettings({
                    ...editingSettings,
                    aiTemperature: parseFloat(e.target.value),
                  })
                }
              />
            </div>
          </div>

          <div className="settings-section">
            <h4>Display</h4>
            <div className="settings-field">
              <label>Resolution Profile</label>
              <select
                value={editingSettings.resolutionProfile}
                onChange={(e) =>
                  setEditingSettings({
                    ...editingSettings,
                    resolutionProfile: e.target.value as any,
                  })
                }
              >
                <option value="auto">Auto</option>
                <option value="1920x480">1920×480</option>
                <option value="1280x400">1280×400</option>
                <option value="1024x256">1024×256</option>
              </select>
            </div>
            <div className="settings-field">
              <label>Font Size Scale</label>
              <input
                type="number"
                min="0.5"
                max="2"
                step="0.1"
                value={editingSettings.fontSizeScale}
                onChange={(e) =>
                  setEditingSettings({
                    ...editingSettings,
                    fontSizeScale: parseFloat(e.target.value),
                  })
                }
              />
            </div>
          </div>

          <button className="settings-save-btn" onClick={handleSave}>
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
