// frontend/src/utils/showConfirm.js
import { createRoot } from "react-dom/client";
import ConfirmationToast from "../components/ConfirmationToast";

export const showConfirm = (message, onConfirm, onCancel, danger = true) => {
  const containerId = "confirmation-toast-container";
  let container = document.getElementById(containerId);

  if (!container) {
    container = document.createElement("div");
    container.id = containerId;
    document.body.appendChild(container);
  }

  const root = createRoot(container);

  const cleanup = () => {
    root.unmount();
    if (container?.parentNode) {
      container.parentNode.removeChild(container);
    }
  };

  root.render(
    <ConfirmationToast
      message={message}
      onConfirm={() => {
        cleanup();
        onConfirm();
      }}
      onCancel={() => {
        cleanup();
        if (onCancel) onCancel();
      }}
      danger={danger}
    />,
  );
};
