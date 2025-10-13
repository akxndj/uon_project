import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { v4 as uuid } from "uuid";

const ToastContext = createContext(undefined);

const TOAST_LIFETIME = 4500;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const push = useCallback(({ title, message, tone = "info", action }) => {
    const id = uuid();
    const toast = {
      id,
      title,
      message,
      tone,
      action,
    };

    setToasts((current) => [...current, toast]);

    window.setTimeout(() => {
      dismiss(id);
    }, TOAST_LIFETIME);
  }, [dismiss]);

  const value = useMemo(
    () => ({
      toasts,
      push,
      dismiss,
    }),
    [toasts, push, dismiss]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  return context;
};
