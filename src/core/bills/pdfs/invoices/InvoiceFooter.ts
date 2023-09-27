
export class InvoiceFooter {
  static generic () {

    // --------------------
    const cpaFooter = [

      {
        text: [
          {text: 'Domiciliation bancaire : ', alignment: 'left', decoration: 'underline'},
          'Orabank: TG0014 00216010000 88 - ',
          'UTB: TG009 01032 42515100400 62 - ',
          'Orabank: TG11601001030311892001 28 - \n',
          'Coris Bank: TG 182 01001 000075724101 12 - ',
          'NSIA Banque: TG 016 01001030311182001 28'
        ],
        color: '#333333',
        width: 'auto',
        fontSize: 8,
        bold: true,
        alignment: 'justify',
      },
      {

      }


    ];

    return cpaFooter;
  }
}
