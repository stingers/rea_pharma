import { useQueryClient } from "@tanstack/react-query";
import { Toastify } from "asv-hlps-react";
import LinkTob from "asv-hlps-react/lib/cjs/reacts/links/link-tob";
import { ModalBase } from "asv-hlps-react/lib/cjs/reacts/minton/modals/modal-base";
import { SaleDelivery } from "asv-hlps/lib/cjs/models/entities/sales/SaleDelivery";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import React, { useState } from "react";
import { Badge, Card } from "react-bootstrap";

import { PHD } from "../../auth/services/auth-menu";
import authService from "../../auth/services/authService";
import { CpaDefinition } from "../../pdfs/CpaDefinition";
import { PdfSaleTables } from "../../pdfs/sales/PdfSaleTables";
import httpService from "../../services/httpService";
import pdfService from "../../services/pdfService";
import AdditStrNbrSelect from "../../shared/forms/addit-str-nbr-select";
import DetailDeliveryDone from "./detail-delivery-done";

interface TobType {
  deliveries: any[];
  period: string;
  onDelivery: (delivery: SaleDelivery) => void;
}

dayjs.extend(relativeTime);

const InputDeliveries = ({ period, deliveries }: TobType) => {
  const [modal, setModal] = useState(false);
  const [delivery, setDelivery] = useState(null);
  const [drivers, setDrivers] = useState();
  // --------------------
  const queryClient = useQueryClient();

  const dateSubstring = (date: any) => {
    return (date as string).substring(0, 10);
  };
  const onGenPdf = (delivery: SaleDelivery) => {
    const totalPackages = delivery.sales.reduce((prev, curr) => prev + curr.nbPackages, 0);
    const totalFreezes = delivery.sales.reduce((prev, curr) => prev + curr.nbFreeze, 0);
    pdfService.generatePdf(
      "print",
      CpaDefinition.listDelivery({ delivery, totalPackages, totalFreezes }, PdfSaleTables.listZoneSale(delivery.sales))
    );
  };

  const onDriver = async (delivery) => {
    const { data: drivers } = await httpService.get("users/drivers");
    const nDrivers = drivers.map((tob) => {
      return { id: tob.id, name: tob.fullname };
    });
    setDelivery(delivery);
    setDrivers(nDrivers);
    setModal(true);
  };

  const onChangeDriver = async (driver) => {
    setModal(false);
    try {
      const { data } = await httpService.postBody({ deliveryId: delivery.id, driverId: driver.id }, "saledeliveries/changeDriver");
      if (data) {
        queryClient.invalidateQueries(["listdeliveries"]);
        Toastify.success();
      }
    } catch (error) {}
  };

  const getDelivery = (delivery, period, i) => {
    if (period === dateSubstring(delivery.createdAt)) {
      return (
        <tr className="  shadow-2 mb-1 ">
          <th scope="row">{i + 1} </th>
          <th scope="row">
            {
              <LinkTob
                withModal={{
                  size: "lg",
                  title: `${delivery.ref} (${delivery.driver.fullname})`,
                  content: <DetailDeliveryDone delivery={delivery} />,
                }}
                tob={delivery}>
                {delivery.ref}
              </LinkTob>
            }
          </th>
          <th scope="row">
            {authService.getAuth({ roles: [...PHD] }) ? (
              <span onClick={() => onDriver(delivery)}>{delivery.driver.fullname} </span>
            ) : (
              <span>{delivery.driver.fullname} </span>
            )}
          </th>
          <th scope="row">
            <Badge bg="success">{delivery.sales.length}</Badge>
          </th>
          <th scope="row">
            <span onClick={() => onGenPdf(delivery)}>
              <i className="fas fa-print"></i>
            </span>
          </th>
          <th scope="row">
            <Badge bg="danger" className="px-1">
              en cours
            </Badge>
          </th>
        </tr>
      );
    }
  };

  return (
    <>
      <Card>
        <div className="table-responsive">
          <table className=" table table-hover mb-0 ">
            <tbody>{React.Children.toArray(deliveries.map((delivery, i) => getDelivery(delivery, period, i)))}</tbody>
          </table>
        </div>
      </Card>
      <ModalBase
        title={"choisir un chauffeur"}
        show={modal}
        onCloseModal={() => setModal(false)}
        content={<AdditStrNbrSelect schema="select" options={drivers} label={"chauffeur"} onSubmitForm={onChangeDriver} />}
      />
    </>
  );
};

export default InputDeliveries;
