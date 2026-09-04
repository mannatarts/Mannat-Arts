export interface ToastMessage {
  id: string;
  type: "success" | "info" | "warning";
  text: string;
}

interface ToastNotificationProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export function ToastNotification({ toasts, onDismiss }: ToastNotificationProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[120] flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl border text-xs font-ui font-medium animate-slideUp ${
            toast.type === "success"
              ? "bg-[#1A1916] text-[#FAF7F2] border-[#C4952A]/40"
              : toast.type === "warning"
              ? "bg-[#FAF7F2] text-amber-900 border-amber-300"
              : "bg-white text-[#1A1916] border-[#EDE8DF]"
          }`}
        >
          <span className="text-sm">
            {toast.type === "success" ? "✓" : toast.type === "warning" ? "⚠️" : "ℹ️"}
          </span>
          <span>{toast.text}</span>
          <button
            onClick={() => onDismiss(toast.id)}
            className="ml-2 opacity-60 hover:opacity-100 transition-opacity"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
