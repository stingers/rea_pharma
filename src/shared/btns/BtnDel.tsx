import React, { useState } from "react";
import { ModalConfirm } from "asv-hlps-react/lib/cjs/reacts/minton/modals";

type BtnDelProps = {
  tob;
  onDelete: (tob) => void;
};

const BtnDel = ({ tob, onDelete }: BtnDelProps) => {
  let [confirmModal, setConfirmModal] = useState(false);

  const handleCancel = () => setConfirmModal(false);
  const handleClose = () => setConfirmModal(false);

  const handleApprove = () => {
    handleClose();
    onDelete(tob);
  };

  return (
    <>
      <span
        className="btn btn-transparent btn-sm btn-link p-0 ms-1 text-danger"
        onClick={() => {
          setConfirmModal(true);
        }}>
        <i className="fas fa-trash"></i>
      </span>
      <ModalConfirm show={confirmModal} onCloseModal={handleClose} onApprove={handleApprove}></ModalConfirm>
    </>
  );
};

export default BtnDel;
