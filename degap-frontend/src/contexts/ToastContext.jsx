import { useState, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import Toast from "../components/common/Toast";
import { ToastContext } from "./ToastContextDefinition";

function useProvideToast() {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback((message, type = "info", duration = 3000) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type, duration }]);
  }, []);

  useEffect(() => {
    function handleGlobalError(event) {
      const detail = event.detail;
      if (!detail) return;
      const message = detail.message || "Something went wrong. Please try again.";
      const type = detail.type || "error";
      addToast(message, type);
    }

    window.addEventListener("degap:error", handleGlobalError);

    return () => {
      window.removeEventListener("degap:error", handleGlobalError);
    };
  }, [addToast]);

  return {
    toasts,
    addToast,
    removeToast,
  };
}

export function ToastProvider({ children }) {
  const { toasts, addToast, removeToast } = useProvideToast();

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      {createPortal(
        <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
          {toasts.map((toast) => (
            <Toast
              key={toast.id}
              {...toast}
              onClose={() => removeToast(toast.id)}
            />
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
}
