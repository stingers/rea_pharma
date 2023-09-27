import dayjs from "dayjs";
import { CpaHeaders } from "./CpaHeaders";
import { currencyFormatterCfa } from "asv-hlps/lib/cjs/utils";

export class CpaStatDefinition {
  static generic(
    title: string = "Eléments sélectionnés",
    pdfTables: any,
    obj?: { totalAmount: number; nbProducts: number; nbTotalSaled: number },
    pgOrientation: string = "portrait"
  ) {
    const hour = dayjs(new Date()).format("DD/MM/YYYY : HH:MM:SS");

    const cpaHeader = CpaHeaders.generic(title + " " + hour);
    const totalAmount = currencyFormatterCfa(Math.ceil(obj.totalAmount));

    return {
      pageOrientation: pgOrientation,
      pageSize: "A4",
      pageMargins: [20, 140, 20, 20],

      header: [cpaHeader],

      content: [
        {
          width: "50%",
          layout: "noBorders",
          table: {
            headerRows: 1,

            heights: [15],
            widths: ["*", "*", "*"],

            body: [
              [
                { text: "NOMBRE DE PRODUITS", bold: true },
                { text: "VENTES", bold: true },
                { text: "MONTANT TOTAL ESTIME", bold: true },
              ],
              [
                { text: obj.nbProducts, style: "rowText" },
                { text: obj.nbTotalSaled, style: "rowText" },
                { text: totalAmount, style: "rowText" },
              ],
            ],
          },
        },

        // ------ sale info ------
        "\n",
        pdfTables,
        "\n",
      ],

      footer: [
        {
          // pageMargins: [40, 20, 40, 60],
          // margin: [ 20, 0, 20, 0 ],
          /* columns: [
            // { canvas: [{ type: 'line', x1: 5, y1: 5, x2: 595 - 10, y2: 5, lineWidth: 0.2 }] },

            // InvoiceFooter.generic()
          ] */
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

        rowText: {
          textTransform: "uppercase",
          fontSize: 15,
          bold: true,
          margin: [0, 0, 5, 0],

          // bold: true
        },
      },
    };
  }
}
