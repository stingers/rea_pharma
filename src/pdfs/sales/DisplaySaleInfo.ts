export class DisplaySaleInfo {

  static statSaled(tob: any) {

    const  tableTop = {
      width: '50%',
      table: {
        headerRows: 1,

        // widths: [ 125, 125, 125, '*' ],
        widths: [ '*', '*', 75, 75, 75, 75, 75],
        heights: [6],
        // widths: [ '16%', '16%', '16%', '16%' ],
        body: [
          [
            {text: 'NBRE ACHATS°', style: 'headerText'},
            { text: 'NBRE DE PDTS', style: 'headerText'},
             {text: 'QUANTITE TOTALE', style: 'headerText'},
             {text: 'QUANTITE COMMANDEE', style: 'headerText'},
             {text: 'QUANTITE LIVREE', style: 'headerText'},
             {text: 'QUANTITE UG', style: 'headerText'},
             {text: 'MONTANT', style: 'headerText'},
            ],
          [
            { text: tob.ref, style: 'rowText' },
            { text: tob.ref, style: 'rowText' },
            { text: tob.ref, style: 'rowText' },
            { text: tob.ref, style: 'rowText' },
            { text: tob.ref, style: 'rowText' },
            { text: tob.ref, style: 'rowText' },
            { text: tob.ref, style: 'rowText' },
            /* { text: nbProducts, style: 'rowText'},
            { text: totalQtity, style: 'rowText'},
            { text: nbColis, style: 'rowText'},
            { text: nbFreeze, style: 'rowText'}, */
          ]

        ]

      }
    };

    return tableTop;

  }


}
