import { monthStringName, Product, sumAmount } from "asv-hlps";
import useReadonlyFetchTobs from "asv-hlps-react/lib/cjs/reacts/hooks/uses/useReadonlyFetchTobs";
import React, { useEffect, useState } from "react";
import { Alert, Card, Col, Dropdown, Row } from "react-bootstrap";

import httpService from "../../../../services/httpService";
import ApexChartBar from "../../../../shared/charts/apex-chart-bar";
import DisplayWidget from "../../../../shared/displays/display-widget";
import MonthQtitiesProgressBar from "./month-qtities-progressbar";

type TobType = {
  product: Product;
};
const SaledProduct = ({ product }: TobType) => {
  const [sumQtitiesDlvr, setSumQtitiesDlvr] = useState(0);
  const [sumQtitiesFree, setSumQtitiesFree] = useState(0);
  const [sumSaleAmount, setSumSaleAmount] = useState(0);
  const [saleProductStat, setSaleProductStat] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [chartCats, setChartCats] = useState<string[]>([]);
  const [chartDatas, setChartDatas] = useState<number[]>([]);
  const { tobs: years } = useReadonlyFetchTobs(httpService, "statsaleproducts/years");

  const getStatSaleProduct = async (year: number) => {
    const { data } = await httpService.getByTwoParams(year, product.id, "statsaleproducts/months");
    setSaleProductStat(data);
    // ------ chartTools ------
    const cats = data.map((x) => monthStringName(x.yearMonth));
    setChartCats(cats);
    const datas = data.map((x) => +x.qtities);
    setChartDatas(datas);
    // --------------------
    setSumQtitiesDlvr(sumAmount(data, "qtities"));
    setSumQtitiesFree(sumAmount(data, "sumQtityFree"));
    setSumQtitiesFree(sumAmount(data, "sumAmountQtityDlvr"));
  };

  useEffect(() => {
    getStatSaleProduct(selectedYear);
  }, [selectedYear]);

  const widgets = [
    { title: "stock", content: "" },
    { title: " total vente", content: sumQtitiesDlvr },
    { title: " total ug", content: sumQtitiesFree },
    { title: " montant total", content: sumSaleAmount },
    { title: " année", content: selectedYear },
  ];

  return (
    <>
      <Row className="py-2 px-2">
        <Col>
          <DisplayWidget widgets={widgets} />
        </Col>
      </Row>
      <Row>
        <Col sm={6}>
          {saleProductStat.length > 0 ? (
            <ApexChartBar title={` graphe ${selectedYear}`} categories={chartCats} datas={chartDatas} />
          ) : (
            <Alert>stat non disponible</Alert>
          )}
        </Col>
        <Col sm={6}>
          <Card>
            <Card.Body>
              <Dropdown className="float-end" align="end">
                <Dropdown.Toggle as="a" className="cursor-pointer arrow-none card-drop fs-5">
                  {selectedYear}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {React.Children.toArray(
                    years.map((x) => (
                      <Dropdown.Item onClick={() => setSelectedYear(x.year)}>
                        <span onClick={() => setSelectedYear(x.year)}>{x.year}</span>
                      </Dropdown.Item>
                    ))
                  )}
                </Dropdown.Menu>
              </Dropdown>

              <h4 className="header-title text-uppercase fw-bold">ventes</h4>
              <MonthQtitiesProgressBar items={saleProductStat} sumQtities={sumQtitiesDlvr} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default SaledProduct;
