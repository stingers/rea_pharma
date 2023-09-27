import { ModalBase, ModalConfirm } from "asv-hlps-react";
import { Sale } from "asv-hlps/lib/cjs/models/entities/sales/Sale";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import React, { useState } from "react";
import { Card } from "react-bootstrap";

import { PdfSaleTables } from "../../../pdfs/sales/PdfSaleTables";
import { SaleDefinition } from "../../../pdfs/sales/SaleDefinition";
import httpService from "../../../services/httpService";
import pdfService from "../../../services/pdfService";
import AdditStrNbrSelect from "../../../shared/forms/addit-str-nbr-select";
import { Toastify } from "../../../shared/helpers/Toastify";
import hlpSale from "./helpers/hlpSale";
import saleService from "./helpers/saleService";
import InputSale from "./input-sale";
import ValidedSaleProduct from "./valided-sale-product";

interface TobType {
  sales: Sale[];
}

interface ProcessType {
  sale: Sale;
  treat: string;
}
dayjs.extend(relativeTime);

const InputSales = ({ sales }: TobType) => {
  const [clockModal, setClockModal] = useState(false);
  const [modalValidedSp, setModalValidedSp] = useState(false);
  const [modalConfirmDelivered, setModalConfirmDelivered] = useState(false);
  const [sale, setSale] = useState(null);
  const [treat, setTreat] = useState(null);

  const handleDelete = (sale) => {
    httpService
      .postId(sale.id, "sales/del")
      .then(({ data }) => {
        Toastify.success();
      })
      .catch((error) => {
        Toastify.error();
      });
  };

  const onClock = ({ str }) => {
    setClockModal(false);
    httpService
      .postBody({ saleId: sale.id, date: str }, "sales/newdate")
      .then(() => {
        Toastify.success();
      })
      .catch(() => {
        Toastify.error();
      });
  };

  const missingLot = (sale: Sale) => {
    // let countMissingLots = 0
    if (!sale.isPicking) {
      let hasMissinglot: boolean = false;
      for (const sp of sale.saleProducts) {
        if (!sp.lots?.length) {
          hasMissinglot = true;
        }
        return hasMissinglot;
      }
    }

    // return countMissingLots
  };

  const onSalePaid = (sale: Sale) => {
    return sale?.bill?.isPaid || sale?.bill?.isPartialPaid;
  };

  const onDelivered = async () => {
    // sale.isDelivered = true;
    sale.isDelivered = true;
    setModalConfirmDelivered(false);
    // const nSale = { ...sale, delivered: true };
    const nSale = { ...sale, [treat]: true };
    setSale(nSale);
    try {
      // const { data } = await saleService.checkTreatment(sale, "delivered");
      await saleService.checkTreatment(sale, treat);
      setSale(null);
      Toastify.success();
    } catch (error) {}
  };

  const onDelivering = async () => {
    sale.isDelivering = true;
    setModalConfirmDelivered(false);
    // const nSale = { ...sale, delivering: true };
    const nSale = { ...sale, [treat]: true };
    setSale(nSale);
    try {
      // const { data } = await saleService.checkTreatment(sale, "delivered");
      await saleService.checkTreatment(sale, treat);
      setSale(null);
      Toastify.success();
    } catch (error) {}
  };

  const onCancelSaleValided = (sale: Sale) => {
    setModalValidedSp(false);
    sale.isOnProcessed = false;
    saleService.mngIsOnProcessed(sale.id, sale.isOnProcessed);
  };

  const onSaleValided = async (sale: Sale) => {
    setModalValidedSp(false);
    // const nTobs = hlpCrud.updateTobOnList(sale, tobs)
    try {
      const { data } = await saleService.updateSaleValided(sale);
      if (data) {
        sale.isPicking = true;
        sale.isOnProcessed = true;
        saleService.checkTreatment(sale, treat);
      }
    } catch (error) {
      sale.isOnProcessed = false;
      saleService.mngIsOnProcessed(sale.id, sale.isOnProcessed);
    }
  };

  const getTreat = (treat: string, sale: Sale) => {
    if (treat === "delivered") {
      return (
        <div className="text-center">
          Veuillez confirmer la livraison de la commande <br />
          <span className="fw-bold">{sale?.ref} </span>
          pour la <span className="fw-bold">{sale?.client?.ste.name}</span>
        </div>
      );
    }
    if (treat === "delivering") {
      return (
        <>
          Veuillez confirmer l'enlèvement de la commande <br />
          <span className="fw-bold">{sale?.ref} </span>
          pour la <span className="fw-bold">{sale?.client?.ste.name}</span>
        </>
      );
    }
  };

  const onProcess = ({ sale, treat }: ProcessType) => {
    setTreat(treat);
    switch (treat) {
      case "processing":
        sale.isProcessing = true;
        hlpSale
          .checkTreatment(sale, treat)
          .then((res) => {
            sale = res.data;
            pdfService.generatePdf("print", SaleDefinition.generic(sale, PdfSaleTables.detailSaleForMagTable(sale.saleProducts)));
            Toastify.success();
          })
          .catch((error) => {
            sale.isProcessing = false;
            Toastify.error();
          });
        break;
      case "processed":
        sale.isProcessed = true;
        hlpSale
          .checkTreatment(sale, treat)
          .then(({ data }) => {
            sale = data;
            Toastify.success();
          })
          .catch((error) => {
            sale.isProcessed = false;
            Toastify.error();
          });
        break;
      case "picking":
        sale.isOnProcessed = true;
        //---- block or disblock processed ----
        saleService.mngIsOnProcessed(sale.id, sale.isOnProcessed);
        // sessionStorage.setItem("validedQtityDlr", JSON.stringify(sale));
        // --------------------
        setSale(sale);
        setModalValidedSp(true);
        break;
      case "delivering":
        setSale(sale);
        setModalConfirmDelivered(true);
        break;
      case "delivered":
        setSale(sale);
        setModalConfirmDelivered(true);
        break;
    }
  };

  return (
    <>
      <Card>
        {/* <div className="table-responsive"> */}
        <table className=" table table-hover mb-0 table-sm">
          <tbody>
            {React.Children.toArray(
              sales.map((sale, i) => (
                <InputSale
                  index={i}
                  sale={sale}
                  handleDelete={handleDelete}
                  missingLot={missingLot}
                  onSalePaid={onSalePaid}
                  onProcess={onProcess}
                  onClick={() => {
                    setClockModal(true);
                    setSale(sale);
                  }}
                />
              ))
            )}
          </tbody>
        </table>
        {/* </div> */}
      </Card>
      {/* // ------ modal ------ */}
      <ModalBase
        title={"modifier la date de la commande"}
        show={clockModal}
        onCloseModal={() => setClockModal(false)}
        content={
          <AdditStrNbrSelect
            label="date"
            type="date"
            schema="str"
            onCancelForm={() => {
              setClockModal(false);
              setSale(null);
            }}
            onSubmitForm={onClock}
          />
        }
      />
      {/* // ------ modal validedQtityDlr ------ */}
      <ModalBase
        title={sale?.ref}
        size="xl"
        show={modalValidedSp}
        onCloseModal={() => onCancelSaleValided(sale)}
        content={<ValidedSaleProduct sale={sale} onSaleValided={onSaleValided} onCancelForm={() => onCancelSaleValided(sale)} />}
      />

      {/* // ------ modal delivered ------ */}
      <ModalConfirm
        content={getTreat(treat, sale)}
        show={modalConfirmDelivered}
        onCloseModal={() => {
          setModalConfirmDelivered(false);
          setSale(null);
        }}
        onApprove={treat === "delivered" ? onDelivered : onDelivering}
      />
    </>
  );
};

export default InputSales;
