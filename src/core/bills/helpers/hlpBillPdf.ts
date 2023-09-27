import { Bill, displayDateRangeFr, getTotalAmountOnListBill, getTotalDueAmountOnListBill, isStaffSte } from "asv-hlps";
import authService from "../../../auth/services/authService";
import pdfService from "../../../services/pdfService";
import { BillDefinition } from "../pdfs/BillDefinition";
import { PdfBillTables } from "../pdfs/PdfBillTables";

class HlpBillPdf {
  // genPdf = (action, bills: Bill[], status: "paid" | "nopaid", dates?) => {
  genPdf = (action, bills: Bill[], status: "paid" | "nopaid" | string, dates?) => {
    let getStatus = " ";
    if (status === "paid") {
      getStatus = "payées";
    } else if (status === "nopaid") {
      getStatus = "impayées";
    }
    const getBills = isStaffSte(["cpa"], authService.authUser().ste.name)
      ? PdfBillTables.listBillTable(bills)
      : PdfBillTables.listBillForClientTable(bills);

    const getClient = isStaffSte(["cpa"], authService.authUser().ste.name)
      ? "Factures " + getStatus + " du " + displayDateRangeFr(dates?.fromDate, dates?.toDate)
      : "Factures " + getStatus + " du " + displayDateRangeFr(dates?.fromDate, dates?.toDate) + bills[0].client.ste.name;

    pdfService.generatePdf(
      action,
      BillDefinition.generic(
        getClient,
        // "Factures " + getStatus + " du " + formatDateToDisplay(),

        getBills,
        { totalAmount: getTotalAmountOnListBill(bills), totalAmountDue: getTotalDueAmountOnListBill(bills) }
        // PdfBillTables.listBillTable(bills), { totalAmount: this.totalAmountOnListBill(),  totalAmountDue: this.totalDueAmountOnListBill()}
      )
    );
  };
}

export default new HlpBillPdf() as HlpBillPdf;
