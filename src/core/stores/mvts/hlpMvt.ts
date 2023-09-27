import { dateFormatter, ProductMvt, ProductTransfert } from "asv-hlps";

import { DocDefinition } from "../../../pdfs/DocDefinition";
import { PdfProductTables } from "../../../pdfs/products/PdfProductTables";
import httpService from "../../../services/httpService";
import pdfService from "../../../services/pdfService";

class HlpMvt {
  validedTransfert = (mvtId: number, tsfManId: number) => {
    return httpService.postBody({ mvtId, tsfManId }, "productmvts/transfertvalidation");
  };

  genPdfTransfert = (action, mvt: ProductMvt, tobs: ProductTransfert[]) => {
    return pdfService.generatePdf(
      action,
      DocDefinition.generic(
        "Mvt transfert N° " + mvt.ref + " du " + dateFormatter(new Date(mvt.createdAt)),
        PdfProductTables.productTransfertTable(tobs)
      )
    );
  };
}

export default new HlpMvt() as HlpMvt;
