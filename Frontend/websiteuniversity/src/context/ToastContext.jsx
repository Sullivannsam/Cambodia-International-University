import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, XCircle, Info } from 'lucide-react';

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback((message, type = "success") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 3500);
  }, [removeToast]);

  const toast = useCallback((message, type = "success") => push(message, type), [push]);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div style={{
        position: "fixed", top: 18, right: 18, zIndex: 99999,
        display: "flex", flexDirection: "column", gap: 10, maxWidth: "min(92vw, 380px)",
      }}>
        {toasts.map((t) => {
          const colors = t.type === "success"
            ? { bg: "#E3F0E7", border: "#2E9E6C", text: "#1E7A4E", Icon: CheckCircle2 }
            : t.type === "error"
              ? { bg: "#FBE3E0", border: "#D2483C", text: "#D2483C", Icon: XCircle }
              : { bg: "#E7E3F7", border: "#3E5EDB", text: "#3E5EDB", Icon: Info };
          const { Icon } = colors;
          return (
            <div key={t.id} style={{
              background: colors.bg, border: `1px solid ${colors.border}`, color: colors.text,
              borderRadius: 12, padding: "12px 16px", fontSize: 13.5, fontWeight: 600,
              display: "flex", alignItems: "center", gap: 10, boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
              animation: "toastSlide 0.25s ease",
            }}>
              <Icon size={17} />
              <span style={{ flex: 1 }}>{t.message}</span>
              <button onClick={() => removeToast(t.id)} aria-label="Dismiss" style={{
                background: "none", border: "none", cursor: "pointer", color: "inherit",
                fontSize: 15, lineHeight: 1, padding: 2, opacity: 0.6,
              }}>×</button>
            </div>
          );
        })}
      </div>
      <style>{`
        @keyframes toastSlide {
          from { opacity: 0; transform: translateX(16px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
