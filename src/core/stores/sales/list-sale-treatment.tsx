import { dateFormatter } from "asv-hlps";
import { BsBadge, useQueryGet } from "asv-hlps-react";
import { Sale } from "asv-hlps/lib/cjs/models/entities/sales/Sale";
import dayjs from "dayjs";
import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";

import httpService from "../../../services/httpService";
import DisplayPgTitle from "../../../shared/displays/DisplayPgTitle";
import InputSales from "./input-sales";

const ListSaleTreatment = () => {
  // ------ query ------
  const { data } = useQueryGet({
    httpService,
    url: "saletreatments/newsale",
    keys: ["treats"],
    // queryConfigs: { refetchInterval: ms("2s") },
    queryConfigs: { refetchInterval: 2000 },
  });
  /* console.log("------ data ------");
  console.log(data);
  console.log("------ data ------"); */

  const sales = data && data["treats"];
  const yearMonthDays = data && data["treatsYearMonthDays"];

  /* console.log("------ datas ------");
  console.log(data?.treats);
  console.log(data?.treatsYearMonthDays);
  console.log("------ datas ------"); */
  // --------------------
  // const [sales, setSales] = useState([]);
  // const [yearMonthDays, setYearMonthDays] = useState([]);
  const [loading, setLoading] = useState(false);

  /* const fetchTobs = async () => {
    const { data } = await httpService.getByParam("newsale", `saletreatments`);
    setSales(data["treats"]);
    setYearMonthDays(data["treatsYearMonthDays"]);

    console.log("------ datas ------");
    console.log(data["treats"]);
    console.log(data["treatsYearMonthDays"]);
    console.log("------ datas ------");
  }; */

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     fetchTobs();
  //   }, 2000);
  //   return () => clearInterval(interval);

  //   fetchTobs();
  //   return () => {};
  //   }, [sales, yearMonthDays]);
  // }, []);

  const salesByDay = (sales: Sale[], format: any) => {
    if (sales) {
      // return sales.filter((x) => x.saleDate.substring(0, 10) === format);
      return sales.filter((x) => dateFormatter(x.saleDate, "ymd", "-").substring(0, 10) === format);
    }
  };

  return (
    <>
      <DisplayPgTitle pgTitle="commandes" />
      <Row>
        <Col>
          <div className="timeline ">
            {React.Children.toArray(
              // yearMonthDays.map((oymd) => (
              (yearMonthDays || []).map((oymd) => (
                <>
                  <div className="timeline-item">
                    <div className="time-show mt-0">
                      {/* <Link to="#" className="btn btn-primary width-lg float-start">
                        {oymd.yearMonthDay} poi
                      </Link> */}
                      <div className="btn btn-primary btn-sm text-uppercase  float-start">
                        {/* {dayjs(new Date(oymd.yearMonthDay)).locale("fr").format("DD/MM/YYYY")} poi */}
                        {dayjs(oymd.yearMonthDay).locale("fr").format("dddd DD MMMM YYYY")}
                        {/* {dateFormatter(oymd.yearMonthDay, "dmyfr")} */}

                        <BsBadge variant="danger" className={"ms-1"}>
                          {salesByDay(sales, oymd.yearMonthDay).length}
                        </BsBadge>
                      </div>
                    </div>
                  </div>
                  <article className="timeline-item">
                    <div className="timeline-desk">
                      <div className="timeline-box">
                        <span className="arrow"></span>
                        <InputSales sales={salesByDay(sales, oymd?.yearMonthDay)} />
                      </div>
                    </div>
                  </article>
                </>
              ))
            )}
          </div>
        </Col>
      </Row>
    </>
  );
};

export default ListSaleTreatment;
