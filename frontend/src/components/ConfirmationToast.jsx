// frontend/src/components/ConfirmationToast.jsx
import { AlertTriangle, Check, X } from "lucide-react";
import { useEffect, useState } from "react";

const ConfirmationToast = ({ message, onConfirm, onCancel, danger = true }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Auto-hide after 5 seconds if not interacted
    const timer = setTimeout(() => {
      if (isVisible) {
        setIsVisible(false);
        setTimeout(() => onCancel(), 300);
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, [isVisible, onCancel]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden max-w-md">
        {/* Header */}
        <div
          className={`px-6 py-4 ${danger ? "bg-red-50 dark:bg-red-900/20" : "bg-amber-50 dark:bg-amber-900/20"} border-b border-gray-200 dark:border-gray-700`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-full ${danger ? "bg-red-100 dark:bg-red-900/40" : "bg-amber-100 dark:bg-amber-900/40"}`}
            >
              <AlertTriangle
                size={20}
                className={
                  danger
                    ? "text-red-600 dark:text-red-400"
                    : "text-amber-600 dark:text-amber-400"
                }
              />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white">
                Confirm Action
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {message}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 flex gap-3 justify-end">
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(onCancel, 100);
            }}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition flex items-center gap-2"
          >
            <X size={16} />
            Cancel
          </button>
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(onConfirm, 100);
            }}
            className={`px-4 py-2 rounded-lg text-white transition flex items-center gap-2 ${
              danger
                ? "bg-red-600 hover:bg-red-700"
                : "bg-amber-600 hover:bg-amber-700"
            }`}
          >
            <Check size={16} />
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationToast;
