import { useTaskStore } from '../../store/taskStore';
import './Notification.css';

const Notification = () => {
  const { notification, clearNotification } = useTaskStore();

  if (!notification) return null;

  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'info':
        return 'ℹ';
      default:
        return '';
    }
  };

  return (
    <div
      className={`notification-toast notification-${notification.type} fade-in`}
      onClick={clearNotification}
    >
      <span className="notification-icon">{getIcon()}</span>
      <span className="notification-message">{notification.message}</span>
      <button className="notification-close" onClick={clearNotification}>
        ✕
      </button>
    </div>
  );
};

export default Notification;
