import { ReactTableColumnType, TskTable } from "asv-hlps-react";
import DisplayPopover from "asv-hlps-react/lib/cjs/reacts/displays/display-popover";
import DisplayTooltip from "asv-hlps-react/lib/cjs/reacts/displays/display-tooltip";
import { dateFormatter } from "asv-hlps/lib/cjs/utils";
import React, { useMemo } from "react";

import useQueryCrud from "../../../../hooks/uses/useQueryCrudTest";

const ListProductOnProforma = () => {
  const { data: tobs, isLoading } = useQueryCrud(["productsOnProforma"], "statsales/productsOnProforma");

  // --------------------
  const columns: ReactTableColumnType[] = useMemo(
    () => [
      {
        header: "ref",
        accessorKey: "ref",
      },
      {
        header: "designation",
        accessorKey: "designation",
      },
      {
        header: () => (
          <DisplayTooltip content={"Quantité totale "}>
            <span>Q.T</span>
          </DisplayTooltip>
        ),
        accessorKey: "totalQtities",
        cell: ({ row }) => {
          return +row.original.sumQtityOdr + +row.original.sumQtityFree;
        },
      },
      {
        header: () => (
          <DisplayTooltip content={"Quantité totale commandée "}>
            <span>Q.C</span>
          </DisplayTooltip>
        ),
        accessorKey: "sumQtityOdr",
      },
      {
        header: () => (
          <DisplayTooltip content={"Quantité totale ug"}>
            <span>Q.Ug</span>
          </DisplayTooltip>
        ),
        accessorKey: "sumQtityFree",
      },
      {
        header: () => (
          <DisplayTooltip content={"Nombre de commandes "}>
            <span>N.C</span>
          </DisplayTooltip>
        ),
        accessorKey: "nbSales",
        cell: ({ row }) => {
          const tob = row.original;
          return (
            <DisplayPopover
              title={tob.designation}
              content={
                <table className="table table-striped table-sm ">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Ref</th>
                      <th>Q.C</th>
                      <th>Q.UG</th>
                      <th>Q.T</th>
                    </tr>
                  </thead>
                  <tbody>
                    {React.Children.toArray(
                      <>
                        {tob.sales.map((sale) => (
                          <tr>
                            <td>{dateFormatter(sale.saleDate, "dmy", "/")}</td>
                            <td>{`PRO-${sale.ref}`}</td>
                            <td>{sale.qtityOdr}</td>
                            <td>{sale.qtityFree}</td>
                            <td>{sale.qtityOdr + sale.qtityFree}</td>
                          </tr>
                        ))}
                        <tr>
                          <td colSpan={4}>Total</td>
                          <td>
                            <span className="fw-bold">
                              {tob.sales.reduce((prev, curr) => {
                                return prev + (curr.qtityOdr + curr.qtityFree);
                              }, 0)}
                            </span>
                          </td>
                        </tr>
                      </>
                    )}
                  </tbody>
                </table>
              }>
              {tob.nbSales}
            </DisplayPopover>
          );
        },
      },
    ],
    []
  );
  return (
    <>
      <TskTable headTitle={"produits sur proformas"} loading={isLoading} columns={columns} data={tobs} />
    </>
  );
};

export default ListProductOnProforma;
