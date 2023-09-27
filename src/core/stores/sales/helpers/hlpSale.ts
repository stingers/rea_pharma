import { Sale } from "asv-hlps/lib/cjs/models/entities/sales/Sale";
import { tabLabel } from "asv-hlps/lib/cjs/sale";
import { inSteGrp } from "asv-hlps/lib/cjs/user";

import { PdfSaleTables } from "../../../../pdfs/sales/PdfSaleTables";
import { SaleDefinition } from "../../../../pdfs/sales/SaleDefinition";
import httpService from "../../../../services/httpService";
import pdfService from "../../../../services/pdfService";
import { PdfBillTables } from "../../../bills/pdfs/PdfBillTables";
import { InvoiceDefinition } from "../../../bills/pdfs/invoices/InvoiceDefinition";
import { LabelDefinition } from "../../../bills/pdfs/invoices/LabelDefinition";
import { InvoiceDefinitionLetter } from "../../../bills/pdfs/invoices/Letters/InvoiceDefinitionLetter";

class HlpSale {
  genPdfInvoice(action, sale: Sale) {
    const invoice =
      sale.isBack || inSteGrp(["ph", "dp"], sale?.client)
        ? PdfBillTables.invoiceTablePhcie(sale.saleProducts)
        : PdfBillTables.invoiceTable(sale.saleProducts);

    this.increasePrint(sale.id);

    pdfService.generatePdf(action, InvoiceDefinition.invoice(sale, invoice));
  }

  genPdfDetailSaleForMag(action, sale: Sale) {
    pdfService.generatePdf(action, SaleDefinition.generic(sale, PdfSaleTables.detailSaleForMagTable(sale.saleProducts)));
  }

  genLabel(sale: Sale) {
    const labels = tabLabel(sale);
    pdfService.generatePdf("print", LabelDefinition.label(labels));
  }

  genBillBlPdf = (sale: Sale) => {
    const invoice = InvoiceDefinitionLetter.invoiceBl(sale.bill, PdfBillTables.invoiceBlTable(sale.saleProducts), sale);
    pdfService.generatePdf("print", invoice);
  };

  checkTreatment = (sale: Sale, treat: string) => {
    return httpService.postBody({ saleId: sale.id, treat }, "saletreatments");
  };

  private increasePrint = async (id: number) => {
    const { status } = await httpService.postId(id, "sales/increasePrint");
    if (status === 200) {
      return status;
    }
  };
}

export default new HlpSale() as HlpSale;
