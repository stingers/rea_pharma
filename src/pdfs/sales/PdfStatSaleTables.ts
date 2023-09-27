import { currencyFormatterCfa } from "asv-hlps/lib/cjs/utils";

export class PdfStatSaleTables {
  static statSaledTable(tobs: any[]) {
    return {
      table: {
        headerRows: 1,
        // widths: [ 'auto', '*', 'auto', 'auto', 'auto', 'auto', 'auto' ],
        widths: ["auto", "*", 45, "auto", "auto", "auto", "auto"],
        heights: [8],

        body: [
          [
            { text: "#", bold: true },
            { text: "Designation", bold: true },
            { text: "QT", bold: true, alignment: "center" },
            { text: "QC", bold: true, alignment: "center" },
            { text: "QD", bold: true, alignment: "center" },
            { text: "UG", bold: true, alignment: "center" },
            { text: "Montant", bold: true },
            // { text: 'Format', bold: true },
          ],

          ...tobs.map((sp, i) => {
            const totalQtity = (+sp.sumQtityOdr || 0) + (+sp.sumQtityFree || 0);
            return [
              { text: i + 1, style: "rowText" },
              { text: sp.product.designation, style: "rowText" },
              { text: totalQtity, style: "rowText", alignment: "right" },
              { text: sp.sumQtityOdr, style: "rowText", alignment: "right" },
              { text: sp.sumQtityDlvr, style: "rowText", alignment: "right" },
              { text: sp.sumQtityFree, style: "rowText", alignment: "right" },
              { text: currencyFormatterCfa(+sp.sumAmountQtityDlvr), style: "rowText", alignment: "right" },
            ];
          }),
        ],
      },
      layout: {
        fillColor: function (rowIndex: number) {
          return rowIndex % 2 === 1 ? "#EEEEEE" : "#FFF";
        },
      },
    };
  }
}
