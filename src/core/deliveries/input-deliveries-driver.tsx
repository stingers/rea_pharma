import { Sale } from "asv-hlps/lib/cjs/models/entities/sales/Sale";
import { SaleDelivery } from "asv-hlps/lib/cjs/models/entities/sales/SaleDelivery";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import React from "react";
import { Button, Card } from "react-bootstrap";

import { PHD } from "../../auth/services/auth-menu";
import authService from "../../auth/services/authService";
import pipeSale from "../stores/sales/helpers/pipeSale";

interface TobType {
  delivery: SaleDelivery;
  onProcess: (delivery: SaleDelivery, sale: Sale, treat: string) => void;
  // period: string;
  // onDelivery: (delivery: SaleDelivery) => void;
}

dayjs.extend(relativeTime);

const InputDeliveriesDriver = ({ delivery, onProcess }: TobType) => {
  return (
    <>
      <Card>
        <div className="table-responsive">
          <table className=" table table-hover  table-sm mb-0 ">
            <tbody>
              {React.Children.toArray(
                (delivery.sales || []).map((sale, i) => (
                  // <tr className="border border-2 border-danger border-top-0 border-end-0  border-bottom-0 ">
                  <tr>
                    <th>{i + 1}</th>
                    <th>{sale?.ref}</th>
                    <th>{sale?.client?.username}</th>
                    <th>{sale?.client?.ste?.name}</th>
                    <th>
                      {pipeSale.treat(sale, "picking") &&
                        authService.getAuth({ tag: "sdc_el_act", roles: [...PHD, "cha", "com", "tlm"] }) && (
                          <Button
                            className="btn-dark btn-xs text-uppercase"
                            // onClick={() => onConfirmProcess(sale, "delivering")}>
                            onClick={() => onProcess(delivery, sale, "delivering")}>
                            commande prête
                          </Button>
                        )}
                      {/* isDelivering */}
                      {pipeSale.treat(sale, "delivering") &&
                        authService.getAuth({ tag: "sdc_el_act", roles: [...PHD, "cha", "com", "tlm"] }) && (
                          <Button
                            // size="sm"
                            className="btn-warning btn-xs text-uppercase "
                            // onClick={() => onConfirmProcess(sale, "delivered")}>
                            onClick={() => onProcess(delivery, sale, "delivered")}>
                            en livraison
                          </Button>
                        )}
                      {/* isDelivered */}
                      {pipeSale.treat(sale, "delivered") && authService.getAuth({ tag: "sdc_lv", roles: ["cha"] }) && (
                        <Button
                          // size="sm"
                          className="btn-success btn-xs text-uppercase fs-6"
                          // onClick={() => onConfirmProcess(sale, "delivered")}>
                          onClick={() => onProcess(delivery, sale, "delivered")}>
                          livrée
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
      {/* <ModalConfirm
        show={modalConfirm}
        onCloseModal={() => setModalConfirm(false)}
        content={
          <p className="text-center">
            Veuillez confirmer l'enlèvement de la commande <span className="fw-bold">{sale?.ref} </span> pour la
            <span className="fw-bold"> {sale?.client?.ste?.name}</span>
          </p>
        }
        onApprove={onApproveProcess}
        onCancel={() => setModalConfirm(false)}
      />
 */}
      {/* <ModalBase
        title={"choisir un chauffeur"}
        show={modal}
        onCloseModal={() => setModal(false)}
        content={<AdditStrNbrSelect schema="select" options={drivers} label={"chauffeur"} onSubmitForm={undefined} />}
      /> */}
    </>
  );
};

export default InputDeliveriesDriver;
