import { Entry } from "asv-hlps";
import { ModalBase } from "asv-hlps-react";
import { useState } from "react";

import DetailBill from "../../bills/detail-bill";

type TobType = {
  entry: Entry;
};

const LinkProofEntry = ({ entry }: TobType) => {
  const [modal, setModal] = useState(false);
  return (
    <>
      {entry.bill ? (
        <span className="cursor-pointer" onClick={() => setModal(true)}>
          {entry.proof}
        </span>
      ) : null}

      <ModalBase
        footer={false}
        size="lg"
        // fullscreen={"xxl-down"}
        // dialogClassName={"modal-right"}
        title={entry?.bill.ref}
        show={modal}
        onCloseModal={() => setModal(false)}
        content={<DetailBill bill={entry.bill} />}
      />
    </>
  );
};

export default LinkProofEntry;
