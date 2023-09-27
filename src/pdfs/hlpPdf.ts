import { HlpLogo } from "../shared/helpers/hlpLogo";
import { dateFormatter, getSteShortname, User } from "asv-hlps";

export class HlpPdf {
  static displayPdfDate(label: string, fromDate: any, toDate: any) {
    fromDate = !fromDate ? new Date() : fromDate;
    toDate = !toDate ? fromDate : toDate;
    return label + " du " + dateFormatter(fromDate) + " au " + dateFormatter(toDate);
  }

  static disPlayLogoCpa() {
    const cpaLogo = HlpLogo.cpaLogo();
    return {
      image: cpaLogo,
      width: 40,
      height: 40,
      alignment: "left",
      // margin: [20, 20, 20, 20]
    };
  }

  static disPlayLogoEqeer() {
    const cpaLogo = HlpLogo.eqeerLogo();
    return {
      image: cpaLogo,
      width: 135,
      height: 50,
      alignment: "left",
      // margin: [20, 20, 20, 20]
    };
  }

  static displayCpaName() {
    return {
      text: ["COMPAGNIE \n ", "PHARMACEUTIQUE \n ", "AFRICAINE \n"],
      width: "auto",
      alignment: "left",
      fontSize: 12,
      bold: true,
      margin: [-15, 0, 0, 0],
    };
  }

  static displayAddressCpa() {
    return {
      text: [
        { text: "01 BP 3701 514 AVENUE DES CALAIS\n", fontSize: 8 },
        { text: "Tél: (228) 22 22 27 71/ 22 22 34 74\n", fontSize: 8 },
        { text: "NIF: 1000175770 \n", bold: true, margin: [0, 0, 0, 2], fontSize: 8 },
        // {text: 'fax: (228) 22 22 13 68 LOME - TOGO\n', fontSize: 8}
        { text: "AUTORISATION N°33/97/MS/DGS/DPET \n", bold: true, fontSize: 10 /* margin: [20, 5, 0, 0]  */ },
      ],
    };
  }

  static displayAddressEqeer() {
    return {
      text: [
        { text: "160 RUE DES SABLIERS - 01 BP 3254 LOME TOGO\n", fontSize: 8 },
        { text: "Tél: (228) 22 21 41 60/ 22 21 42 82\n", fontSize: 8 },
        // {text: 'Fax: (228) 22 21 53 76 \n', fontSize: 8},
        { text: "NIF: 1000116280 \n", bold: true, margin: [0, 0, 0, 2], fontSize: 8 },
        { text: "AUTORISATION N°017/2019/MSHP/CAB/SG/DGAS/DPML/DP \n", bold: true, fontSize: 9 /* margin: [20, 5, 0, 0]  */ },
      ],
    };
  }

  static displayQr(qr: string) {
    return {
      qr: qr,
      alignment: "right",
      fit: "50",
    };
  }

  static displayRect() {
    // const rect =  {
    return {
      absolutePosition: { x: 300, y: 10 },
      canvas: [
        {
          type: "rect",
          x: 1,
          y: 10,
          w: 175,
          h: 75,
          r: 4,
          lineColor: "#ccc",
          // color: '#ccc'
        },
      ],
    };
    // return rect
  }

  static displayRef(tobRef: string) {
    return {
      width: "100%",
      alignment: "center",
      text: tobRef,
      bold: true,
      margin: [0, 10, 0, 10],
      fontSize: 15,
    };
  }

  static displayRefEqeer(tobRef: string) {
    return {
      width: "100%",
      alignment: "center",
      text: tobRef,
      bold: true,
      margin: [0, 15, 0, 10],
      fontSize: 15,
    };
  }

  static displayClient(user: User) {
    const clientSte = user.ste ? getSteShortname(user.ste, ["pharmacie", "clinique", "hopital"]) : "";
    /* const clientLastname = (user.lastname) ? user.lastname : '';
    const clientFirstname = (user.firstname) ? user.firstname : '';
    const clientGender = (user.gender) ? user.gender.abr : ''; */

    const clientName = user.ste ? clientSte : user.fullname;
    const cp = user.cp ? user.cp : "";
    const city = user.city ? user.city : "";
    const nif = user.ste.nif ? user.ste.nif : "";
    const address = user.address ? user.address : "";

    const client = {
      absolutePosition: { x: 310, y: 30 },
      text: [
        { text: "CLIENT: ", fontSize: 8 },
        { text: user.username + "\n", bold: true, fontSize: 10 },
        { text: clientName + "\n" },
        { text: address + " " },
        { text: cp + "\n" },
        { text: city + "\n" },
        // {text: nif + '\n'}
      ],
      color: "#000",
      width: "auto",
      fontSize: 12,
      bold: true,
      alignment: "left",
      // margin: [100, 0, 0, 0],
    };
    return client;
  }

  static displayTitle(title: string) {
    return {
      width: "100%",
      alignment: "center",
      text: title,
      bold: true,
      margin: [0, 10, 0, 10],
      fontSize: 15,
    };
  }

  static displayCpaHead() {
    const displayCpaHead = [
      {
        columns: [this.disPlayLogoCpa(), this.displayCpaName()],
      },

      this.displayAddressCpa(),
      this.displayQr("https://cpapharm.in"),
      {
        width: "100%",
        alignment: "center",
        text: "tobRef",
        // text: tobRef,
        bold: true,
        margin: [0, 10, 0, 10],
        fontSize: 15,
      },
      // ------ absolutePosition ------
      {
        absolutePosition: { x: 300, y: 10 },
        canvas: [
          {
            type: "rect",
            x: 1,
            y: 10,
            w: 175,
            h: 75,
            r: 4,
            lineColor: "#ccc",
            // color: '#ccc'
          },
        ],
      },
    ];
    return displayCpaHead;
  }
}
