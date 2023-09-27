import { PdfComptaTables } from "../../../pdfs/comptas/PdfComptaTables";
import { CpaDefinition } from "../../../pdfs/CpaDefinition";
import pdfService from "../../../services/pdfService";

class HlpPdfEntry {
  genListEntries(action: string, tobs: any[], dates?) {
    pdfService.generatePdf(
      action,
      CpaDefinition.generic("Journal du " + dates.fromDate + " au " + dates.toDate, PdfComptaTables.dailyTable(tobs))
    );
  }

  genListBalance = (action: string, tobs: any[], dates?) => {
    pdfService.generatePdf(
      action,
      CpaDefinition.generic("Balance " + " du " + dates.fromDate + " au " + dates.toDate, PdfComptaTables.balanceTable(tobs))
    );
  };

  genListBigBook = (action: string, tobs: any[], dates?) => {
    pdfService.generatePdf(
      action,
      CpaDefinition.generic(
        "Grand livre " + " du " + dates.fromDate + " au " + dates.toDate,
        PdfComptaTables.bigBookTable(tobs),
        "landscape"
      )
    );
  };
}

export default new HlpPdfEntry() as HlpPdfEntry;
