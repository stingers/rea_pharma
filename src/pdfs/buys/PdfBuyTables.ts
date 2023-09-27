import { BuyItem } from "asv-hlps";

export class PdfBuyTables {
  static buyTable(table: BuyItem[]) {
    return {
      table: {
        headerRows: 1,
        // widths: [ 'auto', '*', 'auto', 'auto', 'auto', 'auto', 'auto' ],
        widths: ["auto", 60, "*", "auto"],
        heights: [8],

        body: [
          [
            { text: "#", style: "headerText" },
            { text: "REF", style: "headerText" },
            { text: "DESIGNATION", style: "headerText" },
            { text: "QTE CDEE", style: "headerText" },
            // { text: 'MONTANT HT', style: 'headerText'},
            // { text: 'PP', style: 'headerText'},
          ],

          ...table.map((sp, i) => {
            // const

            return [
              { text: i + 1, style: "rowText" },
              //  sp.product.ref,
              { text: sp.product.ref, style: "rowText" },
              { text: sp.product.designation, style: "rowText" },
              { text: sp.qtityOdr, style: "rowText" },
              //  {text: sp.product.pghtPrice * sp.qtityOdr, style: 'rowText'},
              //  publicPrice,
              //  sp.lot

              /* sp.product.publicPrice,
                 sp.qtity, */
              //  (sp.qtity * sp.unitPrice)
            ];
          }),
        ],
      },
      layout: {
        fillColor: (rowIndex: number) => {
          return rowIndex % 2 === 1 ? "#EEEEEE" : "#FFF";
        },
      },
    };
  }
}
