import React, { useEffect, useState } from 'react';
import { CheckCircle, AlertTriangle, Info, XCircle, X } from 'lucide-react';

/**
 * DS v3 Toast Notification
 * Slide-down from top, auto-dismiss 3s, H=48px
 */
export const Toast = ({
  message,
  type = 'info',
  visible = false,
  onClose,
  duration = 3000,
}) => {
  const [show, setShow] = useState(visible);

  useEffect(() => {
    if (visible) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        setTimeout(() => onClose?.(), 150);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [visible, duration, onClose]);

  if (!visible && !show) return null;

  const icons = {
    success: <CheckCircle size={20} className="text-semantic-success" />,
    error: <XCircle size={20} className="text-semantic-error" />,
    warning: <AlertTriangle size={20} className="text-semantic-warning" />,
    info: <Info size={20} className="text-semantic-info" />,
  };

  const bgColors = {
    success: 'bg-semantic-success/10 border-semantic-success/20',
    error: 'bg-semantic-error/10 border-semantic-error/20',
    warning: 'bg-semantic-warning/10 border-semantic-warning/20',
    info: 'bg-semantic-info/10 border-semantic-info/20',
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] flex justify-center px-ds-2xl pt-ds-2xl pointer-events-none">
      <div
        className={`
          pointer-events-auto
          h-12 px-4 rounded-ds-m border
          flex items-center gap-3
          shadow-elevation-2 backdrop-blur-sm
          ${bgColors[type] || bgColors.info}
          ${show ? 'animate-toast-in' : 'animate-toast-out'}
        `}
      >
        {icons[type]}
        <span className="ds-body-m text-base-text-primary flex-1">{message}</span>
        <button onClick={() => { setShow(false); onClose?.(); }} className="text-base-text-tertiary hover:text-base-text-secondary">
          <X size={16} />
        </button>
      </div>
    </div>
  );
};
