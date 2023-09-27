import { ApexOptions } from "apexcharts";
import { getArrayOfRandomColor, randomHexColor } from "asv-hlps";
import React from "react";
import Chart from "react-apexcharts";

export interface ChartDonutType {
  // labels: string[];
  // colors: string[];
  tobs: any[];
  height?: number;
  labelProp: string;
  dataProp: string;
}

const ChartDonut: React.FC<ChartDonutType> = ({ tobs, labelProp, dataProp, height = 307 }) => {
  const labels = tobs.map((x) => {
    return x[labelProp];
  });
  const datas = tobs.map((x) => {
    return +x[dataProp];
  });

  const colors = getArrayOfRandomColor(tobs.length);

  const apexOpts: ApexOptions = {
    chart: {
      height: height,
      type: "donut",
      // type: "pie",
    },
    series: datas,
    legend: {
      show: true,
      position: "bottom",
      horizontalAlign: "center",
      floating: false,
      fontSize: "10px",
      offsetX: 0,
      offsetY: 7,
    },
    labels: labels,
    colors: colors,
    responsive: [
      {
        breakpoint: 600,
        options: {
          chart: {
            height: 240,
          },
          legend: {
            show: true,
          },
        },
      },
    ],
  };

  const apexData = datas;

  return (
    <div className="text-center mt-3">
      <div dir="ltr">
        <Chart options={apexOpts} series={apexData} type="donut" height={height} className="apex-charts" />
      </div>
    </div>
  );
};

export default ChartDonut;
