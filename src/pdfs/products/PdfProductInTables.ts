
export class PdfProductInTables {




  static  productTable(table: any[]) {
    return {
      table: {
        headerRows: 1,
        // widths: [ 15, 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto' ],
        widths: [ 'auto', 'auto', '*', 'auto', 'auto' ],
        // widths: [ 15, '16.6%', '16.6%', '16.6%', '16.6%', '16.6%', '16.6%', '16.6%' ],

        body: [

          [
            { text: '#', bold: true },
            { text: 'Ref', bold: true },
            { text: 'Designation', bold: true },
            { text: 'Lot', bold: true },
            { text: 'Qte.', bold: true },
            // { text: 'Montant', bold: true },
          ],

          ...table.map(
            (pdtIn, i)  => {
              const designation = (pdtIn.designation) ?  pdtIn.designation : '';
              const lot = (pdtIn.lot) ?  pdtIn.lot : '';
              return [
                (i + 1),
                pdtIn.ref,
                designation,
                lot,
                pdtIn.qtity,
                // montant,
              ];
          }),
        ]
      },
      layout: {
        fillColor: function (rowIndex: number) {
          return (rowIndex % 2 === 0) ? '#EEEEEE' : '#FFF';
        },

        hLineWidth: function(i: number, node: { table: { body: string | any[]; }; }) {
          return (i === 0 || i === node.table.body.length) ? 2 : 1;
        },
        vLineWidth: function(i: number, node: { table: { widths: string | any[]; }; }) {
                return (i === 0 || i === node.table.widths.length) ? 2 : 1;
        },
        hLineColor: function(i: number, node: { table: { body: string | any[]; }; }) {
                return (i === 0 || i === node.table.body.length) ? 'gray' : 'gray';
        },
        vLineColor: function(i: number, node: { table: { widths: string | any[]; }; }) {
                return (i === 0 || i === node.table.widths.length) ? 'gray' : 'gray';
        },
      }

    };

  }



}



