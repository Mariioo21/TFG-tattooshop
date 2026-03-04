import React from "react";
import "../../styles/ConfirmModal.css";

function ConfirmModal({
  open,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  onConfirm,
  onCancel,
}) {
  if (!open) return null;

  return (
    <div className="confirm-modal-backdrop" onClick={onCancel}>
      <div
        className="confirm-modal"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
      >
        <h3 id="confirm-modal-title" className="confirm-modal-title">
          {title}
        </h3>
        <p className="confirm-modal-text">{message}</p>

        <div className="confirm-modal-actions">
          <button type="button" className="confirm-modal-cancel" onClick={onCancel}>
            {cancelText}
          </button>
          <button type="button" className="confirm-modal-confirm" onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
