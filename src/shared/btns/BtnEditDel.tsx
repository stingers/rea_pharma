import React from "react";

import BtnDel from "./BtnDel";

type BtnEditDelProps = {
  tob;
  onDelete: (tob) => void;
  onEdit: (tob) => any;
};

const BtnEditDel: React.FC<BtnEditDelProps> = ({ tob, onDelete, onEdit }) => {
  return (
    <>
      <span
        className="btn btn-transparent btn-sm btn-link p-0 ms-1"
        onClick={() => {
          onEdit(tob);
        }}>
        <i className="fas fa-pen"></i>
      </span>
      <BtnDel tob={tob} onDelete={onDelete} />
    </>
  );
};

export default BtnEditDel;
