import { dateFormatter, Product, sumAmount } from "asv-hlps";
import useReadonlyFetchTobs from "asv-hlps-react/lib/cjs/reacts/hooks/uses/useReadonlyFetchTobs";
import React, { useEffect, useState } from "react";
import { Card, Col, Dropdown, Row } from "react-bootstrap";

import httpService from "../../../../services/httpService";
import DisplayWidget from "../../../../shared/displays/display-widget";
import hlpProduct from "../helpers/hlpProduct";
import MonthQtitiesProgressBar from "./month-qtities-progressbar";

type TobType = {
  product: Product;
};

const year = new Date().getFullYear();

const StatProduct = ({ product }: TobType) => {
  const [selectedInYear, setSelectedInYear] = useState(year);
  const [selectedOutYear, setSelectedOutYear] = useState(year);
  const [sumQtitiesIn, setSumQtitiesIn] = useState(0);
  const [productsInStat, setProductsInStat] = useState([]);
  const [productsOutStat, setProductsOutStat] = useState([]);
  const [sumQtitiesOut, setSumQtitiesOut] = useState(0);
  const stock = hlpProduct.qtityInAllDepots(product?.ins || []);
  const { tob } = useReadonlyFetchTobs(httpService, `products/lastSaleDate/${product.id}`, { one: true });
  const { tobs: years } = useReadonlyFetchTobs(httpService, "statproducts/years");

  const getProductsInStat = async (year: number) => {
    const { data } = await httpService.getByTwoParams(year, product.id, "statproducts/months");
    setProductsInStat(data);
    setSumQtitiesIn(sumAmount(data, "qtities"));
  };

  const getProductsOutStat = async (year: number) => {
    const { data } = await httpService.getByTwoParams(year, product.id, "statproducts/out/months");
    setProductsOutStat(data);
    setSumQtitiesOut(sumAmount(data, "qtities"));
  };

  useEffect(() => {
    getProductsInStat(selectedInYear);
    getProductsOutStat(selectedOutYear);
  }, [selectedInYear, selectedOutYear]);

  const widgets = [
    { title: "stock", content: stock },
    { title: "dernier vente", content: dateFormatter(tob?.sale?.saleDate, "dmy", "/") },
    { title: " total vente", content: "" },
  ];

  return (
    <>
      {/* <Card> */}
      <Row className="py-2 px-2">
        <Col>
          <DisplayWidget widgets={widgets} />
        </Col>
      </Row>
      {/* </Card> */}
      {/* // ------ out ------ */}

      <Row>
        <Col sm={6}>
          <Card>
            <Card.Body>
              <Dropdown className="float-end" align="end">
                <Dropdown.Toggle as="a" className="cursor-pointer arrow-none card-drop fs-5">
                  {selectedOutYear}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {React.Children.toArray(
                    years.map((x) => (
                      <Dropdown.Item onClick={() => setSelectedOutYear(x.year)}>
                        <span onClick={() => setSelectedOutYear(x.year)}>{x.year}</span>
                      </Dropdown.Item>
                    ))
                  )}
                </Dropdown.Menu>
              </Dropdown>

              <h4 className="header-title text-uppercase fw-bold">{"sorties"}</h4>
              <MonthQtitiesProgressBar items={productsOutStat} sumQtities={sumQtitiesOut} />
            </Card.Body>
          </Card>
        </Col>
        {/* // ------ ins ------ */}
        <Col sm={6}>
          <Card>
            <Card.Body>
              <Dropdown className="float-end" align="end">
                <Dropdown.Toggle as="a" className="cursor-pointer arrow-none card-drop fs-5">
                  {selectedInYear}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {React.Children.toArray(
                    years.map((x) => (
                      <Dropdown.Item onClick={() => setSelectedInYear(x.year)}>
                        <span onClick={() => setSelectedInYear(x.year)}>{x.year}</span>
                      </Dropdown.Item>
                    ))
                  )}
                </Dropdown.Menu>
              </Dropdown>

              <h4 className="header-title text-uppercase fw-bold">entrées</h4>
              <MonthQtitiesProgressBar items={productsInStat} sumQtities={sumQtitiesIn} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default StatProduct;
