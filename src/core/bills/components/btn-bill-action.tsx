import { Bill, UserCredit } from "asv-hlps";
import { BtnAction, DropMenuType, ModalBase, ModalConfirm } from "asv-hlps-react";
import DisplayTooltip from "asv-hlps-react/lib/cjs/reacts/displays/display-tooltip";
import { error } from "console";
import { useState } from "react";

import httpService from "../../../services/httpService";
import AdditStrNbrSelect from "../../../shared/forms/addit-str-nbr-select";
import { Toastify } from "../../../shared/helpers/Toastify";
import DetailBill from "../detail-bill";
import PrintBill from "./print-bill";
import authService from "../../../auth/services/authService";
import { COMPTA } from "../../../auth/services/auth-menu";

type TobProps = {
  bill: Bill;
  onDelete?: (tob) => void;
  onUpdateNbPrint?: (tob) => void;
  onGenEntry?: (tob) => void;
  auth?: boolean;
  genCreditAuth?: boolean;
  delBillAuth?: boolean;
  // ifPrint?: boolean;
  // print?:{ ifPrint: boolean, onUpdateNbPrint?: (tob) => void;};
};

const BtnBillAction = ({
  bill,
  onDelete,
  onUpdateNbPrint,
  onGenEntry,
  auth = true,
  genCreditAuth = true,
  delBillAuth = true,
}: TobProps) => {
  const [modal, setModal] = useState(false);
  const [creditModal, setCreditModal] = useState(false);
  const [del, setDel] = useState(false);
  // ------ menu drop actions ------
  const dropMenu: DropMenuType = {
    // ellipsis: "v",
    icon: "uil uil-ellipsis-v ",
    iconTooltip: "actions",
    drops: [
      {
        id: 1,
        label: "Credit sur facture",
        icon: "fas fa-birthday-cake",
        auth: genCreditAuth,
      },
      { id: 2, label: "supprimer", icon: "fas fa-trash", auth: delBillAuth },
    ],
  };

  const handleDrop = (prop) => {
    switch (prop.id) {
      case 1:
        setCreditModal(true);
        break;
      case 2:
        setDel(true);
        break;
    }
  };
  // --------------------
  const handleApprove = (tob) => {
    onDelete({ bill });
    setDel(false);
  };

  const billDetail = (tob) => {
    setModal(true);
  };

  const title = (tob) => {
    return (
      <span>
        <i className="uil-receipt me-1"></i>
        {tob?.ref}
        <span>
          <span className="text-muted mx-1">client</span>
          {tob?.client?.username}
        </span>
      </span>
    );
  };

  const createCredit = async (data) => {
    try {
      if (+data.nbr < bill.dueAmount) {
        setCreditModal(false);
        const newCredit = new UserCredit();
        newCredit.credit = +data.nbr;
        newCredit.bill = bill;
        newCredit.motive = "regularisation du montant";
        newCredit.owner = bill.client;
        await httpService.postBody(newCredit, "usercredits");
        Toastify.success();
      } else {
        Toastify.error("le credit ne peut pas être supérieur à la somme due");
        return;
      }
    } catch (error) {
      Toastify.error();
    }
  };

  const handleGenEntry = async () => {
    /*  httpService
      .postId(bill.id, "bills/genEntry")
      .then(({ data: tob }) => {
        onGenEntry(tob);
      })
      .catch((error) => {
        Toastify.error();
      }); */

    try {
      const { data: tob } = await httpService.postId(bill.id, "bills/genEntry");
      onGenEntry(tob);
    } catch (error) {
      Toastify.error();
    }
  };

  return (
    <>
      <span className=" cursor-pointer me-1" onClick={() => billDetail(bill)}>
        {bill.ref}
      </span>

      {auth && <BtnAction tob={bill} dropMenu={dropMenu} onDrop={handleDrop} elpDrop />}
      {/* {<BtnAction tob={bill} dropMenu={dropMenu} onDrop={handleDrop} elpDrop />} */}

      {bill.fromCron && (
        <DisplayTooltip content="Facture de quinzaine">
          <span className="me-1 text-warning">
            <i className="fas fa-star"></i>
          </span>
        </DisplayTooltip>
      )}
      {bill.hasTva && (
        <DisplayTooltip content="Tva">
          <span className="me-1 text-info">
            <i className="fas fa-hand-holding-usd"></i>
          </span>
        </DisplayTooltip>
      )}

      {onUpdateNbPrint!! && <PrintBill bill={bill} onUpdatePrint={onUpdateNbPrint} />}

      {bill.entries?.length === 0 && authService.getAuth({ roles: [...COMPTA] }) && (
        <DisplayTooltip content={"générer une ecriture compta"}>
          <span className="ms-1" onClick={handleGenEntry}>
            <i className="fa fa-retweet text-danger"></i>
          </span>
        </DisplayTooltip>
      )}

      <ModalConfirm show={del} onApprove={handleApprove} onCloseModal={() => setDel(false)} />

      <ModalBase
        footer={false}
        // dialogClassName={"modal-right"}
        size={"lg"}
        onCloseModal={() => setModal(false)}
        show={modal}
        title={title(bill)}
        content={<DetailBill bill={bill} />}
      />
      <ModalBase
        footer={false}
        onCloseModal={() => setCreditModal(false)}
        show={creditModal}
        title={
          <span className="fs-6">
            accorder credit sur la facture <span className="fw-bold">{bill.ref}</span>
          </span>
        }
        content={<AdditStrNbrSelect schema="nbr" label="Credit" onSubmitForm={createCredit} onCancelForm={() => setCreditModal(false)} />}
      />
    </>
  );
};

export default BtnBillAction;
