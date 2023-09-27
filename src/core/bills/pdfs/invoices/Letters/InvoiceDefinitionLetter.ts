import { Bill, getNbProductsOnSale, getTotalAmountAllIncludedOnSale, getTotalQtityOnSale, inSteGrp, Sale, userGrpCode } from "asv-hlps";
import dayjs from "dayjs";

import { TplHeader } from "../../../../../pdfs/shared/TplHeader";
import { ConvertTo } from "../../../../../shared/helpers/ConvertTo";
import { InvoiceAmount } from "../InvoiceAmount";

export class InvoiceDefinitionLetter {
  static invoice(bill: Bill, pdfTables: any) {
    const client = bill.client;
    const sale = bill.sales[0];
    const totalQtity = getTotalQtityOnSale(sale, true);
    const nbProducts = getNbProductsOnSale(sale);
    const nbColis = sale.nbPackages ? sale.nbPackages : "---";
    const nbFreeze = sale.nbFreeze ? sale.nbFreeze : "---";
    const oWidth = ["*", "*", 75, 75, 75, 75];

    const header = TplHeader.genericInvoice(client, bill);

    let infoAmount;
    // if (HlpUser.userGrpCode(tob.client) === 'ph' && !tob.client.isBadPayer) {
    // if (UtilUser.inSteGrp( ['ph'], client) && client.periodBill !== 'day') {
    if (inSteGrp(["ph"], client) && client.periodBill !== "day") {
      infoAmount = InvoiceAmount.infoBl(sale);
    } else if (sale.isProforma) {
      infoAmount = InvoiceAmount.infoProforma(sale);
    } else {
      infoAmount = InvoiceAmount.info(sale);
    }

    const toLetter = new ConvertTo();
    const nbrToLetter = toLetter.numberToLetter(getTotalAmountAllIncludedOnSale(sale, true)).toUpperCase();

    return {
      pageOrientation: "portrait",
      // alignment: 'justify',
      pageSize: "LETTER",
      pageMargins: [20, 150, 20, 100],

      header: [header],

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
                { text: sale.ref, style: "rowText" },
                { text: dayjs(sale.saleDate).format("DD/MM/YYYY"), style: "rowText" },
                { text: nbProducts, style: "rowText" },
                { text: totalQtity, style: "rowText" },
                { text: nbColis, style: "rowText" },
                { text: nbFreeze, style: "rowText" },
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
            function (currentPage: { toString: () => string }, pageCount: string) {
              return currentPage.toString() + " of " + pageCount;
            },

            {
              text: [
                { text: "Domiciliation bancaire : ", alignment: "left", decoration: "underline" },
                "Orabank: TG0014 00216010000 88 - ",
                "UTB: TG009 01032 42515100400 62 - ",
                "Orabank: TG11601001030311892001 28 - \n",
                "Coris Bank: TG 182 01001 000075724101 12 - ",
                "NSIA Banque: TG 016 01001030311182001 28",
              ],
              color: "#333333",
              width: "auto",
              fontSize: 8,
              bold: true,
              alignment: "justify",
            },
            {},
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

  static invoiceBl(bill: Bill, pdfTables: any, sale?: Sale) {
    // const client = sale.client
    const client = bill?.client?.ste ? bill.client : sale.client;
    const tob = !sale ? bill.sales[0] : sale;
    const totalQtity = getTotalQtityOnSale(tob, true);
    const nbProducts = getNbProductsOnSale(tob);
    const nbColis = tob.nbPackages ? tob.nbPackages : "---";
    const nbFreeze = tob.nbFreeze ? tob.nbFreeze : "---";
    const oWidth = ["*", "*", 75, 75, 75, 75];

    // const cpaHeader = TplHeader.genericInvoiceBl(client, bill);
    // const cpaHeader = TplHeader.genericInvoiceBl(client);
    // const header = environment.host === 'cpa'? TplHeader.genericInvoiceBl(client, 'BORDEREAU DE LIVRAISON') : TplHeader.genericBlEqeer(client, 'BORDEREAU DE LIVRAISON');
    // const header = TplHeader.genericInvoiceBl(client, environment.host);
    const header = TplHeader.genericInvoiceBl(client, "cpa");

    let infoAmount;

    if (userGrpCode(client) === "ph" && !client.isBadPayer) {
      infoAmount = InvoiceAmount.infoBl(tob);
    } else if (tob.isProforma) {
      infoAmount = InvoiceAmount.infoProforma(tob);
    } else {
      infoAmount = InvoiceAmount.info(tob);
    }

    const toLetter = new ConvertTo();
    const nbrToLetter = toLetter.numberToLetter(getTotalAmountAllIncludedOnSale(tob, true)).toUpperCase();

    return {
      pageOrientation: "portrait",
      // alignment: 'justify',
      pageSize: "LETTER",
      pageMargins: [20, 150, 20, 100],

      header: [
        // CpaHeaders.genericBl(client, bill)
        header,
      ],

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
                { text: tob.ref, style: "rowText" },
                { text: dayjs(tob.saleDate).format("DD/MM/YYYY"), style: "rowText" },
                { text: nbProducts, style: "rowText" },
                { text: totalQtity, style: "rowText" },
                { text: nbColis, style: "rowText" },
                { text: nbFreeze, style: "rowText" },
              ],
            ],
          },
        },
        "\n",
        pdfTables,
        "\n\n",
        // ------ sum info ------
        // infoAmount,
        // --------------------
        "\n\n",
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
