import { useEffect, useState } from 'react';

type NotificationType = 'success' | 'error' | 'info';

interface NotificationProps {
  type: NotificationType;
  message: string;
  onClose?: () => void;
  autoClose?: boolean;
  duration?: number;
}

const Notification = ({
  type,
  message,
  onClose,
  autoClose = true,
  duration = 5000,
}: NotificationProps) => {
  const [isVisible, setIsVisible] = useState(true);

  // Auto-close effect
  useEffect(() => {
    if (autoClose && isVisible) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose && onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, isVisible, onClose]);

  if (!isVisible) return null;

  // Determine styling based on type
  const getClasses = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 text-green-800 border-green-300';
      case 'error':
        return 'bg-red-50 text-red-800 border-red-300';
      case 'info':
      default:
        return 'bg-blue-50 text-blue-800 border-blue-300';
    }
  };

  return (
    <div className={`p-4 rounded border mb-4 ${getClasses()}`}>
      <div className="flex justify-between items-center">
        <div className="flex-1">{message}</div>
        <button
          onClick={() => {
            setIsVisible(false);
            onClose && onClose();
          }}
          className="text-gray-500 hover:text-gray-800"
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Notification; 