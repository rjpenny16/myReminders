import { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { useThemeStore } from '../../store/themeStore';
import './FirstRunWizard.css';

interface WizardStep {
  id: string;
  title: string;
  content: React.ReactNode;
}

const FirstRunWizard = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const { applyPreset } = useThemeStore();

  useEffect(() => {
    // Check if this is the first run
    checkFirstRun();
  }, []);

  const checkFirstRun = async () => {
    try {
      const settings = await invoke<any>('get_settings');
      const isFirstRun = settings?.first_run !== false;

      if (isFirstRun) {
        setIsVisible(true);
      }
    } catch (error) {
      console.error('Failed to check first run status:', error);
      // Show wizard by default if we can't determine
      setIsVisible(true);
    }
  };

  const handleComplete = async () => {
    try {
      // Mark first run as complete
      await invoke('set_settings', {
        patch: { first_run: false }
      });
      setIsVisible(false);
    } catch (error) {
      console.error('Failed to save first run status:', error);
      setIsVisible(false);
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleThemeSelect = (preset: 'slate' | 'noir' | 'paper') => {
    applyPreset(preset);
  };

  const steps: WizardStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to Ultrawide To-Do!',
      content: (
        <div className="wizard-step">
          <div className="welcome-icon">🎉</div>
          <h2>Welcome to Ultrawide To-Do!</h2>
          <p className="lead">
            A beautiful task management app optimized for ultrawide displays
          </p>
          <div className="feature-grid">
            <div className="feature-item">
              <div className="feature-icon">📅</div>
              <h3>Smart Scheduling</h3>
              <p>Set reminders and recurring tasks with cron-like precision</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🤖</div>
              <h3>AI Integration</h3>
              <p>Draft emails and content with local AI via Ollama</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🎨</div>
              <h3>Beautiful Themes</h3>
              <p>Choose from curated presets or create your own</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">⌨️</div>
              <h3>Keyboard First</h3>
              <p>Command palette and shortcuts for everything</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'theme',
      title: 'Choose Your Theme',
      content: (
        <div className="wizard-step">
          <h2>Choose Your Theme</h2>
          <p className="lead">Pick a theme to get started. You can customize it later!</p>
          <div className="theme-options">
            <button
              className="theme-card slate"
              onClick={() => handleThemeSelect('slate')}
            >
              <div className="theme-preview slate-preview">
                <div className="preview-header"></div>
                <div className="preview-content">
                  <div className="preview-line"></div>
                  <div className="preview-line short"></div>
                </div>
              </div>
              <h3>Slate Glass</h3>
              <p>Dark, modern, with soft glass effects</p>
            </button>

            <button
              className="theme-card noir"
              onClick={() => handleThemeSelect('noir')}
            >
              <div className="theme-preview noir-preview">
                <div className="preview-header"></div>
                <div className="preview-content">
                  <div className="preview-line"></div>
                  <div className="preview-line short"></div>
                </div>
              </div>
              <h3>Noir Neon</h3>
              <p>High-contrast cyberpunk with neon accents</p>
            </button>

            <button
              className="theme-card paper"
              onClick={() => handleThemeSelect('paper')}
            >
              <div className="theme-preview paper-preview">
                <div className="preview-header"></div>
                <div className="preview-content">
                  <div className="preview-line"></div>
                  <div className="preview-line short"></div>
                </div>
              </div>
              <h3>Paper Warm</h3>
              <p>Light, warm tones inspired by paper</p>
            </button>
          </div>
        </div>
      ),
    },
    {
      id: 'shortcuts',
      title: 'Keyboard Shortcuts',
      content: (
        <div className="wizard-step">
          <h2>Essential Keyboard Shortcuts</h2>
          <p className="lead">Master these shortcuts to work faster</p>
          <div className="shortcuts-list">
            <div className="shortcut-item">
              <kbd>Cmd/Ctrl</kbd> + <kbd>K</kbd>
              <span>Open command palette</span>
            </div>
            <div className="shortcut-item">
              <kbd>N</kbd>
              <span>Create new task</span>
            </div>
            <div className="shortcut-item">
              <kbd>Enter</kbd>
              <span>Quick add from top bar</span>
            </div>
            <div className="shortcut-item">
              <kbd>/</kbd>
              <span>Quick search/filter</span>
            </div>
            <div className="shortcut-item">
              <kbd>A</kbd>
              <span>Open theme editor</span>
            </div>
            <div className="shortcut-item">
              <kbd>Esc</kbd>
              <span>Close modals</span>
            </div>
          </div>
          <div className="tip-box">
            <strong>💡 Pro tip:</strong> Press <kbd>Cmd/Ctrl</kbd> + <kbd>K</kbd> anytime to see all available commands
          </div>
        </div>
      ),
    },
    {
      id: 'complete',
      title: 'You\'re All Set!',
      content: (
        <div className="wizard-step">
          <div className="complete-icon">✨</div>
          <h2>You're All Set!</h2>
          <p className="lead">
            Start organizing your tasks with style
          </p>
          <div className="next-steps">
            <h3>Next Steps:</h3>
            <ul>
              <li>Press <kbd>N</kbd> to create your first task</li>
              <li>Use the quick-add bar at the top for rapid entry</li>
              <li>Press <kbd>Cmd/Ctrl</kbd> + <kbd>K</kbd> to explore all features</li>
              <li>Visit Settings to configure Ollama for AI features (optional)</li>
            </ul>
          </div>
          <div className="info-box">
            <p>
              <strong>💾 All your data is stored locally</strong><br />
              No cloud sync means complete privacy. Export/import via the command palette.
            </p>
          </div>
        </div>
      ),
    },
  ];

  if (!isVisible) return null;

  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  return (
    <div className="wizard-overlay">
      <div className="wizard-modal">
        <div className="wizard-progress">
          {steps.map((s, i) => (
            <div
              key={s.id}
              className={`progress-dot ${i === currentStep ? 'active' : ''} ${
                i < currentStep ? 'completed' : ''
              }`}
            />
          ))}
        </div>

        <div className="wizard-content">{step.content}</div>

        <div className="wizard-actions">
          {!isFirstStep && (
            <button className="btn-back" onClick={handleBack}>
              ← Back
            </button>
          )}

          <div className="action-spacer" />

          {!isLastStep && (
            <button className="btn-skip" onClick={handleSkip}>
              Skip Setup
            </button>
          )}

          <button className="btn-next" onClick={handleNext}>
            {isLastStep ? "Let's Go!" : 'Next →'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FirstRunWizard;
