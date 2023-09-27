import { BillPayment, Sale, Spent, currencyFormatterCfa, titleCase } from "asv-hlps";
import dayjs from "dayjs";

import { HlpUserSignature } from "../core/users/helpers/hlpUserSignature";
import { ConvertTo } from "../shared/helpers/ConvertTo";
import { HlpLogo } from "../shared/helpers/hlpLogo";
import { TplHeader } from "./shared/TplHeader";

export class DocDefinition {
  // constructor(public authService: AuthService) {}

  static paymentReceipt(tob: BillPayment) {
    const client = tob.bill.client.ste
      ? tob.bill.client.ste.name + "  (" + tob.bill.client.username + ")"
      : tob.bill.client.fullname + "  (" + tob.bill.client.username + ")";
    // ------ get encoder signature ------
    const getSignature = HlpUserSignature.getSignature(tob.encoder);

    const cpaLogo = HlpLogo.cpaLogo();

    // ------ convert amount to letter ------
    const toLetter = new ConvertTo();
    //  const nbrToLetter = titleCase(toLetter.numberToLetter(tob.paidAmount));
    // const nbrToLetter = (toLetter.numberToLetter(tob.paidAmount) + ' francs CFA').toUpperCase();
    const nbrToLetter = (toLetter.numberToLetter(Math.abs(tob.paidAmount)) + " francs CFA").toUpperCase();
    // ------ payment method ------
    // const paymentMethod = (tob.method.id !== 1 /* cash, espèces */) ?  ' N°' + tob.checkNumber + ' emis par ' + tob.bank.name : '';
    // const paymentMethod = (tob.method.code === ('virement' || 'cheq') )? ' N°' + tob?.checkNumber + ' emis par ' + tob?.bank?.name : '';
    const paymentMethod =
      tob.method.code === "cheq" || tob.method.code === "virement" ? " N°" + tob?.checkNumber + " emis par " + tob?.bank?.name : "";
    const cheqDate =
      tob.method.code === "cheq" || tob.method.code === "virement" ? " Date d'émission: " + dayjs(tob.checkDate).format("DD/MM/YYYY") : "";
    // let getCheqDate = ''
    const methodName = titleCase(tob.method.name);

    /* if(tob.method.code.toUpperCase() === ('virement' || 'cheq')) {
        getPaymentMethod = ' N°' + tob?.checkNumber + ' emis par ' + tob?.bank?.name
        getCheqDate = ' Date d\'émission: ' + dayjs(tob.checkDate).format('DD/MM/YYYY')
    } else {
      getPaymentMethod = ' ';
    } */

    // --------------------
    // const cheqDate = (tob.method.id !== 1 && tob.checkDate /* cash, espèces */) ? ' Date d\'émission:' + dayjs(tob.checkDate).format('DD/MM/YYYY'): ''
    return {
      pageSize: "A5",
      pageOrientation: "landscape",
      alignment: "justify",
      pageMargins: [20, 120, 20, 0],
      header: [
        TplHeader.paymentReceipt(tob, tob.bill.store),
        /* {
          alignment: 'center',
          text: `B.P.F :` + Math.abs(tob.paidAmount)  + ' FCFA'
        } */
      ],

      content: [
        /* {
          alignment: 'justify',
          columns: [
            {

              image: cpaLogo,
              width: 40,
              height: 40,
              alignment: 'left',
              margin: 0,


            },
            {

              text: [
                'COMPAGNIE \n ',
                'PHARMACEUTIQUE \n ',
                'AFRICAINE \n',

              ],
              width: 'auto',
              alignment: 'left',
              fontSize: 12,
              bold: true,
              margin: [2, 0, 0, 0],

            },
            {
              alignment: 'center',
              text: `B.P.F :` + Math.abs(tob.paidAmount)  + ' FCFA'
            }

          ],
        },
        {
          columns: [
            {
              text: [
                {text: '01 BP 3701 514 AVENUE DES CALAIS\n', fontSize: 8},
                {text: 'Tél: (228) 22 22 27 71/ 22 22 34 74\n', fontSize: 8},
                {text: 'NIF: 10000175770 \n', bold: true, margin: [0, 0, 0, 2], fontSize: 8},
                // {text: 'fax: (228) 22 22 13 68 LOME - TOGO\n', fontSize: 8}

              ]

            },



          ]
        },
        '\n\n', */
        {
          alignment: "center",
          fontSize: 15,
          text: [{ text: `RECU: N°` + tob.ref }],
        },
        "\n",
        {
          text: [
            { text: "Client: ", fontSize: 10 },
            { text: client, bold: true, fontSize: 12 },
          ],
        },
        "\n",
        {
          text: [{ text: "Somme: " }, { text: nbrToLetter, bold: true }],
        },
        {
          text: [
            { text: "Règlement de la facture N°" },
            { text: tob.bill.ref + " du " + dayjs(tob.bill.createdAt).format("DD/MM/YYYY") + "\n", bold: true },
            { text: "Mode de paiement: " },

            { text: methodName, bold: true },
            { text: paymentMethod, bold: true },
            { text: cheqDate, bold: true },
          ],
        },
        {
          columns: [
            {
              text: ["Reste à Payer: ", { text: tob.bill.dueAmount + " FCFA", bold: true }],
            },

            {
              text: ["Nombre de tranches: ", { text: +tob.bill.nbrePayment, bold: true }],
            },
          ],
        },
        "\n",
        {
          alignment: "justify",
          fontSize: 12,
          columns: [
            {
              text: ["Lomé, le ", { text: dayjs(tob.paymentDate).format("DD/MM/YYYY"), bold: true }],
            },

            {
              text: `Signature`,
            },
          ],
        },
        "\n\n",
        {
          alignment: "justify",
          fontSize: 12,
          columns: [
            {
              /* text: [
                'Lomé, le ',
                { text:  dayjs(tob.paymentDate).format('DD/MM/YYYY'), bold: true}
              ] */
            },

            getSignature,
            /* {
              image: getSignature,
              width: 40,
              height: 40,
              alignment: 'right',
              margin: [0, 0, 100, 0],

            }, */
          ],
        },
      ],
    };
  }

  static spentReceipt(tob: Spent) {
    // const client = tob.bill.client.ste.grp.name + ' ' + tob.bill.client.ste.name + '  (' + tob.bill.client.username + ')';
    const toLetter = new ConvertTo();
    const nbrToLetter = (toLetter.numberToLetter(tob.amount) + " francs CFA").toUpperCase();
    const amountToNumber = currencyFormatterCfa(+tob.amount);
    // const amountToNumber = new Intl.NumberFormat('tg-TG', { style: 'currency', currency: 'XOF' }).format(+tob.amount);
    return {
      pageSize: "A5",
      pageOrientation: "landscape",
      alignment: "justify",
      content: [
        {
          //  alignment: 'justify',
          columns: [
            {
              image:
                "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABkCAMAAAAxBtftAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA7RpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wUmlnaHRzPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvcmlnaHRzLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcFJpZ2h0czpNYXJrZWQ9IkZhbHNlIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InV1aWQ6QTk3RDJFOEM4RkQzREYxMUE4MTY4RTM2RDU1NUVFRDAiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6ODNGNjk1MkZFQ0U5MTFFOEI2MTRBNTk5ODVCOTAwQ0UiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6ODNGNjk1MkVFQ0U5MTFFOEI2MTRBNTk5ODVCOTAwQ0UiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChNYWNpbnRvc2gpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6ZGE3M2VlNTktYWE3YS00NDU0LWIyZTUtOGU2MWFmODNkNzVlIiBzdFJlZjpkb2N1bWVudElEPSJ1dWlkOkE5N0QyRThDOEZEM0RGMTFBODE2OEUzNkQ1NTVFRUQwIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+GSpz2AAAAwBQTFRFSqFaz+bVY650QpIk9fn2uNrApMqn+Pn45/Hpvdq5lciiaLF4bLJ8+vz7RZ5WTKJcVZ0/WalpttWx8PfyrNS3SKBZkcWecLV/gr6RN4oKsNa6vt3G4/Dm7fTvwuDKu9zEp8miyOLOmcqlh7p8YqVS3e3hjsSa/Pv8l8SPRJ1UebJsxd3B0+jZi8OYe7qJR55YUKRh4u7kn8yqUqVj2uzfQpxS8vj0TaJggL2OU59JfLSHzuLL6/TtYaxvqdKzb61g+Pv5Z7B2c7aD0+XQfrVy0ebXh8GV4u3gV6hny+TSwt/JncqoeLmHS6BboMiX1ubSPplN8fjxPJhLpNCv3+7jstSv6fPrXKFIgbJ/XqtuTZg2pM6t2unY9vr3oMyrj8Sd1+vdzeTTd7iGosuq2eve3urbP5pPxuHM1enZ7/bx6vHp7PPsT6Nf1enbUqBPTp9ZyuPR7/bu7fTwRZ5VVqdm1urbX6xwlMehk8iftte+os6t7vXwTJcyfrSFicGWncup5u/jgrh3dLiE/vz9VKZk8vb0Po8b7PTqSqFbs9i8s9e81+jTcLN++fr6jb+Dr9S4aalYxOHL3+zdiryB4/Hn1+nb0ePOzuPTRp5VfbuMrdO3jMSZWKhq0efXcrWCfLRxw+DLfruNT6FbRqBYTaJe////+vr6/v7++/v7/f39//7/R59Y//3/Rp9XRp5WRJ1V/P38+/r7/f79/v3+//z//fz9Rp5X+vn6//7+RZ9W/Pv7/v/+//z+hb+T/Pz8//3++fr5+vv6zePTTqJf+/38TaJc/v//+/r6/fz89Pf1SaBZXKps+vr7/f7+ZqdV/vz+R51TSJ1R+fn5ude1+/v6SZYu/P395O/mSaBZOowUrM+lQJtQhbh6bLBwdbBn7vPqhMCTrtW5cbBtm8un2OfWoMum2ujV3OvgocuhUZo6TKNfnMWTT6Ngk8agmMaXRqBX6PHmUqNkqdO0s9Ktba1nTqNfRp1S7fbvbrR+TaBbdbGAhcCU1urc2Ond1+rc////VydMhgAAAQB0Uk5T////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AFP3ByUAAA0gSURBVHjazJgLWBTXFYAXBEUWZkBdQNEqKKyjQBBYSiIgi/GF+IRqSYIGig+iNjZL8IHxgYijeZjEPERBMZkzrDO7rIAKvlHUxI/EtGutQzFprWlafLSp6VZSremd17IPdjFov6+HHXZn7r3/nnvuOeeeu4of/mei+L9CX/BPvJeceA6eNNr/xQ1aHNO0m2InPzj+BNEXhsaR7VxlTrG2Uxt4ZG5m4pNCg9fkdiLQLyZY6+fXWREyOV/3VB48EfS5vCRS57fmw6VR76846x20nItZOHXuEHh8NISFd2Ka1g8ZxsAYDAzAOL/ZKeHFs7c9Njo3erJWx0YPY2he9OhiLgZrYu+UtVc9JnrgjJB8HbYWGsxm2ixeZiY7Xhe8X4cXPhbaP6fzJEYshGMIKqIbG81myCLiF+LG/fAYaEiKD6eM2oubzbSMNjc3mtUlrbqKQJJNfAx03uxVKSruLCCyjG5u5tUOX/yGktMU9B6dyylDjGzw4U9s0DT/xkzCOveyxNLeo+M0vvG4abugtNUgPF69rMyvlCWm9RqdaOqMYcn4cQZaj0RwPPHSH95S2ZnOEit7jfZuvzMVZ4M3653QTEFtpKei9+jjyvhojjKtgkY7g/DGhkFkEEkRYT8GDQcPAkjumssWn2QpbDiY7dDNtLlOrUzSchTh8ehomDjmSselryaM7t9/wMyRf1L4RdfiXB7jYBCahgztHiNFERGPjIYBg8eMHf/diO/637p1a+TOL3XBkRhO/gcMXxgYITkxBoQ+ZQCf6MjlOEVhhY+I3jrz7bYRBwGlNuEC2NCuXH+EOnLnmxdemvXB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",
              with: 20,
              height: 20,
              alignment: "left",
              //  margin: [0, 10],
              margin: [0, 5, 0, 15],
            },
            {
              //  alignment: 'center',
              fontSize: 18,
              text: "SORTIE DE CAISSE",
            },
          ],
        },
        "\n",
        {
          columns: [
            {
              fontSize: 12,
              alignment: "left",
              text: [
                "Montant : ",
                {
                  bold: true,
                  text: amountToNumber,
                },
              ],
            },
            {
              fontSize: 13,
              alignment: "right",
              text: `N°` + tob.ref,
            },
          ],
        },
        "\n",
        {
          columns: [
            {
              alignment: "center",
              text: `Date:` + dayjs(tob.spentDate).format("DD/MM/YYYY"),
            },
          ],
        },
        "\n",
        {
          // style: 'tableExample',
          table: {
            widths: ["*", 100],
            body: [
              ["TEXTE/MOTIF", "MONTANT"],
              [tob.description, amountToNumber],
            ],
          },
        },
        "\n",
        {
          text: [
            "Montant en lettres :",
            {
              text: nbrToLetter,
              bold: true,
              margin: [2, 0, 0, 0],
            },
          ],
        },
        "\n",
        {
          columns: [
            {
              text: "TOTAL ",
            },
            {
              text: amountToNumber,
            },
          ],
          alignment: "center",
        },
        "\n",
        {
          alignment: "justify",
          fontSize: 10,
          bold: true,
          //  margin: ['*', ],
          columns: [
            {
              text: `Comptabilité (Cachet) `,
            },
            {
              text: `Visa `,
            },
            {
              text: `Autorisé par `,
            },
            {
              text: `Reçu par `,
            },
          ],
        },
      ],
    };
  }

  static generic(title: string = "séléctions", pdfTables: any, pageOrientation: string = "portrait") {
    return {
      pageOrientation: pageOrientation,
      alignment: "justify",
      content: [
        {
          alignment: "justify",
          columns: [
            {
              text: `
              01 BP 3701 514 AVENUE DES CALAIS
              Tél: (228) 22 22 27 71/ 22 22 34 74
              fax: (228) 22 22 13 68 LOME - TOGO
              NIF: 10000175770
              `,
            },
            {
              // image: '/src/app/assets/img/cpa90x100.png'
              image:
                "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABkCAMAAAAxBtftAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA7RpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wUmlnaHRzPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvcmlnaHRzLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcFJpZ2h0czpNYXJrZWQ9IkZhbHNlIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InV1aWQ6QTk3RDJFOEM4RkQzREYxMUE4MTY4RTM2RDU1NUVFRDAiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6ODNGNjk1MkZFQ0U5MTFFOEI2MTRBNTk5ODVCOTAwQ0UiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6ODNGNjk1MkVFQ0U5MTFFOEI2MTRBNTk5ODVCOTAwQ0UiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChNYWNpbnRvc2gpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6ZGE3M2VlNTktYWE3YS00NDU0LWIyZTUtOGU2MWFmODNkNzVlIiBzdFJlZjpkb2N1bWVudElEPSJ1dWlkOkE5N0QyRThDOEZEM0RGMTFBODE2OEUzNkQ1NTVFRUQwIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+GSpz2AAAAwBQTFRFSqFaz+bVY650QpIk9fn2uNrApMqn+Pn45/Hpvdq5lciiaLF4bLJ8+vz7RZ5WTKJcVZ0/WalpttWx8PfyrNS3SKBZkcWecLV/gr6RN4oKsNa6vt3G4/Dm7fTvwuDKu9zEp8miyOLOmcqlh7p8YqVS3e3hjsSa/Pv8l8SPRJ1UebJsxd3B0+jZi8OYe7qJR55YUKRh4u7kn8yqUqVj2uzfQpxS8vj0TaJggL2OU59JfLSHzuLL6/TtYaxvqdKzb61g+Pv5Z7B2c7aD0+XQfrVy0ebXh8GV4u3gV6hny+TSwt/JncqoeLmHS6BboMiX1ubSPplN8fjxPJhLpNCv3+7jstSv6fPrXKFIgbJ/XqtuTZg2pM6t2unY9vr3oMyrj8Sd1+vdzeTTd7iGosuq2eve3urbP5pPxuHM1enZ7/bx6vHp7PPsT6Nf1enbUqBPTp9ZyuPR7/bu7fTwRZ5VVqdm1urbX6xwlMehk8iftte+os6t7vXwTJcyfrSFicGWncup5u/jgrh3dLiE/vz9VKZk8vb0Po8b7PTqSqFbs9i8s9e81+jTcLN++fr6jb+Dr9S4aalYxOHL3+zdiryB4/Hn1+nb0ePOzuPTRp5VfbuMrdO3jMSZWKhq0efXcrWCfLRxw+DLfruNT6FbRqBYTaJe////+vr6/v7++/v7/f39//7/R59Y//3/Rp9XRp5WRJ1V/P38+/r7/f79/v3+//z//fz9Rp5X+vn6//7+RZ9W/Pv7/v/+//z+hb+T/Pz8//3++fr5+vv6zePTTqJf+/38TaJc/v//+/r6/fz89Pf1SaBZXKps+vr7/f7+ZqdV/vz+R51TSJ1R+fn5ude1+/v6SZYu/P395O/mSaBZOowUrM+lQJtQhbh6bLBwdbBn7vPqhMCTrtW5cbBtm8un2OfWoMum2ujV3OvgocuhUZo6TKNfnMWTT6Ngk8agmMaXRqBX6PHmUqNkqdO0s9Ktba1nTqNfRp1S7fbvbrR+TaBbdbGAhcCU1urc2Ond1+rc////VydMhgAAAQB0Uk5T////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AFP3ByUAAA0gSURBVHjazJgLWBTXFYAXBEUWZkBdQNEqKKyjQBBYSiIgi/GF+IRqSYIGig+iNjZL8IHxgYijeZjEPERBMZkzrDO7rIAKvlHUxI/EtGutQzFprWlafLSp6VZSremd17IPdjFov6+HHXZn7r3/nnvuOeeeu4of/mei+L9CX/BPvJeceA6eNNr/xQ1aHNO0m2InPzj+BNEXhsaR7VxlTrG2Uxt4ZG5m4pNCg9fkdiLQLyZY6+fXWREyOV/3VB48EfS5vCRS57fmw6VR76846x20nItZOHXuEHh8NISFd2Ka1g8ZxsAYDAzAOL/ZKeHFs7c9Njo3erJWx0YPY2he9OhiLgZrYu+UtVc9JnrgjJB8HbYWGsxm2ixeZiY7Xhe8X4cXPhbaP6fzJEYshGMIKqIbG81myCLiF+LG/fAYaEiKD6eM2oubzbSMNjc3mtUlrbqKQJJNfAx03uxVKSruLCCyjG5u5tUOX/yGktMU9B6dyylDjGzw4U9s0DT/xkzCOveyxNLeo+M0vvG4abugtNUgPF69rMyvlCWm9RqdaOqMYcn4cQZaj0RwPPHSH95S2ZnOEit7jfZuvzMVZ4M3653QTEFtpKei9+jjyvhojjKtgkY7g/DGhkFkEEkRYT8GDQcPAkjumssWn2QpbDiY7dDNtLlOrUzSchTh8ehomDjmSselryaM7t9/wMyRf1L4RdfiXB7jYBCahgztHiNFERGPjIYBg8eMHf/diO/637p1a+TOL3XBkRhO/gcMXxgYITkxBoQ+ZQCf6MjlOEVhhY+I3jrz7bYRBwGlNuEC2NCuXH+EOnLnmxdemvXB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",
              with: 50,
              height: 50,
              alignment: "right",
              margin: [20, 20, 20, 20],
            },
          ],
        },
        {
          text: title,
          alignment: "center",
          fontSize: 20,
          margin: [0, 0, 0, 20],
        },
        pdfTables,
        // PdfTables.pdtTable(this.filteredProducts)
      ],
      styles: {
        cellText: {
          fontSize: 9,
        },
      },
    };
  }

  static saleProcess(sale: Sale) {
    return {
      pageOrientation: "portrait",
      alignment: "justify",
      content: [
        {
          alignment: "justify",
          columns: [
            {
              text: `
              01 BP 3701 514 AVENUE DES CALAIS
              Tél: (228) 22 22 27 71/ 22 22 34 74
              fax: (228) 22 22 13 68 LOME - TOGO
              NIF: 10000175770
              `,
            },
            {
              // image: '/src/app/assets/img/cpa90x100.png'
              image:
                "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABkCAMAAAAxBtftAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA7RpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wUmlnaHRzPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvcmlnaHRzLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcFJpZ2h0czpNYXJrZWQ9IkZhbHNlIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InV1aWQ6QTk3RDJFOEM4RkQzREYxMUE4MTY4RTM2RDU1NUVFRDAiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6ODNGNjk1MkZFQ0U5MTFFOEI2MTRBNTk5ODVCOTAwQ0UiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6ODNGNjk1MkVFQ0U5MTFFOEI2MTRBNTk5ODVCOTAwQ0UiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChNYWNpbnRvc2gpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6ZGE3M2VlNTktYWE3YS00NDU0LWIyZTUtOGU2MWFmODNkNzVlIiBzdFJlZjpkb2N1bWVudElEPSJ1dWlkOkE5N0QyRThDOEZEM0RGMTFBODE2OEUzNkQ1NTVFRUQwIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+GSpz2AAAAwBQTFRFSqFaz+bVY650QpIk9fn2uNrApMqn+Pn45/Hpvdq5lciiaLF4bLJ8+vz7RZ5WTKJcVZ0/WalpttWx8PfyrNS3SKBZkcWecLV/gr6RN4oKsNa6vt3G4/Dm7fTvwuDKu9zEp8miyOLOmcqlh7p8YqVS3e3hjsSa/Pv8l8SPRJ1UebJsxd3B0+jZi8OYe7qJR55YUKRh4u7kn8yqUqVj2uzfQpxS8vj0TaJggL2OU59JfLSHzuLL6/TtYaxvqdKzb61g+Pv5Z7B2c7aD0+XQfrVy0ebXh8GV4u3gV6hny+TSwt/JncqoeLmHS6BboMiX1ubSPplN8fjxPJhLpNCv3+7jstSv6fPrXKFIgbJ/XqtuTZg2pM6t2unY9vr3oMyrj8Sd1+vdzeTTd7iGosuq2eve3urbP5pPxuHM1enZ7/bx6vHp7PPsT6Nf1enbUqBPTp9ZyuPR7/bu7fTwRZ5VVqdm1urbX6xwlMehk8iftte+os6t7vXwTJcyfrSFicGWncup5u/jgrh3dLiE/vz9VKZk8vb0Po8b7PTqSqFbs9i8s9e81+jTcLN++fr6jb+Dr9S4aalYxOHL3+zdiryB4/Hn1+nb0ePOzuPTRp5VfbuMrdO3jMSZWKhq0efXcrWCfLRxw+DLfruNT6FbRqBYTaJe////+vr6/v7++/v7/f39//7/R59Y//3/Rp9XRp5WRJ1V/P38+/r7/f79/v3+//z//fz9Rp5X+vn6//7+RZ9W/Pv7/v/+//z+hb+T/Pz8//3++fr5+vv6zePTTqJf+/38TaJc/v//+/r6/fz89Pf1SaBZXKps+vr7/f7+ZqdV/vz+R51TSJ1R+fn5ude1+/v6SZYu/P395O/mSaBZOowUrM+lQJtQhbh6bLBwdbBn7vPqhMCTrtW5cbBtm8un2OfWoMum2ujV3OvgocuhUZo6TKNfnMWTT6Ngk8agmMaXRqBX6PHmUqNkqdO0s9Ktba1nTqNfRp1S7fbvbrR+TaBbdbGAhcCU1urc2Ond1+rc////VydMhgAAAQB0Uk5T////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AFP3ByUAAA0gSURBVHjazJgLWBTXFYAXBEUWZkBdQNEqKKyjQBBYSiIgi/GF+IRqSYIGig+iNjZL8IHxgYijeZjEPERBMZkzrDO7rIAKvlHUxI/EtGutQzFprWlafLSp6VZSremd17IPdjFov6+HHXZn7r3/nnvuOeeeu4of/mei+L9CX/BPvJeceA6eNNr/xQ1aHNO0m2InPzj+BNEXhsaR7VxlTrG2Uxt4ZG5m4pNCg9fkdiLQLyZY6+fXWREyOV/3VB48EfS5vCRS57fmw6VR76846x20nItZOHXuEHh8NISFd2Ka1g8ZxsAYDAzAOL/ZKeHFs7c9Njo3erJWx0YPY2he9OhiLgZrYu+UtVc9JnrgjJB8HbYWGsxm2ixeZiY7Xhe8X4cXPhbaP6fzJEYshGMIKqIbG81myCLiF+LG/fAYaEiKD6eM2oubzbSMNjc3mtUlrbqKQJJNfAx03uxVKSruLCCyjG5u5tUOX/yGktMU9B6dyylDjGzw4U9s0DT/xkzCOveyxNLeo+M0vvG4abugtNUgPF69rMyvlCWm9RqdaOqMYcn4cQZaj0RwPPHSH95S2ZnOEit7jfZuvzMVZ4M3653QTEFtpKei9+jjyvhojjKtgkY7g/DGhkFkEEkRYT8GDQcPAkjumssWn2QpbDiY7dDNtLlOrUzSchTh8ehomDjmSselryaM7t9/wMyRf1L4RdfiXB7jYBCahgztHiNFERGPjIYBg8eMHf/diO/637p1a+TOL3XBkRhO/gcMXxgYITkxBoQ+ZQCf6MjlOEVhhY+I3jrz7bYRBwGlNuEC2NCuXH+EOnLnmxdemvXB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",
              with: 50,
              height: 50,
              alignment: "right",
              margin: [20, 20, 20, 20],
            },
          ],
        },
        {
          text: "Bon de contrôle",
          alignment: "center",
          fontSize: 20,
          margin: [0, 0, 0, 20],
        },
        {
          style: "table",
          table: {
            headerRows: 1,
            widths: [15, "auto", "*", "10%"],

            body: [
              [
                { text: "#", bold: true },
                { text: "Ref", bold: true },
                { text: "Designation", bold: true },
                { text: "Quantité", bold: true },
                /* { text: 'PP', bold: true },
                { text: 'Stock', bold: true },
                { text: 'Categorie', bold: true },
                { text: 'Format', bold: true }, */
              ],

              ...sale.saleProducts.map((sp, i) => {
                return [i + 1, sp.product.ref, sp.product.designation, { text: sp.qtityDlvr, alignment: "center" }];
              }),
            ],
          },
          layout: {
            hLineStyle: function (i: number, node: { table: { body: string | any[] } }) {
              if (i === 0 || i === node.table.body.length) {
                return null;
              }
              return { dash: { length: 10, space: 4 } };
            },
            vLineStyle: function (i: number, node: { table: { widths: string | any[] } }) {
              if (i === 0 || i === node.table.widths.length) {
                return null;
              }
              return { dash: { length: 4 } };
            },
            fillColor: function (rowIndex: number) {
              return rowIndex % 2 === 0 ? "#EEEEEE" : "#FFF";
            },
          },
        },
      ],
      styles: {
        table: {
          // width: [100% ],
          // margin: 10,
          color: "#212529",
        },

        /* table td: {
          padding: 0.75rem,
          vertical-align: top,
          border-top: 1px solid #dee2e6,
        }, */
        /*
        table thead th {
          vertical-align: bottom;
          border-bottom: 2px solid #dee2e6;
        },

        table tbody + tbody {
          border-top: 2px solid #dee2e6; */
      },
    };
  }

  /* private static getSignature(user: User) {
    const signature = HlpUserSignature.getSignature(user)
    if(signature) {
      return {
        image: signature,
        width: 40,
        height: 40,
        alignment: 'right',
        margin: [0, 0, 100, 0],

      }
    }
    return ''

  } */
}
