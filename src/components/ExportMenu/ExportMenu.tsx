import { useTaskStore } from '../../store/taskStore';
import './ExportMenu.css';

const ExportMenu = () => {
  const { exportMenuOpen, setExportMenuOpen, exportTasks } = useTaskStore();

  if (!exportMenuOpen) return null;

  const handleExport = async (section?: string, completedOnly?: boolean) => {
    await exportTasks(section, completedOnly);
    setExportMenuOpen(false);
  };

  return (
    <div className="export-menu-overlay" onClick={() => setExportMenuOpen(false)}>
      <div className="export-menu fade-in" onClick={(e) => e.stopPropagation()}>
        <h2 className="export-menu-title">Export Options</h2>
        <div className="export-menu-options">
          <button
            className="export-option"
            onClick={() => handleExport()}
          >
            <span className="export-option-icon">📦</span>
            <div className="export-option-content">
              <div className="export-option-label">All Tasks</div>
              <div className="export-option-desc">Export all tasks to JSON</div>
            </div>
          </button>

          <button
            className="export-option"
            onClick={() => handleExport('today')}
          >
            <span className="export-option-icon">📅</span>
            <div className="export-option-content">
              <div className="export-option-label">Today Tasks</div>
              <div className="export-option-desc">Export only today section</div>
            </div>
          </button>

          <button
            className="export-option"
            onClick={() => handleExport('upcoming')}
          >
            <span className="export-option-icon">⏰</span>
            <div className="export-option-content">
              <div className="export-option-label">Upcoming Tasks</div>
              <div className="export-option-desc">Export only upcoming section</div>
            </div>
          </button>

          <button
            className="export-option"
            onClick={() => handleExport('someday')}
          >
            <span className="export-option-icon">💭</span>
            <div className="export-option-content">
              <div className="export-option-label">Someday Tasks</div>
              <div className="export-option-desc">Export only someday section</div>
            </div>
          </button>

          <button
            className="export-option"
            onClick={() => handleExport(undefined, true)}
          >
            <span className="export-option-icon">✅</span>
            <div className="export-option-content">
              <div className="export-option-label">Completed Tasks</div>
              <div className="export-option-desc">Export only completed tasks</div>
            </div>
          </button>
        </div>
        <button className="export-menu-close" onClick={() => setExportMenuOpen(false)}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ExportMenu;
