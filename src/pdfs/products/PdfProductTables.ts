import { currencyFormatterCfa, HlpProduct, Product, ProductIn, ProductInOut, ProductTransfert, SaleProductQtityIssue } from "asv-hlps";
import dayjs from "dayjs";

export class PdfProductTables {
  static productTable(table: Product[]) {
    return {
      table: {
        headerRows: 1,
        // widths: [ 15, 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto' ],
        widths: ["auto", "auto", "*", "auto", "auto", "auto", "auto", "auto", "auto"],

        body: [
          [
            { text: "#", bold: true },
            { text: "Ref", bold: true },
            { text: "Designation", bold: true },
            { text: "PU", bold: true },
            { text: "PP", bold: true },
            { text: "Stock", bold: true },
            { text: "Lots", bold: true },
            { text: "Categorie", bold: true },
            { text: "Format", bold: true },
          ],

          ...table.map((pdtIn, i) => {
            const designation = pdtIn.designation ? pdtIn.designation : "";
            const pvdPrice = pdtIn.stores[0].pvdPrice ? pdtIn.stores[0].pvdPrice : 0;
            const publicPrice = pdtIn.stores[0].publicPrice ? pdtIn.stores[0].publicPrice : 0;
            const stock = HlpProduct.getQtitiesInDepots(pdtIn.ins || []);
            const lots = this.getLotsToString(pdtIn.ins).join("\r\n");

            const catName = pdtIn.cat ? pdtIn.cat.name : "";
            const sofName = pdtIn.sof ? pdtIn.sof.name : "";

            return [i + 1, pdtIn.ref, designation, pvdPrice, publicPrice, stock, lots, catName, sofName];
          }),
        ],
      },
      layout: {
        fillColor: function (rowIndex: number) {
          return rowIndex % 2 === 0 ? "#EEEEEE" : "#FFF";
        },
      },
    };
  }

  static productWithAllColsTable(table: Product[]) {
    return {
      table: {
        headerRows: 1,
        // widths: [ 15, 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto' ],
        widths: ["auto", "auto", "*", "auto", "auto", "auto", "auto", "auto", "auto", "auto"],

        body: [
          [
            { text: "#", bold: true },
            { text: "Ref", bold: true },
            { text: "Designation", bold: true },
            { text: "PU", bold: true },
            { text: "PP", bold: true },
            { text: "Stock", bold: true },
            { text: "Categorie", bold: true },
            { text: "Format", bold: true },
            { text: "Agence", bold: true },
            { text: "Fournisseur", bold: true },
          ],

          ...table.map((pdt, i) => {
            const designation = pdt.designation ? pdt.designation : "";
            const pvdPrice = pdt.stores[0]?.pvdPrice ? pdt.stores[0]?.pvdPrice : 0;
            const publicPrice = pdt.publicPrice ? pdt.publicPrice : 0;
            const stock = pdt.stock ? pdt.stock : "";
            const catName = pdt.cat ? pdt.cat.name : "";
            const sofName = pdt.sof ? pdt.sof.name : "";
            const agcyName = pdt.agcy?.ste ? pdt.agcy?.ste?.name : "";
            const pvdName = pdt.pvd?.ste ? pdt.pvd?.ste?.name : "";
            return [i + 1, pdt.ref, designation, pvdPrice, publicPrice, stock, catName, sofName, agcyName, pvdName];
          }),
        ],
      },
      layout: {
        fillColor: function (rowIndex: number) {
          return rowIndex % 2 === 0 ? "#EEEEEE" : "#FFF";
        },
      },
    };
  }

  static productWantedTable(table: any[]) {
    return {
      table: {
        headerRows: 1,
        widths: ["auto", "auto", "*", 40, 50],

        body: [
          [
            { text: "#", bold: true },
            { text: "Ref", bold: true },
            { text: "Designation", bold: true },
            { text: "Nbre de fois ", bold: true },
            { text: "Qtes demandées", bold: true },
          ],

          ...table.map((tob, i) => {
            const qtities = tob.qtities > 0 ? tob.qtities : " --";
            return [i + 1, tob.ref, tob.designation, tob.nbr, qtities];
          }),
        ],
      },
      layout: {
        fillColor: function (rowIndex: number) {
          return rowIndex % 2 === 0 ? "#EEEEEE" : "#FFF";
        },
      },
    };
  }

  static listSpQtityIssuesTable(table: SaleProductQtityIssue[]) {
    // static  listSpQtityIssuesTable(table: any[]) {
    return {
      table: {
        headerRows: 1,
        widths: ["auto", 100, 70, "*", 20, 20, 20, 20, 50],

        body: [
          [
            { text: "#", bold: true },
            { text: "N° commande", bold: true },
            { text: "Date", bold: true },
            { text: "Designation ", bold: true },
            { text: "Q.C", bold: true },
            { text: "UG", bold: true },
            { text: "Q.T", bold: true },
            { text: "Q.D", bold: true },
            { text: "Etat", bold: true },
          ],

          ...table.map((tob, i) => {
            const status = !tob.isTreat ? "non traitée" : "traitée";
            const totalQtity = tob.saleProduct.qtityOdr + (tob.saleProduct.qtityFree || 0);
            return [
              i + 1,
              tob.saleProduct.sale.ref,
              dayjs(tob.createdAt).format("DD/MM/YYYY"),
              tob.saleProduct.product.designation,
              tob.saleProduct.qtityOdr,
              tob.saleProduct.qtityFree,
              totalQtity,
              tob.saleProduct.qtityFund,
              status,
            ];
          }),
        ],
      },
      layout: {
        fillColor: function (rowIndex: number) {
          return rowIndex % 2 === 0 ? "#EEEEEE" : "#FFF";
        },
      },
    };
  }

  static listStatSaleProductBackTable(table: { designation: string; name: string; nbr: number }[]) {
    // static  listSpQtityIssuesTable(table: any[]) {
    return {
      table: {
        headerRows: 1,
        widths: ["auto", "*", 100, 70],

        body: [
          [
            { text: "#", bold: true },
            { text: "Designation ", bold: true },
            { text: "Motif retour", bold: true },
            { text: "Nombre de fois", bold: true },
          ],

          ...table.map((tob, i) => {
            return [i + 1, tob.designation, tob.name, tob.nbr];
          }),
        ],
      },
      layout: {
        fillColor: function (rowIndex: number) {
          return rowIndex % 2 === 0 ? "#EEEEEE" : "#FFF";
        },
      },
    };
  }
  static productTransfertTable(table: ProductTransfert[]) {
    return {
      table: {
        headerRows: 1,
        widths: ["auto", "auto", "auto", "auto", 50, "auto", "auto", 50],

        body: [
          [
            { text: "#", bold: true },
            { text: "Ref", bold: true },
            { text: "Designation", bold: true },
            { text: "lot", bold: true },
            { text: "Quantité", bold: true },
            { text: "Depart", bold: true },
            { text: "Arrivé", bold: true },
            { text: "Quantité tranférée", bold: true },
            // { text: 'Categorie', bold: true },
            // { text: 'Format', bold: true },
          ],

          ...table.map((tob, i) => {
            const designation = tob.pdtIn.product.designation;
            const ref = tob.pdtIn.product.ref;
            const lot = tob.pdtIn.lot;
            const qtity = tob.qtity;
            const startDepot = tob.pdtIn.depot.name;
            const endDepot = tob.endDepot.name;
            return [
              i + 1,
              ref,
              designation,
              lot,
              qtity,
              startDepot,
              endDepot,
              { text: "" },
              // catName,
              // sofName
            ];
          }),
        ],
      },
      layout: {
        fillColor: function (rowIndex: number) {
          return rowIndex % 2 === 0 ? "#EEEEEE" : "#FFF";
        },
      },
    };
  }
  static productInventoryTable(table: Product[]) {
    return {
      table: {
        headerRows: 1,
        widths: ["auto", "*", 90, 55, 55, 55, 60, 60, 55],
        dontBreakRows: true,
        pageBreakBefore: true,
        heights: function (row: number) {
          return row > 0 ? 70 : "";
        },
        // heights: 70,

        body: [
          [
            { text: "#", bold: true },
            { text: "DESIGNATION", bold: true },
            { text: "LOTS", bold: true },
            { text: "FAB", bold: true },
            { text: "EXP", bold: true },
            { text: "QTE/CTN", bold: true },
            { text: "NBRE CTN", bold: true },
            { text: "NB UNITE", bold: true },
            { text: "QTE/LOT", bold: true },
          ],
          ...table.map((pdt, i) => {
            // const count = (pdt.designation) ? i + 1 : '';
            // const designation = (i + 3) ? pdt.designation : '';
            return [
              // [
              { text: i + 1 },
              { text: pdt.designation },
              {
                layout: {
                  fillColor: function (rowIndex: number) {
                    return rowIndex % 2 === 0 ? "#EEEEEE" : "#FFF";
                  },
                },
                table: {
                  widths: [479],
                  heights: 10,
                  // border: [false, false, false, true],
                  margin: [0, 0, 0, 0],
                  body: [
                    [{ text: " ", border: [false, false, false, true] }],
                    [{ text: " ", border: [false, true, false, true] }],
                    [{ text: " ", border: [false, true, false, true] }],
                    [{ text: " ", border: [false, true, false, false] }],
                  ],
                },
                // layout: 'noBorders'
                /* layouts: {
                      'noBorders': true,
                      'lightHorizontalLines': true
                    } */

                // layout: 'noBorders'
              },
              { text: " " },
              { text: " " },
              { text: " " },
              { text: " " },
              { text: " " },
              { text: " " },

              /*

                    ['', '', '', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', '', '', ''], */

              // ],
            ];
          }),
          /* ...table.map(
              (pdt, i) => {
                const count = (pdt.designation) ? i + 1 : '';
                const designation = (i + 3) ? pdt.designation : '';
                return [
                  // [
                    // { rowSpan: 4, text: count },
                    { rowSpan: 4, text: pdt.designation },
                    { text: ' ' },
                    { text: ' ' },
                    { text: ' ' },
                    { text: ' ' },
                    { text: ' ' },
                    { text: ' ' },
                    { text: ' ' },

                    ['', '', '', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', '', '', ''],

                  // ],




                ];
            }), */
        ],
      },
      layout: {
        fillColor: function (rowIndex: number) {
          return rowIndex % 2 === 0 ? "#EEEEEE" : "#FFF";
        },
      },
    };
  }

  static productInventoryWithLotTable(table: any[]) {
    return {
      table: {
        headerRows: 1,
        widths: ["auto", "*", 90, 55, 55, 55, 60, 60, 55],
        dontBreakRows: true,
        pageBreakBefore: true,
        /* heights: function (row: number) {
          return (row > 0) ? 70 : '';
        }, */
        // heights: 70,

        body: [
          [
            { text: "#", bold: true },
            { text: "DESIGNATION", bold: true },
            { text: "LOTS", bold: true },
            { text: "FAB", bold: true },
            { text: "EXP", bold: true },
            { text: "QTE/CTN", bold: true },
            { text: "NBRE CTN", bold: true },
            { text: "NB UNITE", bold: true },
            { text: "QTE/LOT", bold: true },
          ],
          ...table.map((pdt, i) => {
            // const count = (pdt.designation) ? i + 1 : '';
            // const designation = (i + 3) ? pdt.designation : '';
            return [
              // [
              { text: i + 1 },
              { text: pdt.designation },
              {
                layout: {
                  fillColor: function (rowIndex: number) {
                    return rowIndex % 2 === 0 ? "#EEEEEE" : "#FFF";
                  },
                },
                table: {
                  widths: [479],
                  heights: 10,
                  // border: [false, false, false, true],
                  margin: [0, 0, 0, 0],
                  body: [
                    ...pdt.lots.map((lot, i) => {
                      const iLot = lot ? lot : "";
                      return [{ text: iLot, border: [false, false, false, true] }];
                    }),
                    /* [{ text: ' ', border: [false, false, false, true] }],
                        [{ text: ' ', border: [false, true, false, true] }],
                        [{ text: ' ', border: [false, true, false, true] }],
                        [{ text: ' ', border: [false, true, false, false] }], */
                  ],
                },
                // layout: 'noBorders'
                /* layouts: {
                      'noBorders': true,
                      'lightHorizontalLines': true
                    } */

                // layout: 'noBorders'
              },
              // { text : ''},
              { text: " " },
              { text: " " },
              { text: " " },
              { text: " " },
              { text: " " },
              { text: " " },
            ];
          }),
        ],
      },
      layout: {
        fillColor: function (rowIndex: number) {
          return rowIndex % 2 === 0 ? "#EEEEEE" : "#FFF";
        },
      },
    };
  }

  static productInventoryWithLotTable2(data: any[]) {}

  static productLocTable(table: Product[]) {
    return {
      table: {
        headerRows: 1,
        widths: ["auto", "auto", "*", "auto", "auto" /* , 'auto', 'auto' */],
        heights: 8,

        body: [
          [
            { text: "#", bold: true },
            { text: "Ref", bold: true },
            { text: "Designation", bold: true },
            // { text: 'PU', bold: true },
            { text: "Emplacement", bold: true },
            // { text: 'PP', bold: true },
            { text: "Stock", bold: true },
            // { text: 'Categorie', bold: true },
            // { text: 'Format', bold: true },
          ],

          ...table.map((pdtIn, i) => {
            const designation = pdtIn.designation ? pdtIn.designation : "";
            // const pvdPrice = (pdtIn.pvdPrice) ?  pdtIn.pvdPrice : 0;
            // const publicPrice = (pdtIn.publicPrice) ?  pdtIn.publicPrice : 0;
            const loc = pdtIn.loc ? pdtIn.loc.name : "";
            const catName = pdtIn.cat ? pdtIn.cat.name : "";
            const sofName = pdtIn.sof ? pdtIn.sof.name : "";
            return [
              i + 1,
              pdtIn.ref,
              designation,
              loc,
              // pvdPrice,
              // publicPrice,
              { text: pdtIn.stock, alignment: "right" },
              // catName,
              // sofName
            ];
          }),
        ],
      },
      layout: {
        fillColor: function (rowIndex: number) {
          return rowIndex % 2 === 0 ? "#EEEEEE" : "#FFF";
        },
      },
    };
  }

  static productOutTable(table: ProductInOut[]) {
    return {
      table: {
        headerRows: 1,
        widths: ["auto", "*", "auto", "auto", "auto", "auto", "auto"],

        body: [
          [
            { text: "#", bold: true },
            // { text: 'Ref', bold: true },
            { text: "Designation", bold: true },
            { text: "Emplacement", bold: true },
            { text: "Lot", bold: true },
            { text: "Q.S.", bold: true },
            { text: "Raison", bold: true },
            { text: "Exp", bold: true },
            // { text: 'P.Pght', bold: true },
            // { text: 'Montant', bold: true },
            // { text: 'Montant', bold: true },
          ],

          ...table.map((pdtOut, i) => {
            const designation = pdtOut.product.designation ? pdtOut.product.designation : "";
            // const pghtPrice = (pdtOut.product) ?  pdtOut.product.pghtPrice : 0;
            const pghtPrice = pdtOut.product ? pdtOut.product.stores[0].pghtPrice : 0;

            const reason = pdtOut.reason ? pdtOut.reason.name : "aucune";
            const amount = pghtPrice * pdtOut.qtity || 0;
            const fabDate = pdtOut.manufDate ? dayjs(pdtOut.manufDate).format("MM/YYYY ") : "";
            const expDate = pdtOut.pdtIn?.expirationDate ? dayjs(pdtOut.pdtIn?.expirationDate).format("MM/YYYY ") : "";
            const lot = pdtOut.lot ? pdtOut.lot : "";
            const loc = pdtOut.product.loc ? pdtOut.product.loc?.name : "";
            // --------------------
            return [
              i + 1,
              designation,
              loc,
              lot,
              pdtOut.qtity,
              reason,
              expDate,
              // pghtPrice,
              // amount,
              // montant,
            ];
          }),
        ],
      },
      layout: {
        fillColor: function (rowIndex: number) {
          return rowIndex % 2 === 0 ? "#EEEEEE" : "#FFF";
        },

        hLineWidth: function (i: number, node: { table: { body: string | any[] } }) {
          return i === 0 || i === node.table.body.length ? 2 : 1;
        },
        vLineWidth: function (i: number, node: { table: { widths: string | any[] } }) {
          return i === 0 || i === node.table.widths.length ? 2 : 1;
        },
        hLineColor: function (i: number, node: { table: { body: string | any[] } }) {
          return i === 0 || i === node.table.body.length ? "gray" : "gray";
        },
        vLineColor: function (i: number, node: { table: { widths: string | any[] } }) {
          return i === 0 || i === node.table.widths.length ? "gray" : "gray";
        },
      },
    };
  }

  static productInTable(table: ProductIn[]) {
    return {
      table: {
        headerRows: 1,
        // widths: [ 15, 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto' ],
        widths: ["auto", "auto", "*", "auto", "auto", "auto", "auto", "auto", "auto", "auto"],
        // widths: [ 15, '16.6%', '16.6%', '16.6%', '16.6%', '16.6%', '16.6%', '16.6%' ],

        body: [
          [
            { text: "#", bold: true },
            { text: "Ref", bold: true },
            { text: "Designation", bold: true },
            { text: "Lot", bold: true },
            { text: "P.F", bold: true },
            { text: "Qte. E", bold: true },
            { text: "Qte. R.", bold: true },
            { text: "Rack.", bold: true },
            { text: "Fab", bold: true },
            { text: "Exp", bold: true },
            // { text: 'Montant', bold: true },
          ],

          ...table.map((pdtIn, i) => {
            const designation = pdtIn.product.designation ? pdtIn.product.designation : "";
            const pvdPrice = pdtIn.pvdPrice ? pdtIn.pvdPrice : 0;
            // const montant = pdtIn.pvdPrice ? pdtIn.pvdPrice * pdtIn.qtity : 0;
            const fabDate = pdtIn.manufDate ? dayjs(pdtIn.manufDate).format("MM/YYYY ") : "";
            const expDate = pdtIn.expirationDate ? dayjs(pdtIn.expirationDate).format("MM/YYYY ") : "";
            const lot = pdtIn.lot ? pdtIn.lot : "";
            const loc = pdtIn.product.loc ? pdtIn.product.loc?.name : "";
            return [
              i + 1,
              pdtIn.product.ref,
              designation,
              lot,
              pvdPrice,
              pdtIn.qtityIn,
              pdtIn.qtity,
              loc,
              fabDate,
              expDate,
              // montant,
            ];
          }),
        ],
      },
      layout: {
        fillColor: function (rowIndex: number) {
          return rowIndex % 2 === 0 ? "#EEEEEE" : "#FFF";
        },

        hLineWidth: function (i: number, node: { table: { body: string | any[] } }) {
          return i === 0 || i === node.table.body.length ? 2 : 1;
        },
        vLineWidth: function (i: number, node: { table: { widths: string | any[] } }) {
          return i === 0 || i === node.table.widths.length ? 2 : 1;
        },
        hLineColor: function (i: number, node: { table: { body: string | any[] } }) {
          return i === 0 || i === node.table.body.length ? "gray" : "gray";
        },
        vLineColor: function (i: number, node: { table: { widths: string | any[] } }) {
          return i === 0 || i === node.table.widths.length ? "gray" : "gray";
        },
      },
    };
  }

  // static  productStatByTable(table: Product[]) {
  static productStatByTable(table: any[]) {
    // const stock = HlpProduct.qtityInAllDepots(table.ins)
    return {
      table: {
        headerRows: 1,
        widths: ["auto", "auto", "*", "auto", "auto", "auto", "auto", "15%"],

        body: [
          [
            { text: "#", bold: true },
            { text: "Ref", bold: true },
            { text: "Designation", bold: true },
            { text: "Prix pght", bold: true },
            { text: "Stock", bold: true },
            { text: "Qte vendue", bold: true },
            { text: "Unités gratuites", bold: true },
            { text: "Montant", bold: true, alignment: "center" },
          ],

          ...table.map((pdt, i) => {
            const stock = HlpProduct.qtityInAllDepots(pdt.ins);
            const pghtPrice = pdt.stores[0].pghtPrice ? pdt.stores[0].pghtPrice : 0;
            const montant = pdt.stat.saledAmount ? currencyFormatterCfa(Math.ceil(pdt.stat.saledAmount)) : currencyFormatterCfa(0);
            const sumQtityDlvr = pdt.stat.qtityDlvr ? pdt.stat.qtityDlvr : 0;
            const sumQtityFree = pdt.stat.qtityFree ? pdt.stat.qtityFree : 0;
            return [i + 1, pdt.ref, pdt.designation, pghtPrice, stock, sumQtityDlvr, sumQtityFree, { text: montant, alignment: "right" }];
          }),
        ],
      },
      layout: {
        fillColor: function (rowIndex: number) {
          return rowIndex % 2 === 0 ? "#EEEEEE" : "#FFF";
        },

        hLineWidth: function (i: number, node: { table: { body: string | any[] } }) {
          return i === 0 || i === node.table.body.length ? 2 : 1;
        },
        vLineWidth: function (i: number, node: { table: { widths: string | any[] } }) {
          return i === 0 || i === node.table.widths.length ? 2 : 1;
        },
        hLineColor: function (i: number, node: { table: { body: string | any[] } }) {
          return i === 0 || i === node.table.body.length ? "gray" : "gray";
        },
        vLineColor: function (i: number, node: { table: { widths: string | any[] } }) {
          return i === 0 || i === node.table.widths.length ? "gray" : "gray";
        },
      },
    };
  }

  static productInOutDateTable(table: ProductIn[]) {
    return {
      table: {
        headerRows: 1,
        // widths: [ 15, 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto' ],
        widths: ["auto", "auto", "*", "auto", "auto", "auto", "auto", "auto", "auto"],
        // widths: [ 15, '16.6%', '16.6%', '16.6%', '16.6%', '16.6%', '16.6%', '16.6%' ],
        heigths: [9],

        body: [
          [
            { text: "#", bold: true },
            { text: "Ref", bold: true },
            { text: "Designation", bold: true },
            { text: "Lot", bold: true },
            { text: "Fab.", bold: true },
            { text: "Exp.", bold: true },
            { text: "Qtity", bold: true },
            { text: "Prix pght", bold: true },
            { text: "Montant estimé", bold: true },
          ],

          ...table.map((pdtIn, i) => {
            const designation = pdtIn.product.designation ? pdtIn.product.designation : "";
            const lot = pdtIn.lot ? pdtIn.lot : "Aucun";
            const fab = pdtIn.manufDate ? dayjs(pdtIn.manufDate).format("MM/YYYY") : "";
            const exp = pdtIn.expirationDate ? dayjs(pdtIn.expirationDate).format("MM/YYYY") : "";
            const qtity = pdtIn.qtity ? pdtIn.qtity : 0;
            const pghtPrice = pdtIn.product.pghtPrice ? pdtIn.product.pghtPrice : 0;
            // const totalAmount = pghtPrice * qtity ;
            const totalAmount = new Intl.NumberFormat("ci-CI", { style: "currency", currency: "XOF" }).format(+(pghtPrice * qtity));

            return [
              { text: i + 1, style: "cellText" },
              { text: pdtIn.product.ref, style: "cellText" },
              { text: designation, style: "cellText" },
              { text: lot, style: "cellText" },
              { text: fab, style: "cellText" },
              { text: exp, style: "cellText" },
              { text: qtity, style: "cellText" },
              { text: pghtPrice, style: "cellText" },
              { text: totalAmount, style: "cellText" },
            ];
          }),
        ],
      },
      layout: {
        fillColor: function (rowIndex: number) {
          return rowIndex % 2 === 0 ? "#EEEEEE" : "#FFF";
        },
      },
    };
  }
  static saleProductAgcy(table: any[]) {
    return {
      table: {
        headerRows: 1,
        widths: ["auto", "auto", "*", "auto", "auto", "auto", "auto", "auto"],
        heigths: [9],

        body: [
          [
            { text: "#", bold: true },
            { text: "Ref", bold: true },
            { text: "Designation", bold: true },
            { text: "Vendus", bold: true },
            { text: "Unités gratuites.", bold: true },
            { text: "Sortie Totale.", bold: true },
            { text: "Prix pght", bold: true },
            { text: "Montant estimé", bold: true },
          ],

          ...table.map((sp, i) => {
            const ref = sp.pdtRef;
            const designation = sp.pdtDesignation;
            const qtityDelivered = sp.sumQtityDelivered;
            const qtityFree = sp.sumQtityFree ? +sp.sumQtityFree : 0;
            const qtityTotal = qtityDelivered + +qtityFree;
            const pghtPrice = sp.pdtPghtPrice;
            // const totalAmount = pghtPrice * qtity ;
            // const totalAmount = new Intl.NumberFormat('ci-CI', { style: 'currency', currency: 'XOF' }).format(+(pghtPrice * qtityTotal) );
            const totalAmount = +sp.sumAmount + " CFA";

            return [
              { text: i + 1, style: "cellText" },
              { text: ref, style: "cellText" },
              { text: designation, style: "cellText" },
              { text: qtityDelivered, style: "cellText" },
              { text: qtityFree, style: "cellText" },
              { text: qtityTotal, style: "cellText" },
              { text: pghtPrice, style: "cellText" },
              { text: totalAmount, style: "cellText" },
            ];
          }),
        ],
      },
      layout: {
        fillColor: function (rowIndex: number) {
          return rowIndex % 2 === 0 ? "#EEEEEE" : "#FFF";
        },
      },
    };
  }

  static getLotsToString(ins: ProductIn[]) {
    // let lots: {lot: string, expDate: string}[] = []
    let lots: string[] = [];
    for (const pdtIn of ins) {
      if (pdtIn.lot) {
        lots.push(pdtIn.lot + " =>" + dayjs(pdtIn.expirationDate).format("DD/MM/YYYY"));
      }
    }
    return [...new Set(lots)];
  }

  /* static getProductsOn(pdt: { designation: any; }) {
    const tabPro = [
      { rowSpan: 4, text: pdt.designation },
      { text: ' ' },
      { text: ' ' },
      { text: ' ' },
      { text: ' ' },
      { text: ' ' },
      { text: ' ' },
      { text: ' ' },

      ['', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', ''],
    ];
    return tabPro;
  } */
}
