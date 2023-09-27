import { currencyFormatterCfa } from "asv-hlps/lib/cjs/utils";
import { StatSaleProduct } from "../../core/stats/interfaces/StatSaleProduct";

export class InfoTable {
  static infoStatSaledAmount(tobs: any) {
    // console.log(tob);
    const totalAmountQtityOdr = +tobs.reduce((prev, curr: StatSaleProduct) => {
      return +prev + (+curr.sumAmountQtityOdr || 0);
    }, 0);
    const totalAmountQtityDlvr = +tobs.reduce((prev, curr: StatSaleProduct) => {
      return +prev + (+curr.sumAmountQtityDlvr || 0);
    }, 0);
    const totalAmountQtityOdrCfa = currencyFormatterCfa(totalAmountQtityOdr);
    const totalAmountQtityDlvrCfa = currencyFormatterCfa(totalAmountQtityDlvr);
    const tabFooter = {
      width: "50%",
      table: {
        headerRows: 1,

        // widths: [ 100, 100, 100, 100 ],
        widths: ["*", "*"],
        heights: [6],
        body: [
          [
            // {text: 'TOTAL HT', style: 'headerText'},
            // {text: 'PORT HT', style: 'headerText'},
            { text: "MONTANT TOTAL COMMANDES ", style: "headerText" },
            { text: "MONTANT TOTAL COMMANDES LIVREES", style: "headerText" },
            // {text: 'TOTAL TTC', style: 'headerText'},
            // {text: 'NET A PAYER', style: 'headerText'}
          ],
          [
            { text: totalAmountQtityOdrCfa, style: "rowText", alignment: "center" },
            // { text: totalPort, style: 'rowText', alignment: 'center' },
            { text: totalAmountQtityDlvrCfa, style: "rowText", alignment: "center" },
            // { text: 'totalAmountAllIncluded', style: 'rowText', alignment: 'center' },
            // { text: 'totalAmountAllIncluded' , style: 'rowText', alignment: 'center' },
          ],
        ],
      },
    };

    return tabFooter;
  }
}
