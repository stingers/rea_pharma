import { dateFormatter } from "asv-hlps";
import { useQueryGet } from "asv-hlps-react";
import { Sale } from "asv-hlps/lib/cjs/models/entities/sales/Sale";
import React from "react";
import { Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

import httpService from "../../../../services/httpService";
import InputSalesBack from "./input-sales-back";

const ListSaleBackNew = () => {
  const { data } = useQueryGet({ httpService, keys: ["salesBackNew"], url: "salesback/notreat" });
  const yearMonthDays = data?.yearMonthDays as any[];
  const salesBack = data?.salesBack as Sale[];

  // --------------------
  const salesByDay = (sales: Sale[], format: any) => {
    if (sales) {
      return sales.filter((x) => dateFormatter(x.saleDate, "ymd", "-").substring(0, 10) === format);
    }
  };
  return (
    <Row>
      <Col>
        <div className="timeline ">
          {React.Children.toArray(
            (yearMonthDays || []).map((oymd) => (
              <>
                <div className="timeline-item">
                  <div className="time-show mt-0">
                    <Link to="#" className="btn btn-primary btn-sm text-uppercase width-lg float-start">
                      {dateFormatter(oymd.yearMonthDay, "dmyfr")}
                    </Link>
                  </div>
                </div>
                <article className="timeline-item">
                  <div className="timeline-desk">
                    <div className="timeline-box">
                      <span className="arrow"></span>
                      <InputSalesBack salesBack={salesByDay(salesBack, oymd?.yearMonthDay)} />
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

export default ListSaleBackNew;
