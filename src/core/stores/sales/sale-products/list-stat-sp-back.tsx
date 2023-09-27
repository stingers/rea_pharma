import { ReactTableColumnType, TskTable } from "asv-hlps-react";
import useTobCrud from "asv-hlps-react/lib/cjs/reacts/hooks/uses/useTobCrud";

import dayjs from "dayjs";
import { useMemo } from "react";
import { Col, Row } from "react-bootstrap";

import { DocDefinition } from "../../../../pdfs/DocDefinition";
import { PdfProductTables } from "../../../../pdfs/products/PdfProductTables";
import httpService from "../../../../services/httpService";
import pdfService from "../../../../services/pdfService";
import ChartStatSpBack from "./chart-stat-sp-back";

const ListStatSpBack = () => {
  const { tobs, dates, loading, handleRefresh, handleSelectedDates } = useTobCrud({
    // const { tobs, dates, isLoading, handleRefresh, handleSelectedDates } = useQueryCrud({
    httpService,
    url: "statsaleproducts/backs",
    params: { withDates: true },
  });

  // console.log(tobs);

  /* let categories: string[] = [];
  for (const cat of [...tobs.]) {
    categories.push(cat.name);
  } */
  const countByMotifs = tobs["countByMotifs"] || [];
  const countByProducts = tobs["countByProducts"] || [];
  const categories = countByMotifs.map((x) => {
    return x.name;
  });

  const datas = countByMotifs.map((x) => {
    return +x.nbr;
  });
  const fromDate = (dates) => {
    if (!dates) {
      return dayjs().format("DD-MM-YYYY");
      // return dayjs(new Date()).format("DD-MM-YYYY");
    } else {
      return dates.fromDate;
    }
  };

  const toDate = (dates) => {
    if (!dates) {
      return dayjs().format("DD-MM-YYYY");
      // return dayjs(new Date()).format("DD-MM-YYYY");
    } else {
      return dates.toDate;
    }
  };

  const onGenPdf = (action: string) => {
    pdfService.generatePdf(
      action,
      DocDefinition.generic(
        `Quantités non conforme du ${fromDate(dates)} au ${toDate(dates)}`,
        PdfProductTables.listStatSaleProductBackTable(countByProducts)
      )
    );
  };

  const columns: ReactTableColumnType[] = useMemo(
    () => [
      {
        header: "designation",
        accessorKey: "designation",

        /* cell: ,
      auth: ; */
      },
      {
        header: "motif",
        accessorKey: "name",

        /* cell: ,
      auth: ; */
      },
      {
        header: "quantité",
        accessorKey: "nbr",

        /* cell: ,
      auth: ; */
      },
    ],
    []
  );
  return (
    <Row>
      <Col>{countByMotifs.length > 0 && <ChartStatSpBack title={"stat sur motifs retour"} categories={categories} datas={datas} />}</Col>
      <Col sm={countByMotifs.length ? 8 : 12}>
        <TskTable
          headTitle={"etat des retours"}
          onSelectedDate={handleSelectedDates}
          loading={loading}
          // loading={isLoading}
          columns={columns}
          onGenPdf={onGenPdf}
          data={tobs["countByProducts"]}
        />
      </Col>
    </Row>
  );
};

export default ListStatSpBack;
