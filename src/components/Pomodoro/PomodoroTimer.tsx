import { useState, useEffect, useRef } from 'react';
import { useTaskStore } from '../../store/taskStore';
import './PomodoroTimer.css';

interface PomodoroTimerProps {
  isOpen: boolean;
  onClose: () => void;
}

const PomodoroTimer = ({ isOpen, onClose }: PomodoroTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<'focus' | 'shortBreak' | 'longBreak'>('focus');
  const [sessions, setSessions] = useState(0);
  const intervalRef = useRef<number | null>(null);
  const { tasks } = useTaskStore();

  const TIMES = {
    focus: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60,
  };

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimerComplete();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  const handleTimerComplete = () => {
    setIsRunning(false);

    // Play notification sound (browser notification)
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Pomodoro Complete!', {
        body: mode === 'focus'
          ? 'Great work! Time for a break.'
          : 'Break over! Ready to focus?',
      });
    }

    // Auto-switch modes
    if (mode === 'focus') {
      const newSessions = sessions + 1;
      setSessions(newSessions);
      if (newSessions % 4 === 0) {
        setMode('longBreak');
        setTimeLeft(TIMES.longBreak);
      } else {
        setMode('shortBreak');
        setTimeLeft(TIMES.shortBreak);
      }
    } else {
      setMode('focus');
      setTimeLeft(TIMES.focus);
    }
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(TIMES[mode]);
  };

  const switchMode = (newMode: 'focus' | 'shortBreak' | 'longBreak') => {
    setMode(newMode);
    setTimeLeft(TIMES[newMode]);
    setIsRunning(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((TIMES[mode] - timeLeft) / TIMES[mode]) * 100;

  if (!isOpen) return null;

  return (
    <div className="pomodoro-overlay" onClick={onClose}>
      <div className="pomodoro-timer fade-in" onClick={(e) => e.stopPropagation()}>
        <div className="pomodoro-header">
          <h2 className="pomodoro-title">🍅 Pomodoro Timer</h2>
          <button className="pomodoro-close-btn" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <div className="pomodoro-mode-selector">
          <button
            className={`mode-btn ${mode === 'focus' ? 'active' : ''}`}
            onClick={() => switchMode('focus')}
          >
            Focus
          </button>
          <button
            className={`mode-btn ${mode === 'shortBreak' ? 'active' : ''}`}
            onClick={() => switchMode('shortBreak')}
          >
            Short Break
          </button>
          <button
            className={`mode-btn ${mode === 'longBreak' ? 'active' : ''}`}
            onClick={() => switchMode('longBreak')}
          >
            Long Break
          </button>
        </div>

        <div className="pomodoro-display">
          <svg className="progress-ring" width="280" height="280">
            <circle
              className="progress-ring-bg"
              cx="140"
              cy="140"
              r="120"
              strokeWidth="8"
            />
            <circle
              className="progress-ring-fill"
              cx="140"
              cy="140"
              r="120"
              strokeWidth="8"
              strokeDasharray={`${2 * Math.PI * 120}`}
              strokeDashoffset={`${2 * Math.PI * 120 * (1 - progress / 100)}`}
              transform="rotate(-90 140 140)"
            />
          </svg>
          <div className="timer-text">
            <div className="timer-time">{formatTime(timeLeft)}</div>
            <div className="timer-mode">
              {mode === 'focus' ? 'Focus Time' : mode === 'shortBreak' ? 'Short Break' : 'Long Break'}
            </div>
          </div>
        </div>

        <div className="pomodoro-controls">
          <button
            className={`control-btn ${isRunning ? 'pause' : 'play'}`}
            onClick={toggleTimer}
          >
            {isRunning ? '⏸ Pause' : '▶ Start'}
          </button>
          <button className="control-btn reset" onClick={resetTimer}>
            ↻ Reset
          </button>
        </div>

        <div className="pomodoro-stats">
          <div className="stat">
            <div className="stat-value">{sessions}</div>
            <div className="stat-label">Sessions Today</div>
          </div>
          <div className="stat">
            <div className="stat-value">{tasks.filter(t => t.section === 'today').length}</div>
            <div className="stat-label">Tasks Remaining</div>
          </div>
        </div>

        <div className="pomodoro-tips">
          <p>💡 <strong>Tip:</strong> Focus for 25 minutes, then take a 5-minute break. After 4 sessions, take a 15-minute break.</p>
        </div>
      </div>
    </div>
  );
};

export default PomodoroTimer;
