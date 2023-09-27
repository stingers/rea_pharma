import { BtnAction, colToolTip, DropMenuType } from "asv-hlps-react";
import { ModalBase } from "asv-hlps-react/lib/cjs/reacts/minton/modals";
import { Sale } from "asv-hlps/lib/cjs/models/entities/sales/Sale";
import dayjs from "dayjs";
import { useState } from "react";

import { MAG } from "../../../auth/services/auth-menu";
import authService from "../../../auth/services/authService";
import DetailSale from "./detail-sale";
import PrintSale from "./print-sale";

type TobType = {
  sale: Sale;
  children?: any;
  print?: boolean;
  menu?: boolean;
  onReportedSaleBill?: (tob: Sale) => void;
  auth?: boolean;
  authReportSale?: boolean;
};

const BtnSaleAction = ({ sale, children, print, auth = true, authReportSale, onReportedSaleBill, menu = true }: TobType) => {
  const [modal, setModal] = useState(false);
  /* const saleDetail = (props) => {
    setModal(true);
  }; */
  const dropMenu: DropMenuType = {
    icon: "uil uil-ellipsis-v ",
    iconTooltip: "actions",
    drops: [{ id: 1, label: "reporter la facturation", icon: "fas fa-reply-all", auth: authReportSale }],
  };

  const onDrop = (evt) => {
    switch (evt.id) {
      case 1:
        onReportedSaleBill(evt.tob);
        break;
    }
  };

  return (
    <>
      {/* <span className=" cursor-pointer me-1" onClick={() => saleDetail(sale)}> */}
      <span className=" cursor-pointer me-1" onClick={() => setModal(true)}>
        {!children ? sale.ref : children}
      </span>
      {menu && auth && dropMenu.drops.length > 0 && <BtnAction tob={sale} dropMenu={dropMenu} onDrop={onDrop} elpDrop />}

      {print && !authService.getAuth({ roles: MAG }) && <PrintSale action="print" sale={sale} />}

      {sale.isReported && colToolTip(<i className="fas fa-reply-all text-danger"></i>, "facturation reportée")}
      <ModalBase
        size="lg"
        footer={false}
        onCloseModal={() => setModal(false)}
        show={modal}
        title={
          <span className="text-primary">
            commande N° {sale.ref} du {dayjs(sale.saleDate).format("DD/MM/YYYY : HH.mm")}
          </span>
        }
        content={<DetailSale tob={sale} />}
      />
    </>
  );
};

export default BtnSaleAction;
