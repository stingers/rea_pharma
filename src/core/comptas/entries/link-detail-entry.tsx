import { Entry } from "asv-hlps";
import { ModalBase } from "asv-hlps-react";
import React, { useState } from "react";

import DetailEntry from "./detail-entry";

type TobType = {
  entry: Entry;
};

const LinkDetailEntry = ({ entry }: TobType) => {
  const [modal, setModal] = useState(false);
  return (
    <>
      <span className="cursor-pointer" onClick={() => setModal(true)}>
        {entry.ref}
      </span>
      <ModalBase
        footer={false}
        size="lg"
        // fullscreen={"xxl-down"}
        // dialogClassName={"modal-right"}
        title={<span>{`${entry?.ref} (${entry?.bill?.ref}) ${entry?.billPayment?.method?.name}`}</span>}
        show={modal}
        onCloseModal={() => setModal(false)}
        content={<DetailEntry entry={entry} />}
      />
    </>
  );
};

export default LinkDetailEntry;
