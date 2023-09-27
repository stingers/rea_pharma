import { arrayMultiChecked } from "asv-hlps";
import { ModalBase, ModalConfirm, Toastify } from "asv-hlps-react";
import React, { useEffect, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";

import httpService from "../../services/httpService";
import AdditStrNbrSelect from "../../shared/forms/addit-str-nbr-select";
import { IIdName } from "../../shared/models/IIdName";
import InputSales from "../stores/sales/input-sales";

const MngDelivery = () => {
  const [tobs, setTobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checks, setChecks] = useState<any[]>([]);
  const [isChecked, setIsChecked] = useState(false);
  const [modalConfirm, setModalConfirm] = useState(false);
  const [drivers, setDrivers] = useState<IIdName[]>([]);
  const [modal, setModal] = useState(false);

  // --------------------
  const fetchDatas = async () => {
    // setLoading(true);
    const { data: tobs } = await httpService.get("zones/mngs/actives");
    setLoading(false);
    setTobs(tobs);
  };
  useEffect(() => {
    fetchDatas();
    return () => {};
  }, []);
  // --------------------

  const onChecked = ({ e, zone }) => {
    const evt = e.currentTarget.checked;
    const nChecks = arrayMultiChecked(checks, evt, zone);
    setChecks(nChecks);
    const checked = checks.length ? true : false;
    setIsChecked(checked);
  };

  const onGenDelivery = () => {
    setModalConfirm(true);
  };

  const handleRefresh = () => {
    fetchDatas();
  };

  const onCancel = () => {
    setChecks([]);
    setModalConfirm(false);
    // setIsChecked(false);
  };

  const handleGenDelivery = async (driver) => {
    // ------ get sales ids ------
    let zones: any[] = [];
    for (const zone of checks) {
      let saleIds: number[] = [];
      for (const sale of zone.sales) {
        saleIds.push(sale.id);
      }
      zones.push({ id: zone.id, saleIds: saleIds });
    }
    try {
      await httpService.create({ driver: driver.id, zones: zones }, "saledeliveries");
      setModal(false);
      setIsChecked(false);
      fetchDatas();
      Toastify.success();
    } catch (error) {
      Toastify.error();
    }
  };

  const onApprove = async () => {
    const { data: drivers } = await httpService.get("users/drivers");
    const nDrivers = drivers.map((tob) => {
      return { id: tob.id, name: tob.fullname };
    });
    setDrivers(nDrivers);
    setModalConfirm(false);
    setModal(true);
  };

  return (
    <>
      <Row>
        <Col>
          <div className="timeline ">
            {React.Children.toArray(
              tobs.map((zone) => (
                <>
                  <div className="timeline-item">
                    <div className="time-show mt-0">
                      <Button className="btn btn-primary btn-sm float-start">
                        {zone.name}
                        <input className="mx-1" type="checkbox" name="zone.id" onChange={(e) => onChecked({ e, zone })} />
                      </Button>
                    </div>
                  </div>
                  <article className="timeline-item">
                    <div className="timeline-desk">
                      <div className="timeline-box">
                        <span className="arrow"></span>
                        {/* <InputSales sales={salesByDay(sales, oymd?.yearMonthDay)} /> */}
                        <InputSales sales={zone.sales} />
                      </div>
                    </div>
                  </article>
                </>
              ))
            )}
          </div>
        </Col>

        {isChecked && (
          <Button size="sm" className="text-uppercase" onClick={onGenDelivery}>
            générer une livraison
          </Button>
        )}
      </Row>
      <ModalConfirm
        show={modalConfirm}
        onCloseModal={() => setModalConfirm(false)}
        onCancel={onCancel}
        content={"êtes-vous sûr d'éffectuer cette action"}
        approveVariant={"success"}
        onApprove={onApprove}
      />
      <ModalBase
        onCancel={onCancel}
        onCloseModal={() => setModal(false)}
        show={modal}
        title={"Selectionner un chauffeur"}
        content={<AdditStrNbrSelect options={drivers} schema="select" label={"Chauffeur"} onSubmitForm={handleGenDelivery} />}
      />
    </>
  );
};

export default MngDelivery;
