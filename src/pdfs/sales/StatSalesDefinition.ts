import { StatSaleProduct } from "../../core/stats/interfaces/StatSaleProduct";
import { ClientHeader } from "../shared/ClientHeader";
import { InfoTable } from "../shared/InfoTable";

export class StatSaleDefinition {
  static statSaled(tob: any, pdfTables: any) {
    const client = tob.user;
    const totalQtityOdr = +tob.stats.reduce((prev, curr: StatSaleProduct) => {
      return +prev + +curr.sumQtityOdr;
    }, 0);
    const totalQtityDlvr = +tob.stats.reduce((prev, curr: StatSaleProduct) => +prev + +curr.sumQtityDlvr, 0);
    const totalQtityFree = +tob.stats.reduce((prev, curr: StatSaleProduct) => +prev + +curr.sumQtityFree, 0);
    const totalQtity = totalQtityOdr + totalQtityFree;
    const nbProducts = tob.stats.length;
    // const oWidth = [ '*', '*', 75, 75, 75, 75, 75];
    const oWidth = ["*", "*", "*", "*", "*", "*"];

    const cpaHeader = ClientHeader.generic(client, tob.title);

    const infoAmount = InfoTable.infoStatSaledAmount(tob.stats);

    return {
      pageOrientation: "portrait",
      // alignment: 'justify',
      pageSize: "A4",
      pageMargins: [20, 150, 20, 100],

      header: [cpaHeader],

      content: [
        // ------ sale info ------
        {
          width: "50%",
          table: {
            headerRows: 1,

            widths: oWidth,
            heights: [8],
            body: [
              [
                { text: "COMMANDES", style: "headerText" },
                { text: "NBRE DE PDTS", style: "headerText" },
                { text: "QUANTITE TOTALE", style: "headerText" },
                { text: "QUANTITE CDEE", style: "headerText" },
                { text: "QUANTITE LIVREE", style: "headerText" },
                { text: "QUANTITE UG", style: "headerText" },
                //  {text: 'MONTANT', style: 'headerText'}
              ],
              [
                { text: tob.nbSales, style: "rowText", alignment: "center" },
                { text: nbProducts, style: "rowText", alignment: "center" },
                { text: totalQtity, style: "rowText", alignment: "center" },
                { text: totalQtityOdr, style: "rowText", alignment: "center" },
                { text: totalQtityDlvr, style: "rowText", alignment: "center" },
                { text: totalQtityFree, style: "rowText", alignment: "center" },
                // { text: nbFreeze, style: 'rowText'},
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
      ],

      footer: [],

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
