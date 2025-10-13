import React from "react";
import { useToast } from "../../context/ToastContext";
import "./toast.css";

const toneIcons = {
  success: "✅",
  danger: "⛔",
  warning: "⚠️",
  info: "ℹ️",
};

const ToastContainer = () => {
  const { toasts, dismiss } = useToast();

  if (!toasts.length) return null;

  return (
    <div className="toast-stack" role="status" aria-live="polite">
      {toasts.map((toast) => {
        const icon = toneIcons[toast.tone] || toneIcons.info;
        return (
          <div key={toast.id} className={`toast-card toast-card--${toast.tone}`}>
            <div className="toast-card__icon" aria-hidden="true">
              {icon}
            </div>
            <div className="toast-card__content">
              {toast.title ? <strong>{toast.title}</strong> : null}
              {toast.message ? <span>{toast.message}</span> : null}
              {toast.action ? (
                <button
                  type="button"
                  className="toast-card__action"
                  onClick={() => {
                    toast.action.onClick?.();
                    dismiss(toast.id);
                  }}
                >
                  {toast.action.label}
                </button>
              ) : null}
            </div>
            <button
              type="button"
              className="toast-card__dismiss"
              onClick={() => dismiss(toast.id)}
              aria-label="Dismiss notification"
            >
              ×
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default ToastContainer;
