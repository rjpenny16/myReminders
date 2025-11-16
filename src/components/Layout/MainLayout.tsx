import { useTaskStore } from '../../store/taskStore';
import TaskSection from './TaskSection';
import QuickAddBar from '../QuickAdd/QuickAddBar';
import './MainLayout.css';

const MainLayout = () => {
  const { tasks } = useTaskStore();

  const todayTasks = tasks.filter((t) => t.section === 'today');
  const upcomingTasks = tasks.filter((t) => t.section === 'upcoming');
  const somedayTasks = tasks.filter((t) => t.section === 'someday');

  return (
    <div className="main-layout">
      <QuickAddBar />
      <div className="sections-container">
        <TaskSection title="Today" tasks={todayTasks} section="today" />
        <TaskSection title="Upcoming" tasks={upcomingTasks} section="upcoming" />
        <TaskSection title="Someday" tasks={somedayTasks} section="someday" />
      </div>
    </div>
  );
};

export default MainLayout;
