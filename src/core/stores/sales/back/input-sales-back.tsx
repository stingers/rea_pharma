import { useQueryClient } from "@tanstack/react-query";
import { Sale } from "asv-hlps";
import { BtnDel, ModalBase, ModalConfirm, Toastify } from "asv-hlps-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import React, { useState } from "react";
import { Badge, Button, Card } from "react-bootstrap";

import httpService from "../../../../services/httpService";
import BtnSaleAction from "../btn-sale-action";
import DetailSale from "../detail-sale";
import { SaleBack } from "./SaleBack";
import TreatSaleBackForm from "./treat-sale-back-form";

interface TobType {
  salesBack: Sale[];
}

interface ProcessType {
  // sale: Sale;
  sale: SaleBack;
  treat: string;
}
// const relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);

const InputSalesBack = ({ salesBack }: TobType) => {
  const [tob, setTob] = useState<SaleBack>(null);
  // const [tob, setTob] = useState<Sale>(null);
  const [sale, setSale] = useState<Sale>(null);
  const [modal, setModal] = useState(false);
  const [modalSale, setModalSale] = useState(false);
  const [modalConfirm, setModalConfirm] = useState(false);

  const queryClient = useQueryClient();

  const handleDelete = (saleBack) => {
    httpService
      .postId(saleBack.id, "sales/del")
      .then(({ data }) => {
        queryClient.invalidateQueries(["salesBackNew"]);
        Toastify.success();
      })
      .catch((error) => {
        Toastify.error();
      });
  };

  const onValidSaleBack = (saleBack) => {
    setTob(saleBack);
    setModal(true);
  };

  const handleTreat = async (obj) => {
    setModal(false);
    if (obj) {
      if (obj.backChoice) {
        tob.isValided = true;
        tob.backChoice = obj.backChoice;
        tob.reason = obj.reason;
        /* if (+obj.backChoice === 2) {
          setModalConfirm(true);
        } */
      } else {
        tob.isRejected = true;
        tob.comment = obj.reason;
      }
      try {
        const { data } = await httpService.postBody(
          { saleBackId: tob.id, backChoice: obj.backChoice, reason: obj.reason },
          "salesback/treat"
        );

        if (+obj.backChoice === 2) {
          setModalConfirm(true);
        }

        // const nTobs = hlpCrud.updateTobOnList(data, tobs)

        Toastify.success();
      } catch (error) {}
    }
  };

  const onDetailSale = async (saleBack) => {
    try {
      const { data } = await httpService.getByParam(saleBack.ref.substring(3), "sales/ref");
      setSale(data);
      setModalSale(true);
    } catch (error) {}
  };

  const onBackProductToStock = async () => {
    try {
      const { data } = await httpService.postBody({ saleBackId: tob.id }, "salesback/backProductsToStock2");
      setModalConfirm(false);
      if (data) {
        Toastify.success();
      }
      return;
    } catch (error) {}
  };

  return (
    <>
      <Card>
        <div className="table-responsive">
          <table className="table table-hover mb-0 table-sm ">
            <tbody>
              {React.Children.toArray(
                (salesBack || []).map((saleBack, i) => (
                  <tr className="  shadow-2 mb-1 ">
                    <th scope="row">{i + 1} </th>
                    <th>
                      <BtnDel
                        tob={saleBack}
                        onDelete={(sale) => handleDelete(sale)}
                        title={`suppression de la commande N° ${saleBack.ref} `}
                      />
                    </th>
                    <th>
                      <BtnSaleAction sale={saleBack} authReportSale={false} menu={false}>
                        <Badge bg={saleBack.isValided ? "success" : "danger"} className="p-1">
                          {saleBack.ref.substring(0, 2)}
                        </Badge>
                        {/* <span> - {sale.ref.substring(3)}</span> */}
                      </BtnSaleAction>
                      {/* - <BtnSaleAction sale={sale}>{sale.ref.substring(3)}</BtnSaleAction> */}
                      <span className="cursor-pointer" onClick={() => onDetailSale(saleBack)}>
                        {"- " + saleBack?.ref.substring(3)}
                      </span>
                    </th>
                    <th>{saleBack.client.username}</th>
                    <th>{saleBack.client.ste.name}</th>
                    <th>{dayjs(saleBack.saleDate).fromNow(true)}</th>
                    <th>
                      {!saleBack.isDelivered ? (
                        <Button onClick={() => onValidSaleBack(saleBack)} variant="danger" className="text-uppercase btn-xs">
                          En Attente
                        </Button>
                      ) : (
                        <Button className="btn-xs" variant="success">
                          traite
                        </Button>
                      )}
                    </th>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
      <ModalBase
        icon="fas fa-pen"
        content={<TreatSaleBackForm tob={tob} onCancelForm={() => setModal(false)} onSubmitForm={handleTreat} />}
        onCloseModal={() => setModal(false)}
        show={modal}
        title={`commande retour ${tob?.ref}`}
      />
      <ModalBase
        size="lg"
        title={`commande N° ${sale?.ref} du ${dayjs(sale?.saleDate).format("DD/MM/YYYY : HH.mm")}`}
        show={modalSale}
        onCloseModal={() => setModalSale(false)}
        content={<DetailSale tob={sale} />}
      />
      <ModalConfirm
        content={"Voulez-vous mettre le product en stock ?"}
        show={modalConfirm}
        onCloseModal={() => setModalConfirm(false)}
        onApprove={onBackProductToStock}
        approveVariant={"success"}
        cancelLabel={"non"}
        cancelVariant={"danger"}
      />
    </>
  );
};

export default InputSalesBack;
