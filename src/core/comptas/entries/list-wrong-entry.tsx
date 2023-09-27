import { ReactTableColumnType, TskTable } from "asv-hlps-react";
import useTobCrud from "asv-hlps-react/lib/cjs/reacts/hooks/uses/useTobCrud";

import { dateFormatter } from "asv-hlps/lib/cjs/utils";
import httpService from "../../../services/httpService";

const ListWrongEntry = () => {
  const { tobs, loading, handleSelectedDates } = useTobCrud({ httpService, url: "entrylines/wrongEntries", params: { withDates: true } });

  const columns: ReactTableColumnType[] = [
    {
      header: "date",
      accessorKey: "entryDate",

      cell: ({ row }) => dateFormatter(row.original.entryDate),
    },
    {
      header: "ref",
      accessorKey: "ref",

      // cell: ({ row }) => dateFormatter(row.original.entryDate,"dmy", "/"),
    },
    {
      header: "pièce",
      accessorKey: "proof",

      // cell: ({ row }) => dateFormatter(row.original.entryDate,"dmy", "/"),
    },
    {
      header: "cat",
      accessorKey: "catName",

      // cell: ({ row }) => dateFormatter(row.original.entryDate,"dmy", "/"),
    },
  ];

  return <TskTable onSelectedDate={handleSelectedDates} columns={columns} data={tobs} loading={loading} />;
};

export default ListWrongEntry;
