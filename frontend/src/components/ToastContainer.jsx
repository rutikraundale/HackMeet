import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { subscribeToToasts } from '../utils/toastUtils';

const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const unsubscribe = subscribeToToasts((toast) => {
      if (toast.remove) {
        setToasts(prev => prev.filter(t => t.id !== toast.id));
      } else {
        setToasts(prev => [...prev, toast]);
      }
    });
    return unsubscribe;
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} className="text-green-400" />;
      case 'error':
        return <AlertCircle size={20} className="text-red-400" />;
      case 'info':
        return <Info size={20} className="text-blue-400" />;
      default:
        return <Info size={20} className="text-gray-400" />;
    }
  };

  const getBgColor = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-900/20 border-green-700';
      case 'error':
        return 'bg-red-900/20 border-red-700';
      case 'info':
        return 'bg-blue-900/20 border-blue-700';
      default:
        return 'bg-gray-900/20 border-gray-700';
    }
  };

  return (
    /* toast-container class enables mobile repositioning via index.css */
    <div className="toast-container fixed top-20 right-6 z-[200] space-y-3 pointer-events-none">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 p-4 rounded-lg border ${getBgColor(toast.type)} text-white pointer-events-auto animate-in slide-in-from-top-4 fade-in w-full`}
        >
          {getIcon(toast.type)}
          <span className="text-sm flex-1">{toast.message}</span>
          <button
            onClick={() => {
              setToasts(prev => prev.filter(t => t.id !== toast.id));
            }}
            className="ml-auto hover:opacity-70 shrink-0"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
