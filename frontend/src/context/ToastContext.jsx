import React, { createContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  // Add a toast notification
  const showToast = useCallback((message, type = 'success', duration = 4000) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prevToasts) => [...prevToasts, { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, []);

  // Remove a toast notification
  const removeToast = useCallback((id) => {
    setToasts((prevToasts) => prevToasts.filter((t) => t.id !== id));
  }, []);

  // Icon mapping
  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-emerald-600" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-rose-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-600" />;
      case 'info':
      default:
        return <Info className="w-5 h-5 text-indigo-600" />;
    }
  };

  // Color theme mapping
  const getTheme = (type) => {
    switch (type) {
      case 'success':
        return 'bg-emerald-50 border-emerald-100 text-emerald-900 shadow-emerald-100/50';
      case 'error':
        return 'bg-rose-50 border-rose-100 text-rose-900 shadow-rose-100/50';
      case 'warning':
        return 'bg-amber-50 border-amber-100 text-amber-900 shadow-amber-100/50';
      case 'info':
      default:
        return 'bg-indigo-50 border-indigo-100 text-indigo-900 shadow-indigo-100/50';
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Portal Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-start p-4 border rounded-xl shadow-lg pointer-events-auto transition-all duration-300 transform translate-y-0 ease-out animate-slide-in ${getTheme(
              toast.type
            )}`}
            style={{
              animation: 'slide-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            }}
          >
            <div className="flex-shrink-0 mr-3">{getIcon(toast.type)}</div>
            <div className="flex-grow mr-2 text-sm font-medium">{toast.message}</div>
            <button
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 p-0.5 rounded-lg hover:bg-black/5 text-slate-400 hover:text-slate-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Global CSS for Toast Animation in code block context */}
      <style>{`
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateY(1rem) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
