import React, { createContext, useContext, useState } from "react";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";
import "../../styles/Toast.css";

const ToastContext = createContext(null);

const TOAST_ICONS = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
};

function ToastViewport({ toasts, removeToast }) {
  return (
    <div className="toast-viewport" aria-live="polite" aria-atomic="true">
      {toasts.map((toast) => {
        const Icon = TOAST_ICONS[toast.type] || Info;

        return (
          <div key={toast.id} className={`toast toast-${toast.type}`}>
            <div className="toast-icon">
              <Icon size={18} strokeWidth={2.1} />
            </div>

            <div className="toast-copy">
              {toast.title && <strong>{toast.title}</strong>}
              {toast.message && <span>{toast.message}</span>}
            </div>

            <button
              type="button"
              className="toast-close"
              onClick={() => removeToast(toast.id)}
              aria-label="Cerrar aviso"
            >
              <X size={16} strokeWidth={2.1} />
            </button>
          </div>
        );
      })}
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = (id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  };

  const showToast = ({ type = "info", title = "", message = "", duration = 3200 }) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;

    setToasts((current) => [...current, { id, type, title, message }]);

    window.setTimeout(() => {
      removeToast(id);
    }, duration);
  };

  const value = {
    showToast,
    success: (message, title = "Hecho") => showToast({ type: "success", title, message }),
    error: (message, title = "Error") => showToast({ type: "error", title, message }),
    info: (message, title = "Información") => showToast({ type: "info", title, message }),
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast debe usarse dentro de ToastProvider.");
  }

  return context;
}
