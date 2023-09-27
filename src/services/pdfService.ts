import * as pdfMake from "pdfmake/build/pdfmake.min";
// import * as pdfFonts from "pdfmake/build/vfs_fonts";
// (pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
// pdfMake.vfs = pdfFonts && pdfFonts.pdfMake ? pdfFonts.pdfMake.vfs : globalThis.pdfMake.vfs;

class PdfService {
  pdfFonts = {
    // download default Roboto font from cdnjs.com
    Roboto: {
      normal: "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/fonts/Roboto/Roboto-Regular.ttf",
      bold: "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/fonts/Roboto/Roboto-Medium.ttf",
      italics: "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/fonts/Roboto/Roboto-Italic.ttf",
      bolditalics: "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/fonts/Roboto/Roboto-MediumItalic.ttf",
    },
  };
  generatePdf(action = "open", getDocDefinition: any, title: string = "cpa" + new Date().valueOf()) {
    // const docDefinition = this.getDocDefinition();
    const docDefinition = getDocDefinition;
    switch (action) {
      case "open":
        pdfMake.createPdf(docDefinition, null, this.pdfFonts).open();
        break;
      case "print":
        pdfMake.createPdf(docDefinition, null, this.pdfFonts).print();
        break;
      case "download":
        pdfMake.createPdf(docDefinition, null, this.pdfFonts).download(title.trim() + ".pdf");
        break;
      default:
        pdfMake.createPdf(docDefinition, null, this.pdfFonts).open();
        break;
    }
  }
}
/* class PdfService {
  constructor() {
    (pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
    // pdfMake.vfs = pdfFonts.pdfMake.vfs;
  }

  generatePdf(action = "open", getDocDefinition: any, title: string = "cpa" + new Date().valueOf()) {
    // const docDefinition = this.getDocDefinition();
    const docDefinition = getDocDefinition;
    switch (action) {
      case "open":
        pdfMake.createPdf(docDefinition).open();
        break;
      case "print":
        pdfMake.createPdf(docDefinition).print();
        break;
      case "download":
        pdfMake.createPdf(docDefinition).download(title.trim() + ".pdf");
        break;
      default:
        pdfMake.createPdf(docDefinition).open();
        break;
    }
  }
} */

export default new PdfService() as PdfService;
