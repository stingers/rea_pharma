import { colToolTip, ReactTableColumnType, TskTable } from "asv-hlps-react/lib/cjs/reacts/tanstack-table";
import { useEffect, useMemo, useState } from "react";

import httpService from "../../services/httpService";

type TobProps = {
  pdtId: number;
  dates?;
};
const DetailStatSaleByProduct = ({ pdtId, dates }: TobProps) => {
  const [tobs, setTobs] = useState([]);
  const [filtereds, setFiltereds] = useState([]);

  const fetchTobs = async () => {
    const { data } = await httpService.postBody({ pdtId: +pdtId, dates }, "statsales/saleproducts/product");
    setTobs(data);
  };

  useEffect(() => {
    fetchTobs();
  }, [dates]);

  const columns: ReactTableColumnType[] = useMemo(
    () => [
      {
        header: "commande",
        accessorKey: "saleRef",
      },
      {
        header: "id",
        accessorKey: "username",
      },
      {
        header: "société",
        accessorKey: "steName",
      },
      {
        header: () => colToolTip("Q.C", "quantité commandée"),
        accessorKey: "qtityOdr",
      },
      {
        header: () => colToolTip("Q.L", "quantité livée"),
        accessorKey: "qtityDlvr",
      },
      {
        header: () => colToolTip("U.G", "unités gratuites"),
        accessorKey: "qtityFree",
      },
    ],
    []
  );
  return (
    <TskTable
      // loading={loading}
      columns={columns}
      data={tobs}

      // getRows={(rows) => setFiltereds(rows.map((row) => row.original))}
      /* initialState={{
        columnVisibility: {
          actions: authService.getAuth({ roles: [...ADM] }),
          del: authService.getAuth({ roles: [...ADM] }),
        },
      }} */
    />
  );
};

export default DetailStatSaleByProduct;
