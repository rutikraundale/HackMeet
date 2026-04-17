// Simple Toast notification utility
let toastCallbacks = [];

export const subscribeToToasts = (callback) => {
  toastCallbacks.push(callback);
  return () => {
    toastCallbacks = toastCallbacks.filter(cb => cb !== callback);
  };
};

export const showToast = (message, type = 'info') => {
  const id = Date.now();
  toastCallbacks.forEach(cb => cb({ id, message, type }));
  
  // Auto-remove after 3 seconds
  setTimeout(() => {
    toastCallbacks.forEach(cb => cb({ id, remove: true }));
  }, 3000);
  
  return id;
};

export const removeToast = (id) => {
  toastCallbacks.forEach(cb => cb({ id, remove: true }));
};