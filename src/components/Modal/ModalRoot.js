import React, { useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { useModal } from "../../context/ModalContext";
import "./modal.css";

const toneClasses = {
  danger: "modal-card--danger",
  warning: "modal-card--warning",
  success: "modal-card--success",
  info: "modal-card--info",
};

const sizeClasses = {
  sm: "modal-card--sm",
  md: "modal-card--md",
  lg: "modal-card--lg",
};

const actionVariantClass = {
  primary: "btn--primary",
  secondary: "btn--secondary",
  ghost: "btn--ghost",
  danger: "btn--danger",
  info: "btn--info",
};

const ModalRoot = () => {
  const { modal, closeModal } = useModal();

  const handleCancel = useCallback(async () => {
    if (!modal) return;
    if (modal.onCancel) {
      await modal.onCancel();
    }
    if (modal.closeOnCancel !== false) {
      closeModal();
    }
  }, [modal, closeModal]);

  const handleConfirm = useCallback(async () => {
    if (!modal) return;
    if (modal.onConfirm) {
      await modal.onConfirm();
    }
    if (modal.closeOnConfirm !== false) {
      closeModal();
    }
  }, [modal, closeModal]);

  useEffect(() => {
    if (!modal) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape" && modal.dismissible !== false) {
        handleCancel();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [modal, handleCancel]);

  if (!modal) return null;

  const className = [
    "modal-card",
    toneClasses[modal.tone] || toneClasses.info,
    sizeClasses[modal.size] || sizeClasses.md,
  ]
    .filter(Boolean)
    .join(" ");

  const renderContent =
    typeof modal.render === "function"
      ? modal.render({ close: closeModal, modal })
      : modal.body;

  const renderActions = () => {
    if (Array.isArray(modal.actions) && modal.actions.length > 0) {
      return modal.actions.map((action) => {
        const variantClass =
          actionVariantClass[action.variant] || actionVariantClass.primary;
        return (
          <button
            key={action.label}
            type="button"
            className={`btn ${variantClass}`}
            onClick={async () => {
              if (action.onClick) {
                await action.onClick({ close: closeModal });
              }
              if (action.closeOnClick !== false) {
                closeModal();
              }
            }}
          >
            {action.label}
          </button>
        );
      });
    }

    return (
      <>
        {modal.showCancel && (
          <button
            type="button"
            className="btn btn--ghost"
            onClick={handleCancel}
          >
            {modal.cancelLabel}
          </button>
        )}
        <button
          type="button"
          className={`btn ${
            modal.tone === "danger" ? "btn--danger" : "btn--primary"
          }`}
          onClick={handleConfirm}
        >
          {modal.confirmLabel}
        </button>
      </>
    );
  };

  return createPortal(
    <div className="modal-backdrop" role="presentation">
      <div
        className="modal-scrim"
        aria-hidden="true"
        onClick={() => {
          if (modal.dismissible === false) return;
          handleCancel();
        }}
      />
      <div
        className="modal-card-wrapper"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className={className}>
          <header className="modal-card__header">
            <div>
              <h2 id="modal-title">{modal.title}</h2>
              {modal.description ? (
                <p className="modal-card__description">{modal.description}</p>
              ) : null}
            </div>
            {modal.dismissible !== false && (
              <button
                type="button"
                className="modal-card__close"
                aria-label="Close dialog"
                onClick={handleCancel}
              >
                ×
              </button>
            )}
          </header>
          <div className="modal-card__body">{renderContent}</div>
          <footer className="modal-card__footer">{renderActions()}</footer>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ModalRoot;
