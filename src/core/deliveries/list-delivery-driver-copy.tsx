import { ModalBase, ModalConfirm } from "asv-hlps-react";
import { Sale } from "asv-hlps/lib/cjs/models/entities/sales/Sale";
import { SaleDelivery } from "asv-hlps/lib/cjs/models/entities/sales/SaleDelivery";
import lodash from "lodash";
import React, { useEffect, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";

import httpService from "../../services/httpService";
import AdditStrNbrSelect from "../../shared/forms/addit-str-nbr-select";
import { IIdName } from "../../shared/models/IIdName";
import hlpDelivery from "./hlpDelivery";
import InputDeliveriesDriver from "./input-deliveries-driver";

const ListDeliveryDriverCopy = () => {
  const [deliveries, setDeliveries] = useState<SaleDelivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [deliveryIds, setDeliveryIds] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [modal, setModal] = useState(false);
  const [modalConfirm, setModalConfirm] = useState(false);
  const [treat, setTreat] = useState<"delivering" | "delivered">();
  const [delivery, setDelivery] = useState<SaleDelivery>(null);
  const [sale, setSale] = useState<Sale>(null);
  const [checkAllDelivering, setCheckAllDelivering] = useState(null);

  // const [allDelivering, setAllDelivering] = useState(totalSales === count?.delivering ? true : false);
  // const [allDelivered, setAllDelivered] = useState(totalSales === count?.delivered ? true : false);
  // --------------------

  const fetchDatas = async () => {
    // setLoading(true);
    const { data: tobs } = await httpService.get("saledeliveries/drivers");
    setLoading(false);
    setDeliveries(tobs);
    setTotalSales(hlpDelivery.getIdsAndSalesLength(deliveries).totalSales);
    setCheckAllDelivering(hlpDelivery.checkAllDelivering(deliveries));

    // hlpDelivery.setLocalDeliveries(tobs);
    // --------------------
    // setCount(hlpDelivery.checkAllSalesDone(deliveries));
    // setTotalSales(hlpDelivery.getIdsAndSalesLength(deliveries).totalSales);
    // setDeliveryIds(hlpDelivery.getIdsAndSalesLength(deliveries).deliveryIds);
    // let allDelivering = totalSales === count?.delivering ? true : false;
    // const allDelivered = totalSales === count?.delivered ? true : false;
    // --------------------
  };
  const nbTotal = hlpDelivery.getIdsAndSalesLength(deliveries).totalSales;
  const allDelivering = hlpDelivery.checkAllDelivering(deliveries);

  useEffect(() => {
    fetchDatas();
    if (allDelivering) {
      checkDriverStart();
    }

    return () => {};
  }, [allDelivering]);

  const checkDriverStart = async () => {
    // --------------------
    const vehicles: IIdName[] = [];
    const deliveryIds: number[] = [];
    // setAllDelivering(false);
    try {
      const { data: datas } = await httpService.get("vehicles/menu");

      for (const data of datas) {
        vehicles.push({ id: data.id, name: data.registration + " (" + data.name + ")" });
      }
      setVehicles(vehicles);

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

  // --------------------
  /* const handleRefresh = () => {
    fetchDatas();
  }; */

  /* const onConfirmStart = async () => {
    const vehicles: IIdName[] = [];
    const deliveryIds: number[] = [];
    setAllDelivering(false);
    try {
      const { data: datas } = await httpService.get("vehicles/menu");
      for (const data of datas) {
        vehicles.push({ id: data.id, name: data.registration + " (" + data.name + ")" });
      }
      setVehicles(vehicles);

      // ------ delivery ids ------
      for (const delivery of deliveries) {
        deliveryIds.push(delivery.id);
      }
      setDeliveryIds(deliveryIds);
      setModal(true);
      // --------------------
    } catch (error) {}
  }; */

  const updateLocalDeliveries = (getDeliveries: SaleDelivery[], delivery: SaleDelivery, sale: Sale, delivered?: boolean) => {
    const deliveries = lodash.cloneDeep(getDeliveries);
    const currDelivery = deliveries.find((x) => x.id === delivery.id);

    const indexDl = deliveries.findIndex((x) => x.id === currDelivery.id);
    const indexSale = currDelivery.sales.findIndex((x) => x.id === sale.id);
    if (delivered) {
      currDelivery.sales[indexSale].isDelivered = true;
    } else {
      currDelivery.sales[indexSale].isDelivering = true;
    }
    deliveries[indexDl] = currDelivery;

    return deliveries;
  };

  const onProcessApproved = async () => {
    switch (treat) {
      case "delivering":
        setModalConfirm(false);
        setDeliveries(updateLocalDeliveries(deliveries, delivery, sale));

        break;
      case "delivered":
        setModalConfirm(false);
        setDeliveries(updateLocalDeliveries(deliveries, delivery, sale));

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
        const { data: tob } = await httpService.postBody(
          { deliveryIds, kms: data.nbr, vehicleId: data.selectedId },
          "saledeliveries/start"
        );
      } catch (error) {}
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

        {/* {isChecked && (
    <Button size="sm" className="text-uppercase" onClick={onGenDelivery}>
      générer une livraison
    </Button>
  )} */}
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
        // content={<AdditStrNbrSelect schema="select" label={"véhicule"} options={vehicles} onSubmitForm={undefined} />}
      />
    </>
  );
};

export default ListDeliveryDriverCopy;
