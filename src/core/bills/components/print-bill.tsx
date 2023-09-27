import { Bill, EBillPeriod, inSteGrp } from "asv-hlps";
import DisplayTooltip from "asv-hlps-react/lib/cjs/reacts/displays/display-tooltip";

import httpService from "../../../services/httpService";
import PdfService from "../../../services/pdfService";
import { PdfBillTables } from "../pdfs/PdfBillTables";
import { InvoiceDefinitionLetter } from "../pdfs/invoices/Letters/InvoiceDefinitionLetter";
import { InvoiceSalesDefinitionLetter } from "../pdfs/invoices/Letters/InvoiceListSalesDefinitionLetter";

type TobType = {
  bill: Bill;
  onUpdatePrint?: (tob) => void;
};

const PrintBill = ({ bill, onUpdatePrint }: TobType) => {
  const genPdfBill = (action: string, bill: Bill) => {
    const invoice =
      bill.client.periodBill !== EBillPeriod.DAY
        ? InvoiceSalesDefinitionLetter.invoice(bill, PdfBillTables.listBillDetailTable(bill.sales))
        : InvoiceDefinitionLetter.invoice(bill, PdfBillTables.invoiceTable(bill.sales[0].saleProducts));
    PdfService.generatePdf(action, invoice);
  };

  const genBillPdf = async () => {
    genPdfBill("print", bill);
    const { data, status } = await httpService.postId(bill.id, "bills/incrementPrint");
    if (status === 200) {
      onUpdatePrint(data);
    }
  };

  const onGenBillBlPdf = () => {
    const invoice = InvoiceDefinitionLetter.invoiceBl(bill, PdfBillTables.invoiceBlTable(bill.sales[0].saleProducts));
    PdfService.generatePdf("print", invoice);
  };

  return (
    <>
      <span className="text-small">
        {bill.nbPrint > 0 && (
          <DisplayTooltip content="Nombre d'impression">
            <span>{bill.nbPrint}</span>
          </DisplayTooltip>
        )}
        <DisplayTooltip content="Facture">
          <span className="ms-1 cursor-pointer" onClick={genBillPdf}>
            <i className="fas fa-print"></i>
          </span>
        </DisplayTooltip>
        {!inSteGrp(["ph"], bill.client) && (
          <>
            <DisplayTooltip content="BL">
              <span className="ms-1 cursor-pointer fw-300" onClick={onGenBillBlPdf}>
                BL
              </span>
            </DisplayTooltip>
          </>
        )}
      </span>
    </>
  );
};

export default PrintBill;
