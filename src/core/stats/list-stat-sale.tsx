import { currencyFormatter, currencyFormatterCfa, displayDateRangeFr, User } from "asv-hlps";
import { colToolTip, ReactTableColumnType, TskTable, useQueryPost } from "asv-hlps-react";
import LinkTob from "asv-hlps-react/lib/cjs/reacts/links/link-tob";
import { useEffect, useMemo, useState } from "react";

import authService from "../../auth/services/authService";
import excelService from "../../services/excelService";
import httpService from "../../services/httpService";
import DisplayDate from "../../shared/displays/display-date";
import DisplayWidget, { WidgetType } from "../../shared/displays/display-widget";
import BtnOrderProduct from "../stores/products/btn-order-product";
import hlpProduct from "../stores/products/helpers/hlpProduct";
import DetailStatSaleByProduct from "./detail-stat-sale-by-product";
import hlpStatSale from "./helpers/hlpStatSale";

export const reduceSum = (tobs: any[], property: string): number => {
  return tobs.reduce((prev, curr) => {
    return +prev + +curr[property];
  }, 0);
};

const ListStatSale = () => {
  const [tobs, setTobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dates, setDates] = useState(null);
  const [stat, setStat] = useState(null);
  const [filtereds, setFiltereds] = useState([]);
  const user: User = authService.authUser();
  // --------------------
  const getTitle = user.ste.grp.code.toLocaleLowerCase() !== "ph" ? "ventes" : "achats";
  // --------------------
  const { data, isLoading } = useQueryPost({
    httpService,
    keys: ["listStatSales", dates],
    url: "statsales",
    postParam: {
      dates,
      userId: user.id,
    },
  });

  useEffect(() => {
    if (data) {
      setTobs(data?.saleProducts);
      setStat(data?.nbSales);
    }
  }, [dates]);

  const onSelectedDates = (dates) => {
    setDates(dates);

    // fetchDatas();
  };

  // --------------------
  /*  const fetchDatas = async () => {
    const { data } = await httpService.postBody({ dates, userId: user.id }, "statsales");
    setLoading(false);
    setTobs(data?.saleProducts);
    setStat(data?.nbSales);
  };
  useEffect(() => {
    fetchDatas();
    return () => {};
  }, [dates]);
  // --------------------
 
  const handleRefresh = () => {
    fetchDatas();
  };
 */
  const widgets: WidgetType[] = [
    { title: colToolTip(getTitle, "nombre de ventes"), content: <p className=" d-inline text-center">{+stat}</p> },
    {
      title: colToolTip(getTitle, "nombre de ventes"),
      content: <p className=" d-inline text-center">{+reduceSum(filtereds, "nbSales")}</p>,
    },
    { title: colToolTip("nb. Produits", "nombre de products"), content: filtereds.length },
    { title: colToolTip("Total Q.C", "total quantité commandée"), content: hlpStatSale.totalQtityOdr(filtereds) },
    { title: colToolTip("Total Q.D", "total quantité livrée"), content: hlpStatSale.totalQtityDlvr(filtereds) },
    { title: "total ug", content: hlpStatSale.totalQtityFree(filtereds) },
    { title: colToolTip("montant", "Motnat total"), content: currencyFormatterCfa(hlpStatSale.totalAmountQtityOdr(filtereds)) },
    { title: "Date", content: <DisplayDate dates={dates} /> },
  ];

  const onGenExcel = (event) => {
    excelService.exportAsExcelFileByTableId(
      "statTable",
      `stat_vente_du_${displayDateRangeFr(dates.fromDate, dates.toDate).replace(/\s/g, "_")}`
    );
  };

  const columns: ReactTableColumnType[] = useMemo(
    () => [
      {
        header: "ref",
        accessorKey: "product.ref",
      },
      {
        header: "designation",
        accessorKey: "product.designation",
        cell: ({ row }) => {
          const tob = row.original;
          return (
            <>
              {tob.product.designation}
              {user.ste.grp.code.toLocaleLowerCase() === "ph" && <BtnOrderProduct product={tob.product} />}
            </>
          );
        },
      },
      {
        header: () => colToolTip("N.C", "nombre de commande"),
        accessorKey: "nbSales",
        cell: ({ row }) => {
          const tob = row.original;
          return (
            <LinkTob
              tob={tob}
              withModal={{
                size: "lg",
                title: (
                  <>
                    <span className="fs-5">{tob.product.designation}</span>
                    <small className="text-success ms-2 ">{`${tob.nbSales} cmd`}</small>
                  </>
                ),
                content: <DetailStatSaleByProduct pdtId={tob.product.id} dates={dates} />,
              }}>
              <span className="p-2 fw-bold">{tob.nbSales}</span>
            </LinkTob>
          );
        },
      },
      {
        header: "stock",
        accessorKey: "stock",
        cell: ({ row }) => currencyFormatter(hlpProduct.stock(row.original.product, "all")),

        auth: authService.getAuth({ client: { roles: ["ceo"] } }),
      },
      {
        header: () => colToolTip("Q.T", "Quantité total"),
        accessorKey: "qt",
        cell: ({ row }) => {
          const tob = row.original;
          return currencyFormatter(+tob.sumQtityOdr + +tob.sumQtityFree);
        },
      },
      {
        header: () => colToolTip("Q.C", "Quantité commandée"),
        accessorKey: "sumQtityOdr",
        cell: ({ row }) => currencyFormatter(+row.original.sumQtityOdr),
      },
      {
        header: () => colToolTip("Q.D", "Quantité delivrée"),
        accessorKey: "sumQtityDlvr",
        cell: ({ row }) => currencyFormatter(+row.original.sumQtityDlvr),
      },
      {
        header: () => colToolTip("U.G", "Unité gratuite"),
        accessorKey: "sumQtityFree",
        cell: ({ row }) => currencyFormatter(+row.original.sumQtityFree),
      },
      {
        header: "montant",
        accessorKey: "sumAmountQtityDlvr",
        cell: ({ row }) => <div className="text-end">{currencyFormatter(+row.original.sumAmountQtityDlvr)}</div>,
      },
    ],
    [dates]
  );

  return (
    <>
      <DisplayWidget widgets={widgets} wrapCard />
      <TskTable
        headTitle={getTitle}
        tableId="statTable"
        // loading={isLoading}
        columns={columns}
        data={tobs}
        onSelectedDate={onSelectedDates}
        onGenExcel={onGenExcel}
        getRows={(rows) => setFiltereds(rows.map((row) => row.original))}
        // onAsyncSearch={handleAsyncSearch}
        //
      />
    </>
  );
};

export default ListStatSale;
