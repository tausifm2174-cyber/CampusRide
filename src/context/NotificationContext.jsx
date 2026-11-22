import React, { createContext, useContext, useState, useCallback } from 'react';

export const NotificationContext = createContext(null);

/**
 * NotificationProvider
 * Manages in-app toasts with automatic timeout dismissal
 */
export function NotificationProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeNotification = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showNotification = useCallback((message, type = 'success', duration = 3500) => {
    const id = Date.now() + Math.random().toString(36).substr(2, 5);
    const newToast = { id, message, type, duration };

    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }

    return id;
  }, [removeNotification]);

  const value = {
    toasts,
    showNotification,
    removeNotification
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export default NotificationContext;
