import { reduceSum } from "asv-hlps";
import { ReactTableColumnType, TskTable } from "asv-hlps-react";

import { useEffect, useMemo, useState } from "react";

import httpService from "../../../../services/httpService";

const ListProductInArrival = () => {
  const [tobs, setTobs] = useState([]);
  const [loading, setLoading] = useState(true);
  // const [dates, setDates] = useState(null);
  // --------------------
  const fetchDatas = async () => {
    // setLoading(true);
    const { data: tobs } = await httpService.get("productins/arrival");
    setLoading(false);
    setTobs(tobs);
  };
  useEffect(() => {
    fetchDatas();
    return () => {};
  }, []);
  // --------------------
  /* const onSelectedDates = (dates) => {
      setDates(dates);
      fetchDatas();
    };
    const handleRefresh = () => {
      fetchDatas();
    }; */
  // const { data: tobs, error, isLoading } = useQueryCrud(["productsArrivals"], "productins/arrival", { staleTime: ms("10s") });

  const columns: ReactTableColumnType[] = useMemo(
    () => [
      {
        header: "ref",
        accessorKey: "ref",

        /*  cell: ,
      auth: ; */
      },
      {
        header: "designation",
        accessorKey: "designation",

        /*  cell: ,
      auth: ; */
      },
      {
        header: "quantité",
        accessorKey: "qtities",
        cell: ({ row }) => <span className="fw-bold">{row.original.qtities}</span>,

        /*  cell: ,
      auth: ; */
      },
    ],
    []
  );

  return (
    <TskTable
      headTitle={"arrivage"}
      loading={loading}
      columns={columns}
      data={tobs}
      pushTrs={
        <tr className="fw-bold">
          <td colSpan={3} className="text-end">
            Total
          </td>
          <td>{reduceSum(tobs || [], "qtities")}</td>
        </tr>
      }
      //
    />
  );
};

export default ListProductInArrival;
