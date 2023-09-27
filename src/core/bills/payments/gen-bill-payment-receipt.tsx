import { BillPayment } from "asv-hlps";
import { BtnDownloads } from "asv-hlps-react";

import { DocDefinition } from "../../../pdfs/DocDefinition";
import httpService from "../../../services/httpService";
import pdfService from "../../../services/pdfService";

type TobProps = {
  payment: BillPayment;
};

const GenBillPaymentReceipt = ({ payment }) => {
  /* const genPdf = async (data) => {
    const { data: payment } = await httpService.findById(data.tob.id, "payments");
    pdfService.generatePdf(data.action, DocDefinition.paymentReceipt(payment));
  }; */
  const onGenPaymentReceipt = async ({ action, tob }) => {
    const { data: getPayment } = await httpService.findById(tob.id, "payments");

    pdfService.generatePdf(action, DocDefinition.paymentReceipt(getPayment));
  };
  return <BtnDownloads tob={payment} onGenPdf={onGenPaymentReceipt} icon drop />;
};

export default GenBillPaymentReceipt;
