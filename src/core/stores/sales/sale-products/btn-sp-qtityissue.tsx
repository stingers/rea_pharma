import { SaleProductQtityIssue } from "asv-hlps";
import { BtnAction, BtnType, Toastify } from "asv-hlps-react";
import { ModalBase, ModalConfirm } from "asv-hlps-react/lib/cjs/reacts/minton/modals";
import { useState } from "react";

import { PHD } from "../../../../auth/services/auth-menu";
import authService from "../../../../auth/services/authService";
import httpService from "../../../../services/httpService";
import AddSpQtityissueLot from "./add-sp-qtityissue-lot";

type TobType = {
  tob: SaleProductQtityIssue;
  // onSuccess: (TobId: number) => void;
  onSuccess: (tob: SaleProductQtityIssue) => void;
};

const BtnSpQtityIssue = ({ tob, onSuccess }: TobType) => {
  const [modal, setModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const btn = () => {
    if (tob.isTreat) {
      return ["traité", "success"];
    } else {
      return ["non traité", "danger"];
    }
  };
  const btns: BtnType[] = [{ id: 1, label: btn()[0], variant: btn()[1], size: "sm" }];

  const onTreat = () => {
    if (!tob.isTreat && authService.getAuth({ roles: [...PHD] })) {
      if (tob.saleProduct.lots.length) {
        // if (tob.saleProduct.lots) {
        setConfirmModal(true);
      } else {
        setModal(true);
      }
    }
  };

  const onBackToStock = async (prop) => {
    setConfirmModal(false);
    try {
      const data = prop === "yes" ? await treatSpqi(tob, true) : await treatSpqi(tob, false);
      if (data) {
        onSuccess(tob);
      } else {
        Toastify.error();
      }
    } catch (error) {
      Toastify.error();
    }
  };

  const onBackToStockWithLots = async (lots) => {
    try {
      const data = await treatSpqi(tob, null, lots);
      if (data) {
        onSuccess(tob);
      } else {
        Toastify.error();
      }
    } catch (error) {}
  };

  const treatSpqi = async (spqi: SaleProductQtityIssue, backToStock?: boolean, lots?: any) => {
    const spqiId = spqi.id;
    const sData = backToStock ? { spqiId, backToStock } : { spqiId, lots };
    try {
      const { data } = await httpService.postBody(sData, "spqtityissues/isTreat");
      return data;
    } catch (error) {}
  };

  return (
    <>
      <BtnAction tob={tob} btns={btns} onBtn={onTreat} />

      <ModalConfirm
        content={`Voulez-vous remettre </br>
            <b>
              ${tob.saleProduct.qtityOdr - (tob.saleProduct.qtityDlvr || 0)} ${tob.saleProduct.product.designation}
            </b>
            dans le stock ?`}
        show={confirmModal}
        onCloseModal={() => setConfirmModal(false)}
        onApprove={() => onBackToStock("yes")}
        approveVariant={"success"}
        cancelVariant={"danger"}
        cancelLabel={"non"}
        onCancel={() => onBackToStock("no")}
      />

      <ModalBase
        // size="lg"
        icon="fas fa-pen"
        title={tob.saleProduct.product.designation}
        show={modal}
        onCloseModal={() => setModal(false)}
        content={<AddSpQtityissueLot tob={tob} onSubmit={onBackToStockWithLots} />}
      />
    </>
  );
};

export default BtnSpQtityIssue;
