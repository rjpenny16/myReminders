import { Task, TaskSection as TaskSectionType } from '../../types';
import TaskCard from '../Task/TaskCard';
import './TaskSection.css';

interface TaskSectionProps {
  title: string;
  tasks: Task[];
  section: TaskSectionType;
}

const TaskSection = ({ title, tasks, section }: TaskSectionProps) => {
  return (
    <div className="task-section" data-section={section}>
      <div className="task-section-header">
        <h2 className="task-section-title">{title}</h2>
        <span className="task-count">{tasks.length}</span>
      </div>
      <div className="task-list">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
        {tasks.length === 0 && (
          <div className="empty-state">
            <p>No tasks yet</p>
            <p className="empty-state-hint">Press N to create one</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskSection;
