import { dateFormatter } from "asv-hlps";
import dayjs from "dayjs";
import React from "react";
import { Alert, Col, ProgressBar, Row } from "react-bootstrap";

import "dayjs/locale/fr";

type ItemType = {
  yearMonth;
  qtities: number;
  progressVariant?: string;
  label: any;
};

type TobType = {
  items: ItemType[];
  sumQtities: number;
};

const MonthQtitiesProgressBar = ({ items, sumQtities }: TobType) => {
  const progressValue = (item, sumQtities) => {
    return ((item.qtities * 100) / sumQtities).toFixed(2);
  };

  return (
    <>
      {items.length > 0 && (
        <>
          <h5 className="my-2 fw-bold">
            Mois <span className="float-end ms-2">Quantité</span>
          </h5>
          {React.Children.toArray(
            items.map((item, index) => {
              return (
                <>
                  <h5 className="mb-0 mt-0 text-uppercase fs-6 fw-bold ">
                    {dayjs(item.yearMonth).locale("fr").format("MMM")}
                    {dateFormatter(item.yearMonth, "mfr-short")}
                    <span className="float-end ms-2">{item.qtities}</span>
                  </h5>
                  <Row className="align-items-center g-0 mb-1 pb-1">
                    <Col className="col">
                      <ProgressBar
                        variant={item.progressVariant ? item.progressVariant : "primary"}
                        now={+progressValue(item, sumQtities)}
                        className="progress-sm"
                      />
                    </Col>
                    <Col className="col-auto">
                      <div className="fw-medium ms-2">{progressValue(item, sumQtities)}%</div>
                    </Col>
                  </Row>
                </>
              );
            })
          )}
          <h5 className="my-2 fw-bold">
            Total <span className="float-end ms-2">{sumQtities}</span>
          </h5>
        </>
      )}
      {items.length <= 0 && <Alert variant="info"> stat non disponible l'année sélectionnée </Alert>}
    </>
  );
};

export default MonthQtitiesProgressBar;
