import { dateFormatter } from "asv-hlps";
import { useState } from "react";

import { colToolTip } from "asv-hlps-react";
import DisplayHeader from "asv-hlps-react/lib/cjs/reacts/displays/display-header";
import React from "react";
import useQueryPostCrud from "../../../../hooks/uses/useQueryPostCrud";
import { CpaDefinition } from "../../../../pdfs/CpaDefinition";
import { PdfTables } from "../../../../pdfs/PdfTables";
import httpService from "../../../../services/httpService";
import pdfService from "../../../../services/pdfService";

type TobType = {
  pvdId?: any;
};

// const ListUgPromo = ({ pvdId }: TobType) => {
const ListUgPromo = () => {
  /* const {
    tobs,
    loading,
    handleRefresh,
    handleSelectedDates,
  } = useCrud({ httpService, url: "statsaleproducts/ugsall", withDates: true }); */

  const date = dateFormatter(new Date(), "ymd", "-");
  const [dates, setDates] = useState({ fromDate: date, toDate: date });
  const { data: tobs } = useQueryPostCrud({
    httpService,
    keys: ["statsaleproducts", dates],
    url: "statsaleproducts/ugsall",
  });

  const onGenPdf = (action: string) => {
    let listUgs = [];
    // for (const tob of this.filteredTobs) {
    for (const tob of tobs) {
      // const ugs = [];
      listUgs.push({
        date: "",
        commande: tob.pdt.designation,
        client: "",
        qtityDlvr: tob.pdt.totalQtityDlvr,
        qtityFree: tob.pdt.totalQtityFree,
        approachCost: "20%",
        dueUg: Math.ceil(tob.pdt.totalQtityFree * 1.2),
      });
      for (const ug of tob.ugs) {
        listUgs.push({
          date: dateFormatter(ug.saleDate, "dmy", "/"),
          commande: ug.saleRef,
          client: ug.steName,
          qtityDlvr: ug.qtityDlvr,
          qtityFree: ug.qtityFree,
          approachCost: "20%",
          dueUg: Math.ceil(ug.qtityFree * 1.2),
        });
      }
      // listUgs.push(ugs);
    }
    // listUgs = Array.prototype.concat(...listUgs);

    const ugsText: string[] = [
      // `campagne agence ${user?.ste?.name}`,
      `campagne agence`,
      `détails des ug distribuées du ${dateFormatter(dates?.fromDate, "dmy", "/")} au  ${dateFormatter(dates?.toDate, "dmy", "/")}`,
    ];

    pdfService.generatePdf(
      // action, CpaDefinition.genericWithTitleArray(ugsText, PdfTables.qtityFreeTable(listUgs)));
      action,
      CpaDefinition.genericUgs(ugsText, PdfTables.qtityFreeTable(listUgs))
    );
  };

  const onSelectedDates = (dates) => {
    setDates(dates);
    // fetchDatas();
  };

  const onSearch = (value) => {
    console.log(value);
  };

  /* const columns: ReactTableColumnType[] = useMemo(
    () => [
      {
        accessorFn: (row) => row.pdt.designation,

        cell: ({ row }) => row.original.pdt.designation,
      },
    ],
    []
  ); */
  return (
    <>
      <DisplayHeader
        headTitle="gestion des ug"
        onGenPdf={onGenPdf}
        onSelectedDate={onSelectedDates}
        setGlobalFilter={onSearch}
        countLength={tobs?.length}
      />
      <table className="table table-striped table-sm table-bordered">
        <thead className="text-uppercase">
          <tr>
            <th style={{ width: "3%" }} scope="col">
              #
            </th>
            <th style={{ width: "10%" }}>date</th>
            <th>commande</th>
            <th>client</th>
            <th>{colToolTip("q.d", "Quantité délivrée")}</th>
            <th>{colToolTip("q.ug", "Quantité unité gratuite")}</th>
          </tr>
        </thead>
        <tbody>
          {React.Children.toArray(
            (tobs || []).map((tob) => (
              <>
                <tr>
                  <th colSpan={3}>{`${tob.pdt.designation} (${tob.pdt.steName})`}</th>
                  <th className="text-end">
                    <span>{"Total"}</span>
                  </th>
                  <th>{tob.pdt.totalQtityDlvr}</th>
                  <th>{tob.pdt.totalQtityFree}</th>
                </tr>
                {React.Children.toArray(
                  (tob.ugs || []).map((ug, index) => (
                    <>
                      <tr>
                        <td>{index + 1}</td>
                        <td>{dateFormatter(ug.saleDate, "dmy", "/")}</td>
                        <td>{ug.saleRef}</td>
                        <td>{ug.steName}</td>
                        <td>{ug.qtityDlvr}</td>
                        <td>{ug.qtityFree}</td>
                      </tr>
                      <tr></tr>
                    </>
                  ))
                )}
                <tr></tr>
              </>
            ))
          )}
        </tbody>
      </table>
      {/* <TskTable loading={loading} columns={columns} data={tobs}  />; */}
    </>
  );
};

export default ListUgPromo;
