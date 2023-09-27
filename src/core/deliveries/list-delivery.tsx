import { dateFormatter } from "asv-hlps";
import { useQueryCrud } from "asv-hlps-react";
import React, { useEffect, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";

import httpService from "../../services/httpService";
import hlpCrud from "../../shared/helpers/hlpCrud";
import InputDeliveries from "./input-deliveries";

const ListDelivery = () => {
  // const [tobs, setTobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [periods, setPeriods] = useState([]);
  // --------------------
  const { tobs, error, isLoading } = useQueryCrud({
    keys: ["listdeliveries"],
    httpService,
    url: "saledeliveries/actives",
  });

  useEffect(() => {
    if (tobs) {
      let nPeriods: any[] = [];
      for (const data of tobs) {
        nPeriods.push((data.createdAt as string).substring(0, 10));
      }
      nPeriods = [...new Set(nPeriods)];
      setLoading(false);
      setPeriods(nPeriods);
    }
  }, [tobs]);

  const upDateDelivery = (delivery) => {
    const nTobs = hlpCrud.updateTobOnList(delivery, tobs);
    // const data = useQueryCrudUpdate(httpService, ["keys"], url);
    // setTobs(nTobs);
  };
  return (
    <Row>
      <Col>
        <div className="timeline ">
          {React.Children.toArray(
            (periods || []).map((period) => (
              <>
                <div className="timeline-item">
                  <div className="time-show mt-0">
                    <Button className="btn btn-primary btn-sm float-start text-uppercase">{dateFormatter(period, "dmyfr")}</Button>
                  </div>
                </div>
                <article className="timeline-item">
                  <div className="timeline-desk">
                    <div className="timeline-box">
                      <span className="arrow"></span>
                      {<InputDeliveries period={period} deliveries={tobs} onDelivery={upDateDelivery} />}
                    </div>
                  </div>
                </article>
              </>
            ))
          )}
        </div>
      </Col>
    </Row>
  );
};

export default ListDelivery;
