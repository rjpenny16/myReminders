import { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { open } from '@tauri-apps/plugin-shell';
import './UpdateNotification.css';

interface UpdateInfo {
  available: boolean;
  current_version: string;
  latest_version: string;
  download_url: string;
  release_notes: string;
  published_at: string;
}

const UpdateNotification = () => {
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check for updates on component mount
    checkForUpdates();
  }, []);

  const checkForUpdates = async () => {
    try {
      setIsChecking(true);
      const info = await invoke<UpdateInfo>('check_for_updates');

      if (info.available) {
        setUpdateInfo(info);
        setIsVisible(true);
      }
    } catch (error) {
      console.error('Failed to check for updates:', error);
    } finally {
      setIsChecking(false);
    }
  };

  const handleDownload = async () => {
    if (updateInfo?.download_url) {
      try {
        await open(updateInfo.download_url);
      } catch (error) {
        console.error('Failed to open download URL:', error);
      }
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
  };

  if (!isVisible || !updateInfo) return null;

  return (
    <div className="update-notification-overlay">
      <div className="update-notification-modal">
        <div className="update-header">
          <div className="update-icon">🎉</div>
          <h2>Update Available</h2>
        </div>

        <div className="update-body">
          <div className="version-info">
            <div className="version-row">
              <span className="version-label">Current Version:</span>
              <span className="version-value current">{updateInfo.current_version}</span>
            </div>
            <div className="version-row">
              <span className="version-label">Latest Version:</span>
              <span className="version-value latest">{updateInfo.latest_version}</span>
            </div>
          </div>

          {updateInfo.release_notes && (
            <div className="release-notes">
              <h3>What's New:</h3>
              <div className="notes-content">
                {updateInfo.release_notes.split('\n').slice(0, 5).map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="update-actions">
          <button className="btn-download" onClick={handleDownload}>
            Download Update
          </button>
          <button className="btn-dismiss" onClick={handleDismiss}>
            Remind Me Later
          </button>
        </div>

        <button className="close-button" onClick={handleDismiss}>
          ✕
        </button>
      </div>
    </div>
  );
};

export default UpdateNotification;
