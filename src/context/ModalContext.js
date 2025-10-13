import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

const ModalContext = createContext(undefined);

const DEFAULT_MODAL = {
  title: "",
  description: "",
  tone: "info",
  size: "md",
  dismissible: true,
  showCancel: true,
  confirmLabel: "Confirm",
  cancelLabel: "Cancel",
  actions: undefined,
  body: null,
  render: null,
  onConfirm: undefined,
  onCancel: undefined,
  onClose: undefined,
  closeOnConfirm: true,
  closeOnCancel: true,
};

export const ModalProvider = ({ children }) => {
  const [modal, setModal] = useState(null);

  const openModal = useCallback((config) => {
    setModal({
      ...DEFAULT_MODAL,
      ...config,
      tone: config?.tone || DEFAULT_MODAL.tone,
      size: config?.size || DEFAULT_MODAL.size,
      confirmLabel: config?.confirmLabel || DEFAULT_MODAL.confirmLabel,
      cancelLabel: config?.cancelLabel || DEFAULT_MODAL.cancelLabel,
      dismissible:
        typeof config?.dismissible === "boolean"
          ? config.dismissible
          : DEFAULT_MODAL.dismissible,
      showCancel:
        typeof config?.showCancel === "boolean"
          ? config.showCancel
          : DEFAULT_MODAL.showCancel,
      closeOnConfirm:
        typeof config?.closeOnConfirm === "boolean"
          ? config.closeOnConfirm
          : DEFAULT_MODAL.closeOnConfirm,
      closeOnCancel:
        typeof config?.closeOnCancel === "boolean"
          ? config.closeOnCancel
          : DEFAULT_MODAL.closeOnCancel,
    });
  }, []);

  const closeModal = useCallback(() => {
    setModal((current) => {
      current?.onClose?.();
      return null;
    });
  }, []);

  const confirm = useCallback(
    (config) =>
      new Promise((resolve) => {
        openModal({
          ...config,
          tone: config?.tone || "danger",
          confirmLabel: config?.confirmLabel || "Confirm",
          cancelLabel: config?.cancelLabel || "Cancel",
          size: config?.size || "sm",
          showCancel:
            typeof config?.showCancel === "boolean"
              ? config.showCancel
              : true,
          dismissible:
            typeof config?.dismissible === "boolean"
              ? config.dismissible
              : true,
          actions: undefined,
          closeOnConfirm: config?.closeOnConfirm !== false,
          closeOnCancel: config?.closeOnCancel !== false,
          onConfirm: (...args) => {
            const result = config?.onConfirm?.(...args);
            resolve(true);
            return result;
          },
          onCancel: (...args) => {
            const result = config?.onCancel?.(...args);
            resolve(false);
            return result;
          },
        });
      }),
    [openModal]
  );

  const value = useMemo(
    () => ({
      modal,
      openModal,
      closeModal,
      confirm,
    }),
    [modal, openModal, closeModal, confirm]
  );

  return (
    <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};
