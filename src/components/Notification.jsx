import React from 'react';
import { CheckCircle2, AlertCircle, Info, XCircle, X } from 'lucide-react';
import useNotification from '../hooks/useNotification';

/**
 * Reusable Toast / Notification Component
 * Displays stacked active notifications with auto-dismiss and close buttons
 */
export default function Notification() {
  const { toasts, removeNotification } = useNotification();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container" role="region" aria-label="Notifications" aria-live="polite">
      {toasts.map((toast) => {
        const isError = toast.type === 'error' || toast.type === 'danger';
        const isWarning = toast.type === 'warning';

        let Icon = CheckCircle2;
        let toastClass = 'toast-success';

        if (isError) {
          Icon = XCircle;
          toastClass = 'toast-error';
        } else if (isWarning) {
          Icon = AlertCircle;
          toastClass = 'toast-warning';
        } else if (toast.type === 'info') {
          Icon = Info;
          toastClass = 'toast-info';
        }

        return (
          <div key={toast.id} className={`toast-item ${toastClass}`} role="alert">
            <div className="toast-icon">
              <Icon size={18} />
            </div>
            <div className="toast-message">
              {toast.message}
            </div>
            <button
              type="button"
              className="toast-close"
              onClick={() => removeNotification(toast.id)}
              aria-label="Dismiss notification"
            >
              <X size={15} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
