import { Bill, getTotalAmountAllIncludedOnBill, infoAmountOnBill, infoBill } from "asv-hlps";

import { TplHeader } from "../../../../../pdfs/shared/TplHeader";
import { ConvertTo } from "../../../../../shared/helpers/ConvertTo";
import { InvoiceFooter } from "../InvoiceFooter";

export class InvoiceSalesDefinitionLetter {
  static invoice(tob: Bill, pdfTables: any) {
    const infoAmount = infoAmountOnBill(tob);
    const infoTop = infoBill(tob);
    const header = TplHeader.genericInvoice(tob.client, tob);
    const toLetter = new ConvertTo();
    // const nbrToLetter = toLetter.numberToLetter(HlpSale.getTotalAmountAllIncludedOnBill(tob.sales)).toUpperCase();
    const nbrToLetter = toLetter.numberToLetter(getTotalAmountAllIncludedOnBill(tob.sales)).toUpperCase();

    return {
      pageOrientation: "portrait",
      // alignment: 'justify',
      pageSize: "LETTER",
      pageMargins: [20, 150, 20, 100],

      header: [
        header,
        // CpaHeaders.generic()
        // cpaHeader
      ],

      content: [
        // ------ sale info ------
        infoTop,
        "\n",
        pdfTables,
        "\n\n",
        // ------ sum info ------
        infoAmount,
        // --------------------
        "\n\n",

        {
          text: [{ text: "Arrêter cette facture à la somme de " }, { text: nbrToLetter + " francs CFA.", bold: true }],
        },
      ],

      footer: [
        {
          // pageMargins: [40, 20, 40, 60],
          margin: [20, 40, 20, 0],
          columns: [
            // { canvas: [{ type: 'line', x1: 5, y1: 5, x2: 595 - 10, y2: 5, lineWidth: 0.2 }] },

            InvoiceFooter.generic(),
          ],
        },
      ],

      defaultStyle: {
        columnGap: 20,
      },
      styles: {
        textForm: {
          // fillColor: '#eaf2f5',
          margin: [0, 5, 0, 5],
          textTransform: "uppercase",
          border: [false, true, false, true],
        },
        headerText: {
          // fillColor: '#255',
          // color: '#eee',
          border: [true, true, false, true],
          textTransform: "uppercase",
          fontSize: 8,
          bold: true,
        },
        rowText: {
          // fillColor: '#255',
          // color: '#eee',
          // border: [true, true, false, true],
          textTransform: "uppercase",
          fontSize: 10,
          margin: [0, 0, 5, 0],

          // bold: true
        },
      },
    };
  }
}
