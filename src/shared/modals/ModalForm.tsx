import React from "react";
import { Modal } from "react-bootstrap";

type DisplayModalProps = {
  show: boolean;
  onCloseModal: () => void;
  onShow?: () => void;
  onSubmitForm?: (values: any) => void;
  modalTitle?;
  modalContent?;
  onApprove?;
  onCancel?;
  modalSize?: "lg" | "sm" | "xl";
  cancelLabel?;
  approveLabel?;
  schema?;
  methods?;
};

export const ModalForm: React.FC<DisplayModalProps> = ({
  show = false,
  onCloseModal,
  modalSize,
  modalTitle = "",
  modalContent,
  // methods,
}) => {
  return (
    <Modal size={modalSize} show={show} onHide={() => onCloseModal()}>
      <Modal.Header className="py-1" closeButton>
        <Modal.Title className="p-0 text-uppercase">{modalTitle}</Modal.Title>
      </Modal.Header>
      {modalContent}
    </Modal>
  );
};
