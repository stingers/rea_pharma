import { BillPayment } from "asv-hlps";
import { BtnAction, DropMenuType } from "asv-hlps-react";

import authService from "../../../auth/services/authService";

type TobType = {
  payment: BillPayment;
  // onDelete?: (tob) => void;
  // onUpdateNbPrint?: (tob) => void;
};

const BtnBillPaymentAction = ({ payment }: TobType) => {
  // const [modal, setModal] = useState(false);
  // const [del, setDel] = useState(false);
  const dropMenu: DropMenuType = {
    ellipsis: "v",
    drops: [
      {
        id: 1,
        label: "Credit sur facture",
        icon: "fas fa-birthday-cake",
        auth: authService.getAuth({ roles: ["cai"] }),
      },
      { id: 2, label: "supprimer", icon: "fas fa-trash", auth: authService.getAuth({ roles: ["sadm"] }) },
    ],
  };

  const handleDrop = (prop) => {
    switch (prop.id) {
      case 1:
        break;
      case 2:
        break;
    }
  };

  return (
    <>
      <span className=" cursor-pointer me-1">{payment.ref}</span>

      <BtnAction dropMenu={dropMenu} onDrop={handleDrop} elpDrop />
    </>
  );
};

export default BtnBillPaymentAction;
