import { ReactTableColumnType, TskTable } from "asv-hlps-react";
import useTobCrud from "asv-hlps-react/lib/cjs/reacts/hooks/uses/useTobCrud";

import { useMemo } from "react";

import { currencyFormatterCfa, dateFormatter } from "asv-hlps";
import httpService from "../../../services/httpService";

const ListBillWithoutEntry = () => {
  const { tobs, loading, handleSelectedDates } = useTobCrud({ httpService, url: "bills/withoutEntry", params: { withDates: true } });

  const columns: ReactTableColumnType[] = useMemo(
    () => [
      {
        header: "ref",
        accessorKey: "ref",
      },
      {
        header: "date",
        accessorKey: "billDate",
        cell: ({ row }) => dateFormatter(row.original.billDate),
      },
      {
        header: "client",
        accessorKey: "client.ste.name",
        cell: ({ row }) => {
          const client = row.original.client;
          return <span>{client.ste.name}</span>;
        },
      },
      {
        header: "Montant",
        accessorKey: "totalAmount",
        cell: ({ row }) => {
          const tob = row.original;
          // return <span>{convertToCfa(tob.totalAmount, "cfa")}</span>;
          return <span>{currencyFormatterCfa(parseInt(tob.totalAmount))}</span>;
        },
      },
    ],
    []
  );

  return <TskTable tableClass={"table-bordered"} onSelectedDate={handleSelectedDates} columns={columns} data={tobs} loading={loading} />;
};

export default ListBillWithoutEntry;
