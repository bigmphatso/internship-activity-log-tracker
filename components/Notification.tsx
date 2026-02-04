
import React, { useEffect, useState } from 'react';
import { Info, CheckCircle, AlertTriangle, XCircle, X } from 'lucide-react';

type NotificationType = 'info' | 'success' | 'warning' | 'error';

interface NotificationProps {
  message: string | null;
  type?: NotificationType;
  onDismiss: () => void;
}

const ICONS: Record<NotificationType, React.ReactNode> = {
    info: <Info className="h-6 w-6" />,
    success: <CheckCircle className="h-6 w-6" />,
    warning: <AlertTriangle className="h-6 w-6" />,
    error: <XCircle className="h-6 w-6" />,
};

const COLORS: Record<NotificationType, string> = {
    info: 'text-blue-500',
    success: 'text-green-500',
    warning: 'text-amber-500',
    error: 'text-red-500',
};

const TITLES: Record<NotificationType, string> = {
    info: 'Information',
    success: 'Success',
    warning: 'Notice',
    error: 'Error'
}

const Notification: React.FC<NotificationProps> = ({ message, type = 'info', onDismiss }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // FIX: Use ReturnType<typeof setTimeout> for the timer type to ensure browser compatibility.
    // The type `NodeJS.Timeout` is not available in a browser environment.
    let timer: ReturnType<typeof setTimeout>;
    if (message) {
      setVisible(true);
      timer = setTimeout(() => {
        handleDismiss();
      }, 5000); // Auto-dismiss after 5 seconds
    } else {
      setVisible(false);
    }
    return () => clearTimeout(timer);
  }, [message]);

  const handleDismiss = () => {
    setVisible(false);
    // Wait for animation to finish before calling onDismiss
    setTimeout(onDismiss, 300); 
  };
  
  return (
    <div 
      aria-live="assertive"
      className={`fixed inset-0 flex items-start justify-end px-4 py-6 sm:p-6 z-50 pointer-events-none`}
    >
      <div 
        className={`w-full max-w-sm transform transition-all duration-300 ease-in-out pointer-events-auto ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
      >
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg p-4 flex items-start">
          <div className={`flex-shrink-0 ${COLORS[type]}`}>
            {ICONS[type]}
          </div>
          <div className="ml-3 w-0 flex-1 pt-0.5">
            <p className="text-sm font-medium text-slate-900 dark:text-white">{TITLES[type]}</p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{message}</p>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button onClick={handleDismiss} className="inline-flex text-slate-400 dark:text-slate-500 hover:text-slate-500 dark:hover:text-slate-400">
              <span className="sr-only">Close</span>
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notification;
