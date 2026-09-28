import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';

export default function ToastContainer() {
  const { toasts } = useContext(AppContext);

  return (
    <div className="toast-container" id="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast ${toast.type}`}>
          <span>{toast.type === "success" ? "✓" : "!"}</span> 
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
}
