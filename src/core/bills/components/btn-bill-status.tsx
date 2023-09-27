import { CAISSE } from "../../../auth/services/auth-menu";
import authService from "../../../auth/services/authService";
import { DocDefinition } from "../../../pdfs/DocDefinition";
import pdfService from "../../../services/pdfService";
import PayBill from "./pay-bill";
import { Bill } from "asv-hlps";
import { BtnAction, BtnType } from "asv-hlps-react";
import { ModalBase } from "asv-hlps-react/lib/cjs/reacts/minton/modals";
import { useState } from "react";

type TobType = {
  bill: Bill;
  onPaySuccess: (tob: Bill) => void;
  code?: string;
};

const BtnBillStatus = ({ bill, onPaySuccess, code }: TobType) => {
  const [modalPayBill, setModalPayBill] = useState(false);
  //  const [bill, setBill] = useState(ntob);
  // const authUser = useContext(AuthContext);

  const btn = () => {
    if (bill.isPaid) {
      return ["payé", "success"];
    }
    if (!bill.isPaid || bill.isPartialPaid) {
      if (authService.getAuth({ roles: CAISSE })) {
        return ["solder", "primary"];
      } else {
        return ["impayé", "warning"];
      }
    }
  };

  const btns: BtnType[] = [{ id: 1, label: btn()[0], variant: btn()[1] }];

  const payBill = async () => {
    setModalPayBill(true);
  };

  const onValided = (payment) => {
    setModalPayBill(false);
    onPaySuccess(payment);
    pdfService.generatePdf("print", DocDefinition.paymentReceipt(payment));
  };

  const handleCancel = () => {
    setModalPayBill(false);
  };

  return (
    <>
      <BtnAction btns={btns} onBtn={payBill} />
      {(bill.isPartialPaid || !bill.isPaid) && authService.getAuth({ roles: CAISSE }) && (
        <ModalBase
          // footer={false}
          title={
            <span className="text-uppercase fs-5">
              {/* <i className="fas fa-hand-holding-usd me-1"></i> */} {`payment de la facture n° ${bill.ref}`}
            </span>
          }
          icon="fas fa-hand-holding-usd"
          show={modalPayBill}
          onCloseModal={() => setModalPayBill(false)}
          content={<PayBill bill={bill} onCancel={handleCancel} onValided={onValided} />}
        />
      )}
    </>
  );
};

export default BtnBillStatus;
