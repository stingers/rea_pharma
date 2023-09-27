import { getTotalAmountAllIncludedOnSale, Sale, userGrpCode } from "asv-hlps";
import { TplHeader } from "../../../../pdfs/shared/TplHeader";
import { ConvertTo } from "../../../../shared/helpers/ConvertTo";
import { InvoiceAmount } from "./InvoiceAmount";
import { InvoiceFooter } from "./InvoiceFooter";
import { InvoiceInfo } from "./InvoiceInfo";

export class InvoiceSaleDefinition {
  static invoice(tob: Sale, pdfTables: any) {
    const oWidth = ["*", "*", 75, 75, 75, 75];

    const infoAmount = userGrpCode(tob.client) === "ph" ? InvoiceAmount.infoBl(tob) : InvoiceAmount.info(tob);
    const toLetter = new ConvertTo();
    const nbrToLetter = toLetter.numberToLetter(getTotalAmountAllIncludedOnSale(tob, true)).toUpperCase();

    return {
      pageOrientation: "portrait",
      pageSize: "A4",
      pageMargins: [20, 150, 20, 70],

      header: [TplHeader.genericInvoice(tob.client, tob.bill)],

      content: [
        // ------ sale info ------
        {
          width: "50%",
          table: {
            headerRows: 1,
            // widths: [ 125, 125, 125, '*' ],
            widths: oWidth,
            heights: [6],
            // widths: [ '16%', '16%', '16%', '16%' ],
            body: [
              [
                { text: "COMMANDE N°", style: "headerText" },
                { text: "DATE", style: "headerText" },
                { text: " NBRE DE PDTS", style: "headerText" },
                { text: "QUANTITE TOTALE", style: "headerText" },
                { text: "NBRE COLIS", style: "headerText" },
                { text: "NBRE FROID", style: "headerText" },
              ],
              [
                InvoiceInfo.sale(tob),
                /* { text: tob.ref, style: 'rowText' },
                { text: dayjs(tob.saleDate ).format('DD/MM/YYYY'), style: 'rowText'}, */
                /* { text: nbProducts, style: 'rowText'},
                { text: totalQtity, style: 'rowText'},
                { text: nbColis, style: 'rowText'},
                { text: nbFreeze, style: 'rowText'}, */
              ],
            ],
          },
        },
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
          fillColor: "#eaf2f5",
          margin: [0, 5, 0, 5],
          textTransform: "uppercase",
          border: [false, true, false, true],
        },
        headerText: {
          fillColor: "#255",
          color: "#eee",
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
