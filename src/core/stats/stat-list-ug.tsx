import { dateFormatter } from "asv-hlps";
import { colToolTip } from "asv-hlps-react";
import DisplayHeader from "asv-hlps-react/lib/cjs/reacts/displays/display-header";
import ms from "ms";
import React, { useState } from "react";
import { Table } from "react-bootstrap";

import authService from "../../auth/services/authService";
import useQueryPostCrud from "../../hooks/uses/useQueryPostCrud";
import httpService from "../../services/httpService";
import hlpStatSale from "./helpers/hlpStatSale";

import "dayjs/locale/fr";

// require("dayjs/locale/fr");

const StatListUg = () => {
  const date = dateFormatter(new Date());
  // const [tobs, setTobs] = useState([]);
  // const [loading, setLoading] = useState(true);
  const [dates, setDates] = useState({
    fromDate: date,
    toDate: date,
  });
  const user = authService.authUser();

  // --------------------
  const { data: tobs } = useQueryPostCrud({
    httpService,
    keys: ["listStatUgs", user.id, dates],
    url: "statsaleproducts/ugs",
    params: { pvdId: +user.id, dates },
    queryConfigs: { staleTime: ms("10s") },
  });
  // --------------------
  const onSelectedDates = (dates) => {
    setDates(dates);
    // fetchDatas();
  };
  /* const handleRefresh = () => {
    fetchDatas();
  }; */

  const totalQtityFreeFa = (tob) => {
    return Math.ceil(tob.pdt.totalQtityFree * 1.2);
  };
  const qtityFreeFa = (ug) => {
    return Math.ceil(ug.qtityFree * 1.2);
  };

  const onGenPdf = (action: string) => {
    hlpStatSale.genListUgPdf(action, tobs, user, dates);
  };

  const onSearch = (prop) => {
    return prop;
  };

  const onGenExcel = () => {};
  // return <TskTable loading={loading} columns={columns} data={tobs}  />;
  return (
    <>
      <DisplayHeader
        headTitle={`Campagne UG ${user.ste.name}  du ${dateFormatter(dates.fromDate, "dmy", "/")} au ${dateFormatter(
          dates.toDate,
          "dmy",
          "/"
        )}`}
        // search={onSearch}
        countLength={tobs?.length}
        onSelectedDate={onSelectedDates}
        onGenExcel={onGenExcel}
        onGenPdf={onGenPdf}
      />
      <div className="table-responsive">
        <Table className="table-sm table-striped">
          <thead className="text-uppercase">
            <tr>
              <th>#</th>
              <th>Date</th>
              <th>commande</th>
              <th>client</th>
              <th>{colToolTip("Q.D", "QUantité vendue")}</th>
              <th>{colToolTip("Q.D", "QUantité ug")}</th>
              <th>{colToolTip("FA", "FA à 20%")}</th>
              <th>montant</th>
            </tr>
          </thead>
          <tbody>
            {React.Children.toArray(
              (tobs || []).map((tob) => (
                <>
                  <tr className="fw-bold">
                    <td colSpan={4}>{tob.pdt.designation}</td>
                    <td>{tob.pdt.totalQtityDlvr}</td>
                    <td>{tob.pdt.totalQtityFree}</td>
                    <td>{totalQtityFreeFa(tob)}</td>
                    <td>{Math.ceil(totalQtityFreeFa(tob) * tob.pdt.stores[0].pghtPrice)}</td>
                  </tr>
                  {React.Children.toArray(
                    (tob.ugs || []).map((ug, i) => (
                      <tr>
                        <td>{i + 1}</td>
                        <td>{dateFormatter(ug.saleDate, "dmy", "/")}</td>
                        <td>{ug.saleRef}</td>
                        <td>{ug.steName}</td>
                        <td>{ug.qtityDlvr}</td>
                        <td>{ug.qtityFree}</td>
                        <td>{qtityFreeFa(ug)}</td>
                        <td>{Math.ceil(qtityFreeFa(ug) * tob.pdt.stores[0].pghtPrice)}</td>
                      </tr>
                    ))
                  )}
                </>
              ))
            )}
          </tbody>
        </Table>
      </div>
    </>
  );
};

export default StatListUg;
