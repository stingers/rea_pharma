import { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";
import { Card } from "react-bootstrap";

type TobType = {
  categories: string[];
  datas: number[];
  colors?: string[];
  title?: any;
  type?:
    | "area"
    | "line"
    | "bar"
    | "pie"
    | "donut"
    | "radialBar"
    | "scatter"
    | "bubble"
    | "heatmap"
    | "candlestick"
    | "boxPlot"
    | "radar"
    | "polarArea"
    | "rangeBar"
    | "rangeArea"
    | "treemap";
};
// components

const ApexChartBar = ({ categories, datas, title = "stats", colors = ["#3bafda"], type = "bar" }: TobType) => {
  const apexOpts: ApexOptions = {
    chart: {
      height: 265,
      // type: type,
      type: "bar",
      stacked: true,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "25%",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
      // colors: ["black"],
    },
    legend: {
      show: false,
    },
    // colors: ["#3bafda", "#e3eaef"],
    colors: colors,
    xaxis: {
      // categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      categories: categories,
      axisBorder: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        formatter: function (val) {
          return `${val}`;
        },
        offsetX: -15,
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return `${val}`;
        },
      },
    },
  };

  const apexData = [
    {
      name: "Valeur",
      data: datas,
    },
    /* {
      name: "Projection",
      data: [89, 40, 32, 65, 59, 80, 81, 56, 89, 40, 65, 59],
    }, */
  ];

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

        <h4 className="header-title text-uppercase fw-bold">{title}</h4>

        <div className="text-center mt-3">
          {/* <Row className="pt-2">
            <Col className="col-4">
              <ChartStatistics title="Target" stats="$12,365" />
            </Col>
            <Col className="col-4">
              <ChartStatistics title="Last week" stats="$365" icon="fe-arrow-down" variant="danger" />
            </Col>
            <Col className="col-4">
              <ChartStatistics title="Last Month" stats="$8,501" icon="fe-arrow-up" variant="success" />
            </Col>
          </Row> */}

          <div dir="ltr">
            <Chart options={apexOpts} series={apexData} type={"bar"} height={265} className="apex-charts" />
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ApexChartBar;
