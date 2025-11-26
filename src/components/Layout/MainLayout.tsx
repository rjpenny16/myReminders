import { useTaskStore } from '../../store/taskStore';
import TaskSection from './TaskSection';
import QuickAddBar from '../QuickAdd/QuickAddBar';
import './MainLayout.css';

const MainLayout = () => {
  const { tasks, searchQuery, setSearchQuery, exportTasks } = useTaskStore();

  // Filter tasks based on search query
  const filterTasks = (taskList: typeof tasks) => {
    if (!searchQuery.trim()) return taskList;
    const query = searchQuery.toLowerCase();
    return taskList.filter(
      (t) =>
        t.title.toLowerCase().includes(query) ||
        t.notes?.toLowerCase().includes(query) ||
        t.tags?.some((tag) => tag.toLowerCase().includes(query))
    );
  };

  const todayTasks = filterTasks(tasks.filter((t) => t.section === 'today'));
  const upcomingTasks = filterTasks(tasks.filter((t) => t.section === 'upcoming'));
  const somedayTasks = filterTasks(tasks.filter((t) => t.section === 'someday'));

  return (
    <div className="main-layout">
      <QuickAddBar />
      <div className="search-bar-container">
        <input
          type="text"
          className="task-search-input"
          placeholder="🔍 Search tasks... (press / for quick access)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button
            className="search-clear-btn"
            onClick={() => setSearchQuery('')}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
        <button
          className="quick-export-btn"
          onClick={() => exportTasks()}
          title="Export all tasks"
        >
          💾
        </button>
      </div>
      <div className="sections-container">
        <TaskSection title="Today" tasks={todayTasks} section="today" />
        <TaskSection title="Upcoming" tasks={upcomingTasks} section="upcoming" />
        <TaskSection title="Someday" tasks={somedayTasks} section="someday" />
      </div>
    </div>
  );
};

export default MainLayout;
