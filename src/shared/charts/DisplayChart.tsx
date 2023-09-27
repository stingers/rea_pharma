import React from "react";
import { Card } from "react-bootstrap";

import ChartDonut, { ChartDonutType } from "./ChartDonut";

interface DisplayChartType extends ChartDonutType {
  title: string;
}

const DisplayChart: React.FC<DisplayChartType> = ({ title, tobs, labelProp, dataProp, height }) => {
  return (
    <Card>
      <Card.Body>
        {/* <Dropdown className="float-end" align="end">
          <Dropdown.Toggle as="a" className="cursor-pointer arrow-none card-drop">
            <i className="mdi mdi-dots-horizontal"></i>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item>Settings</Dropdown.Item>
            <Dropdown.Item>Download</Dropdown.Item>
            <Dropdown.Item>Upload</Dropdown.Item>
            <Dropdown.Item>Action</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown> */}

        <h4 className="header-title text-capitalize">{title}</h4>
        <ChartDonut tobs={tobs} labelProp={labelProp} dataProp={dataProp} height={height} />
        {/* <Row className="mt-3">
          <Col className="col-4">
            <ChartStatistics title="Target" stats="$8712" />
          </Col>
          <Col className="col-4">
            <ChartStatistics title="Last week" stats="$523" icon="fe-arrow-up" variant="success" />
          </Col>
          <Col className="col-4">
            <ChartStatistics title="Last Month" stats="$965" icon="fe-arrow-down" variant="danger" />
          </Col>
        </Row> */}
      </Card.Body>
    </Card>
  );
};

export default DisplayChart;
