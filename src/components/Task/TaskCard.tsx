import { Task } from '../../types';
import { useTaskStore } from '../../store/taskStore';
import './TaskCard.css';

interface TaskCardProps {
  task: Task;
}

const TaskCard = ({ task }: TaskCardProps) => {
  const { completeTask, setAIPanelOpen } = useTaskStore();

  const handleComplete = () => {
    completeTask(task.id);
  };

  const handleAIDraft = () => {
    setAIPanelOpen(true, task.id);
  };

  const formatDueDate = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diffMs = d.getTime() - now.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    return `${diffDays}d`;
  };

  const getPriorityColor = (priority?: number) => {
    switch (priority) {
      case 1:
        return 'var(--color-error)';
      case 2:
        return 'var(--color-warning)';
      case 3:
        return 'var(--color-success)';
      default:
        return 'var(--color-text-secondary)';
    }
  };

  return (
    <div className="task-card hover-lift press-scale">
      <div className="task-card-header">
        <button
          className="task-complete-btn"
          onClick={handleComplete}
          aria-label="Complete task"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="10"
              cy="10"
              r="8"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        </button>
        <div className="task-content">
          <h3 className="task-title">{task.title}</h3>
          {task.notes && <p className="task-notes">{task.notes}</p>}
        </div>
        {task.priority && (
          <div
            className="task-priority"
            style={{ backgroundColor: getPriorityColor(task.priority) }}
          />
        )}
      </div>
      <div className="task-card-footer">
        {task.dueAt && (
          <span className="task-due-time">{formatDueDate(task.dueAt)}</span>
        )}
        {task.tags && task.tags.length > 0 && (
          <div className="task-tags">
            {task.tags.map((tag) => (
              <span key={tag} className="task-tag">
                {tag}
              </span>
            ))}
          </div>
        )}
        {task.action === 'email_draft' && (
          <button className="task-action-btn" onClick={handleAIDraft}>
            ✨ Draft
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
