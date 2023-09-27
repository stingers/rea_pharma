import { Bill } from "asv-hlps";
import React, { useState } from "react";
import { ModalConfirm } from "asv-hlps-react/lib/cjs/reacts/minton/modals";

type TobType = {
  bill: Bill;
  onDelete?;
  onApprove;
  onCloseModal?;
};

const DelBill = ({ bill, onApprove }: TobType) => {
  const [modal, setModal] = useState(false);
  const closeModal = () => {
    setModal(false);
  };

  const handleApprove = () => {
    onApprove({ bill, confirm: "yes" });
    setModal(false);
  };

  const checkBill =
    bill.isPaid || bill.isPartialPaid ? (
      <ModalConfirm
        onCloseModal={() => setModal(false)}
        show={modal}
        content={`Vous ne pouvez pas <b>supprimer</b> une facture payée ou partiellement payée`}
        onApprove={() => setModal(false)}
      />
    ) : (
      // <ModalConfirm onCloseModal={onCloseModal} show={modal} onApprove={onApprove} />
      <ModalConfirm onCloseModal={closeModal} show={modal} onApprove={handleApprove} />
    );
  // const checkBill = bill.isPaid || bill.isPartialPaid ? false : true;

  return (
    <>
      <span onClick={() => setModal(true)}>
        <i className="fas fa-trash"></i>
      </span>
      {checkBill}
    </>
    // <ModalWarning  content={"Vous ne pouvez pas supprimer une facture payée ou partiellement payée"} />
  );
};

export default DelBill;
