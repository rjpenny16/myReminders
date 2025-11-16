import { useState, KeyboardEvent } from 'react';
import { useTaskStore } from '../../store/taskStore';
import { TaskSection } from '../../types';
import './QuickAddBar.css';

const QuickAddBar = () => {
  const [input, setInput] = useState('');
  const [section, setSection] = useState<TaskSection>('today');
  const { createTask } = useTaskStore();

  const handleKeyDown = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && input.trim()) {
      e.preventDefault();

      await createTask({
        title: input.trim(),
        section: section,
      });

      setInput('');
    }
  };

  return (
    <div className="quick-add-bar">
      <div className="quick-add-container">
        <div className="quick-add-icon">+</div>
        <input
          type="text"
          className="quick-add-input"
          placeholder="Quick add task... (Press Enter)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <div className="quick-add-section-picker">
          <button
            className={`section-btn ${section === 'today' ? 'active' : ''}`}
            onClick={() => setSection('today')}
            title="Add to Today"
          >
            Today
          </button>
          <button
            className={`section-btn ${section === 'upcoming' ? 'active' : ''}`}
            onClick={() => setSection('upcoming')}
            title="Add to Upcoming"
          >
            Upcoming
          </button>
          <button
            className={`section-btn ${section === 'someday' ? 'active' : ''}`}
            onClick={() => setSection('someday')}
            title="Add to Someday"
          >
            Someday
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickAddBar;
