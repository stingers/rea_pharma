import { BillPayment, Buy, currencyFormatterCfa } from "asv-hlps";
import dayjs from "dayjs";

import { HlpCash } from "../core/cashs/helpers/hlpCash";
import { CpaHeaders } from "./CpaHeaders";

export class CpaDefinition {
  static generic(title: string = "Eléments sélectionnés", pdfTables: any, pgOrientation: "portrait" | "landscape" = "portrait") {
    const cpaHeader = CpaHeaders.generic(title);

    return {
      pageOrientation: pgOrientation,
      pageSize: "A4",
      pageMargins: [20, 140, 20, 20],

      header: [cpaHeader],

      content: [
        // ------ sale info ------
        "\n",
        pdfTables,
        "\n",
      ],

      /* footer: [
        {

          // pageMargins: [40, 20, 40, 60],
          margin: [ 20, 0, 20, 0 ],
           columns: [
            // { canvas: [{ type: 'line', x1: 5, y1: 5, x2: 595 - 10, y2: 5, lineWidth: 0.2 }] },

            // InvoiceFooter.generic()
          ]
        }
      ], */

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
        headerTextBlank: {
          // fillColor: '#255',
          color: "#000",
          border: [true, true, false, true],
          textTransform: "uppercase",
          fontSize: 10,
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

  static incomes(title: string = "Eléments sélectionnés", pdfTables: any, tob: any, pgOrientation: string = "portrait") {
    // ------ all ------
    const total = currencyFormatterCfa(HlpCash.getTotalIncomes(tob));
    // ------ cash ------
    const totalCashs = currencyFormatterCfa(HlpCash.getTotalIncomesCashs(tob));
    // ------ checks ------
    const totalChecks = currencyFormatterCfa(HlpCash.getTotalIncomesChecks(tob));
    // ------ vrmnt ------
    const totalVirements = currencyFormatterCfa(HlpCash.getTotalIncomesVirements(tob));

    const cpaHeader = CpaHeaders.generic(title);

    return {
      pageOrientation: pgOrientation,
      pageSize: "A4",
      pageMargins: [20, 140, 20, 20],

      header: [cpaHeader],

      content: [
        "\n",
        // this.getAmounts,
        {
          width: "50%",
          table: {
            headerRows: 1,

            // widths: [ 100, 100, 100, 100 ],
            widths: ["*", "*", "*", "*"],
            heights: [6],
            body: [
              [
                { text: "TOTAL ESPECES", style: "rowText" },
                { text: "TOTAL CHEQUES", style: "rowText" },
                { text: "TOTAL VIREMENT", style: "rowText" },
                { text: "MONTANT TOTAL", style: "rowText" },
              ],
              [
                { text: totalCashs, style: "rowText", alignment: "center" },
                { text: totalChecks, style: "rowText", alignment: "center" },
                { text: totalVirements, style: "rowText", alignment: "center" },
                { text: total, style: "rowText", alignment: "center" },
              ],
            ],
          },
        },

        // ------ sale info ------
        "\n",
        pdfTables,
        "\n",

        // this.getAmounts
        {
          width: "50%",
          table: {
            headerRows: 1,

            // widths: [ 100, 100, 100, 100 ],
            widths: ["*", "*", "*", "*"],
            heights: [6],
            body: [
              [
                { text: "TOTAL ESPECES", style: "rowText" },
                { text: "TOTAL CHEQUES", style: "rowText" },
                { text: "TOTAL VIREMENT", style: "rowText" },
                { text: "MONTANT TOTAL", style: "rowText" },
              ],
              [
                { text: totalCashs, style: "rowText", alignment: "center" },
                { text: totalChecks, style: "rowText", alignment: "center" },
                { text: totalVirements, style: "rowText", alignment: "center" },
                { text: total, style: "rowText", alignment: "center" },
              ],
            ],
          },
        },
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
        headerText: {
          fillColor: "#255",
          color: "#eee",
          border: [true, true, false, true],
          textTransform: "uppercase",
          fontSize: 8,
          bold: true,
        },
        headerTextBlank: {
          // fillColor: '#255',
          color: "#000",
          border: [true, true, false, true],
          textTransform: "uppercase",
          fontSize: 10,
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

  static spending(title: string = "Eléments sélectionnés", pdfTables: any, tob: any, pgOrientation: string = "portrait") {
    // ------ all ------
    const total = currencyFormatterCfa(HlpCash.getTotalSpents(tob));

    const cpaHeader = CpaHeaders.generic(title);

    return {
      pageOrientation: pgOrientation,
      pageSize: "A4",
      pageMargins: [20, 140, 20, 20],

      header: [cpaHeader],

      content: [
        "\n",
        // this.getAmounts,
        {
          width: "50%",
          table: {
            headerRows: 1,

            // widths: [ 100, 100, 100, 100 ],
            widths: ["*", "*", "*", "*"],
            heights: [6],
            body: [[{ text: "MONTANT TOTAL", style: "rowText" }], [{ text: total, style: "rowText", alignment: "center" }]],
          },
        },

        // ------ sale info ------
        "\n",
        pdfTables,
        "\n",

        // this.getAmounts
        {
          width: "50%",
          table: {
            headerRows: 1,

            // widths: [ 100, 100, 100, 100 ],
            widths: ["*"],
            heights: [6],
            body: [[{ text: "MONTANT TOTAL", style: "rowText" }], [{ text: total, style: "rowText", alignment: "center" }]],
          },
        },
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
        headerText: {
          fillColor: "#255",
          color: "#eee",
          border: [true, true, false, true],
          textTransform: "uppercase",
          fontSize: 8,
          bold: true,
        },
        headerTextBlank: {
          // fillColor: '#255',
          color: "#000",
          border: [true, true, false, true],
          textTransform: "uppercase",
          fontSize: 10,
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

  static genericWithTitleArray(titles: string[], pdfTables: any, pgOrientation: string = "portrait") {
    // const hour = dayjs(new Date()).format('DD/MM/YYYY : HH:MM:SS');

    // const cpaHeader = CpaHeaders.generic(title + ' ' + hour);
    const cpaHeader = CpaHeaders.genericTitleArray(titles);

    return {
      pageOrientation: pgOrientation,
      pageSize: "A4",
      pageMargins: [20, 140, 20, 20],

      header: [cpaHeader],

      content: [
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

  static genericUgs(titles: string[], pdfTables: any, pgOrientation: string = "portrait") {
    // const hour = dayjs(new Date()).format('DD/MM/YYYY : HH:MM:SS');

    // const cpaHeader = CpaHeaders.generic(title + ' ' + hour);
    const cpaHeader = CpaHeaders.genericTitleArray(titles);

    return {
      pageOrientation: pgOrientation,
      pageSize: "A4",
      pageMargins: [20, 140, 20, 20],

      header: [cpaHeader],

      content: [
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

  static buy(title: string = "Eléments sélectionnés", tob: Buy, pdfTables: any, pgOrientation: string = "portrait") {
    // const nbProducts = tob.buyProducts.length;
    // const totalQtity = tob.totalQtity;
    // const hour = dayjs(new Date()).format('DD/MM/YYYY : HH:MM:SS');

    // const cpaHeader = CpaHeaders.generic(title + ' ' + hour);
    const cpaHeader = CpaHeaders.buy(title, tob);

    return {
      pageOrientation: pgOrientation,
      pageSize: "A4",
      pageMargins: [20, 140, 20, 20],

      header: [cpaHeader],

      content: [
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

  static listZone(tob: any, pdfTables: any) {
    const hour = dayjs(new Date()).format("DD/MM/YYYY : HH:MM:SS");

    const cpaHeader = CpaHeaders.generic("Bordereau de livraison du " + hour, tob);

    return {
      pageOrientation: "portrait",
      pageSize: "A4",
      pageMargins: [20, 150, 20, 70],

      header: [cpaHeader],

      content: [
        {
          width: "50%",
          table: {
            widths: ["*", "*", "*"],
            heights: [10],
            body: [
              [
                { text: [{ text: "Zone: " }, { text: tob.zone.name, bold: true }] },
                { text: ["Nbre de Ph: ", { text: tob.zone.nbr, bold: true }] },
                { text: "Chauffeur: " },
              ],
            ],
          },
        },
        {
          width: "50%",
          table: {
            widths: ["*", "*"],
            heights: [10],
            body: [
              [
                {
                  border: [true, false, true, true],
                  text: "Heure du départ: ",
                },
                {
                  border: [true, false, true, true],
                  text: "Heure du retour: ",
                },
              ],
            ],
          },
        },

        // ------ sale info ------
        "\n",
        pdfTables,
        "\n\n",
        // ------ sum info ------
        // infoAmount,
        // --------------------
        "\n\n",

        {
          width: "50%",
          table: {
            widths: ["*", "*"],
            heights: [10],
            body: [
              [
                {
                  text: ["Total colis: ", { text: tob.totalPackages, bold: true }],
                },
                {
                  text: ["Total froid: ", { text: tob.totalFreezes, bold: true }],
                },
              ],
            ],
          },
        },
      ],

      footer: [
        {
          // pageMargins: [40, 20, 40, 60],
          margin: [20, 40, 20, 0],
          columns: [
            // { canvas: [{ type: 'line', x1: 5, y1: 5, x2: 595 - 10, y2: 5, lineWidth: 0.2 }] },
            // InvoiceFooter.generic()
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

  static listDelivery(tob: any, pdfTables: any) {
    const hour = dayjs(new Date()).format("DD/MM/YYYY : HH:MM:SS");

    const cpaHeader = CpaHeaders.generic("Bordereau de livraison du " + hour, tob);

    return {
      pageOrientation: "portrait",
      pageSize: "A4",
      pageMargins: [20, 150, 20, 70],

      header: [cpaHeader],

      content: [
        {
          width: "50%",
          table: {
            widths: ["*", "*", "*"],
            heights: [10],
            body: [
              [
                { text: [{ text: "N°: " }, { text: tob.delivery.ref, bold: true }] },
                { text: ["Nbre de Ph: ", { text: tob.delivery.sales.length, bold: true }] },
                { text: ["Chauffeur: ", { text: tob.delivery.driver.fullname, bold: true }] },
              ],
            ],
          },
        },
        {
          width: "50%",
          table: {
            widths: ["*", "*"],
            heights: [10],
            body: [
              [
                {
                  border: [true, false, true, true],
                  text: "Heure du départ: ",
                },
                {
                  border: [true, false, true, true],
                  text: "Heure du retour: ",
                },
              ],
            ],
          },
        },

        // ------ sale info ------
        "\n",
        pdfTables,
        "\n\n",
        // ------ sum info ------
        // infoAmount,
        // --------------------
        "\n\n",

        {
          width: "50%",
          table: {
            widths: ["*", "*"],
            heights: [10],
            body: [
              [
                {
                  text: ["Total colis: ", { text: tob.totalPackages, bold: true }],
                },
                {
                  text: ["Total froid: ", { text: tob.totalFreezes, bold: true }],
                },
              ],
            ],
          },
        },
      ],

      footer: [
        {
          // pageMargins: [40, 20, 40, 60],
          margin: [20, 40, 20, 0],
          columns: [
            // { canvas: [{ type: 'line', x1: 5, y1: 5, x2: 595 - 10, y2: 5, lineWidth: 0.2 }] },
            // InvoiceFooter.generic()
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

  static getAmounts(tobs: BillPayment[]) {
    // ------ all ------
    const total = HlpCash.getTotalIncomes(tobs);

    /* const total = tob.reduce( (prev: string | number, curr: { paidAmount: string | number; }) => {
      return +prev + +curr.paidAmount
    }, 0) */
    // ------ cash ------
    /* const totalCashs = tob.filter((x: { method: { id: number; }; }) => x.method.id === 1).reduce( (prev: string | number, curr: { paidAmount: string | number; }) => {
        return +prev + +curr.paidAmount
    }, 0) */

    const totalCashs = HlpCash.getTotalIncomesCashs(tobs);

    // ------ checks ------
    /* const totalChecks = tob.filter((x: { method: { id: number; }; }) => x.method.id === 2).reduce( (prev: string | number, curr: { paidAmount: string | number; }) => {
      return +prev + +curr.paidAmount
    }, 0) */

    const totalChecks = HlpCash.getTotalIncomesChecks(tobs);

    // ------ vrmnt ------
    /* const totalVirements = tob.filter((x: { method: { id: number; }; }) => x.method.id === 3).reduce( (prev: string | number, curr: { paidAmount: string | number; }) => {
      return +prev + +curr.paidAmount
    }, 0) */

    const totalVirements = HlpCash.getTotalIncomesVirements(tobs);

    const amounts = [
      {
        width: "50%",
        table: {
          headerRows: 1,

          // widths: [ 100, 100, 100, 100 ],
          widths: ["*", "*", "*", "*"],
          heights: [6],
          body: [
            [
              { text: "TOTAL ESPECES", style: "rowText" },
              { text: "TOTAL CHEQUES", style: "rowText" },
              { text: "TOTAL VIREMENT", style: "rowText" },
              { text: "MONTANT TOTAL", style: "rowText" },
            ],
            [
              { text: totalCashs, style: "rowText", alignment: "center" },
              { text: totalChecks, style: "rowText", alignment: "center" },
              { text: totalVirements, style: "rowText", alignment: "center" },
              { text: total, style: "rowText", alignment: "center" },
            ],
          ],
        },
      },
    ];
    return amounts;
  }
}
