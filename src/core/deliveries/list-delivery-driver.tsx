import { useQueryClient } from "@tanstack/react-query";
import { ModalBase, ModalConfirm, Toastify, useQueryGet, useReadonlyFetchTobs } from "asv-hlps-react";
import { Sale } from "asv-hlps/lib/cjs/models/entities/sales/Sale";
import { SaleDelivery } from "asv-hlps/lib/cjs/models/entities/sales/SaleDelivery";
import React, { useEffect, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";

import httpService from "../../services/httpService";
import AdditStrNbrSelect from "../../shared/forms/addit-str-nbr-select";
import hlpDelivery from "./hlpDelivery";
import InputDeliveriesDriver from "./input-deliveries-driver";

const ListDeliveryDriver = () => {
  const [totalSales, setTotalSales] = useState(0);
  const [deliveryIds, setDeliveryIds] = useState(null);
  // const [vehicles, setVehicles] = useState([]);
  const [modal, setModal] = useState(false);
  const [modalConfirm, setModalConfirm] = useState(false);
  const [treat, setTreat] = useState<"delivering" | "delivered">();
  const [delivery, setDelivery] = useState<SaleDelivery>(null);
  const [sale, setSale] = useState<Sale>(null);
  const { tobs } = useReadonlyFetchTobs(httpService, "vehicles/menu");
  // const [checkAllDelivering, setCheckAllDelivering] = useState(null);
  const queryClient = useQueryClient();
  const [modalEnd, setModalEnd] = useState(false);
  const [msgWrongKms, setMsgWrongKms] = useState(null);
  // const [isStart, setIsStart] = useState(false);
  /* start: queries -------------------------------------- */
  /* const fetchTobs = async () => {
    httpService.get("saledeliveries/drivers").then(({ data }) => {
      setCheckAllDelivering(hlpDelivery.checkAllDelivering(deliveries));
      setCheckAllDelivered(hlpDelivery.checkAllDelivered(deliveries));
      return data;
    });
  }; */

  /* end: queries ---------------------------------------- */
  const vehicles = tobs.map((data) => ({ id: data.id, name: data.registration + " (" + data.name + ")" }));
  /* for (const data of datas) {
    vehicles.push({ id: data.id, name: data.registration + " (" + data.name + ")" });
  } */

  // --------------------
  const { data: deliveries, isLoading } = useQueryGet({ httpService, keys: ["listDeliveryDriver"], url: "saledeliveries/drivers" });
  const [checkAllDelivering, setCheckAllDelivering] = useState<boolean>(deliveries ? hlpDelivery.checkAllDelivering(deliveries) : false);
  const [checkAllDelivered, setCheckAllDelivered] = useState<boolean>(deliveries ? hlpDelivery.checkAllDelivered(deliveries) : false);

  // --------------------
  const topStart = (delivery: SaleDelivery) => {
    return delivery && delivery.vehicle && delivery.startDate;
  };

  useEffect(() => {
    if (deliveries) {
      setTotalSales(hlpDelivery.getIdsAndSalesLength(deliveries || []).totalSales);

      setCheckAllDelivering(hlpDelivery.checkAllDelivering(deliveries));
      setCheckAllDelivered(hlpDelivery.checkAllDelivered(deliveries));

      setDeliveryIds(deliveries.map((delivery) => delivery.id));

      // if (!isStart && checkAllDelivering && !checkAllDelivered) {
      if (!topStart(deliveries[0]) && checkAllDelivering && !checkAllDelivered) {
        checkDriverStart();
      }

      if (checkAllDelivering && checkAllDelivered) {
        onEnd;
        // checkDriverStart();
      }
    }

    // return () => {};
  }, [deliveries, checkAllDelivering, checkAllDelivered, treat]);

  const checkDriverStart = async () => {
    // --------------------
    // const vehicles: IIdName[] = [];
    const deliveryIds: number[] = [];
    // setAllDelivering(false);
    try {
      // const { data: datas } = await httpService.get("vehicles/menu");

      /*  for (const data of datas) {
        vehicles.push({ id: data.id, name: data.registration + " (" + data.name + ")" });
      }
      setVehicles(vehicles); */

      // ------ delivery ids ------
      for (const delivery of deliveries) {
        deliveryIds.push(delivery.id);
      }
      setDeliveryIds(deliveryIds);
      setModal(true);
      // --------------------
    } catch (error) {
      console.log(error);
    }
  };

  const onProcessApproved = async () => {
    switch (treat) {
      case "delivering":
        setModalConfirm(false);
        const { data: tobs } = await httpService.postBody({ saleId: sale.id, treat }, "saletreatments");
        if (tobs) {
          queryClient.invalidateQueries(["listDeliveryDriver"]);
          Toastify.success();
          if (hlpDelivery.checkAllDelivering(deliveries)) {
            checkDriverStart();
          }
        }

        break;
      case "delivered":
        setModalConfirm(false);
        const { data } = await httpService.postBody({ saleId: sale.id, treat }, "saletreatments");
        if (data) {
          queryClient.invalidateQueries(["listDeliveryDriver"]);
          Toastify.success();
          if (hlpDelivery.checkAllDelivered(deliveries)) {
            onEnd;
          }
        }

        break;
    }
  };

  const onProcess = async (delivery, sale, treat) => {
    setDelivery(delivery);
    setSale(sale);
    setTreat(treat);
    setModalConfirm(true);
  };

  const onStart = async ({ data }) => {
    if (data) {
      setModal(false);
      try {
        const { data: tobs } = await httpService.postBody(
          { deliveryIds, kms: data.nbr, vehicleId: data.selectedId },
          "saledeliveries/start"
        );
        if (tobs) {
          queryClient.invalidateQueries(["listDeliveryDriver"]);
          Toastify.success();
        } else {
          Toastify.error();
        }
      } catch (error) {}
    }
  };

  const onEnd = async (data) => {
    if (data.nbr < deliveries[0].startVehiculeKms) {
      setMsgWrongKms("le kilométrage de retour ne peut pas être inférieur au kilométrage de depart");
    } else {
      setMsgWrongKms(null);
      setModalEnd(false);
      const { data: tobs } = await httpService.postBody(
        { deliveries, deliveryIds: deliveries.map((delivery) => delivery.id), kms: data.nbr },
        "saledeliveries/end"
      );
      if (tobs) {
        queryClient.invalidateQueries(["listDeliveryDriver"]);
        Toastify.success();
      } else {
        Toastify.error();
      }
    }
  };

  return (
    <>
      <Row>
        <Col>
          <div className="timeline ">
            {React.Children.toArray(
              (deliveries || []).map((delivery) => (
                <>
                  <div className="timeline-item">
                    <div className="time-show mt-0">
                      <Button className="btn btn-primary btn-sm float-start">{delivery.ref}</Button>
                    </div>
                  </div>
                  <article className="timeline-item">
                    <div className="timeline-desk">
                      <div className="timeline-box">
                        <span className="arrow"></span>
                        {<InputDeliveriesDriver delivery={delivery} onProcess={onProcess} />}
                      </div>
                    </div>
                  </article>
                </>
              ))
            )}
          </div>
        </Col>
        {/* {deliveries?.length > 0 && hlpDelivery.checkAllDelivering(deliveries) && !hlpDelivery.checkAllDelivered(deliveries) && ( */}
        {deliveries?.length > 0 && !topStart(deliveries[0]) && checkAllDelivering && !checkAllDelivered && (
          <Button size="sm" className="text-uppercase" onClick={() => setModal(true)}>
            confirmer l'enlevement des livraisons
          </Button>
        )}
        {/* {deliveries?.length > 0 && hlpDelivery.checkAllDelivered(deliveries) && hlpDelivery.checkAllDelivered(deliveries) && ( */}

        {deliveries?.length > 0 && checkAllDelivering && checkAllDelivered && (
          <Button size="sm" className="text-uppercase" onClick={() => setModalEnd(true)}>
            confirmer la fin de la livraison
          </Button>
        )}
      </Row>
      <ModalConfirm
        title={treat === "delivering" ? "confirmer l'enlevement" : "confirmation de la livraison"}
        show={modalConfirm}
        onCloseModal={() => setModalConfirm(false)}
        content={
          <p className="text-center">
            {treat === "delivering" ? "Veuillez confirmer l'enlèvement de la commande" : "Veuillez confirmer la livraison de la commande"}
            <span className="fw-bold">{sale?.ref} </span> pour la
            <span className="fw-bold"> {sale?.client?.ste?.name}</span>
          </p>
        }
        onApprove={onProcessApproved}
        onCancel={() => setModalConfirm(false)}
      />

      <ModalBase
        title={"top depart"}
        show={modal}
        onCloseModal={() => setModal(false)}
        content={
          <AdditStrNbrSelect schema="nbrSelect" labelSelect={"Véhicule"} label={"Kilomêtres"} options={vehicles} onSubmitForm={onStart} />
        }
      />
      {/* end deliveries */}
      <ModalBase
        title={"Fin de livraison"}
        show={modalEnd}
        onCloseModal={() => setModalEnd(false)}
        content={
          <AdditStrNbrSelect
            msg={<div className=" mb-1 text-center text-danger">{msgWrongKms}</div>}
            schema="nbr"
            label={"kms de fin"}
            onSubmitForm={onEnd}
          />
        }
      />
    </>
  );
};

export default ListDeliveryDriver;
