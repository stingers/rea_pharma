import { ReactTableColumnType, TskTable } from "asv-hlps-react";
import { dateFormatter } from "asv-hlps/lib/cjs/utils";
import { useMemo } from "react";

const DetailDeliveryDone = ({ delivery }) => {
  const columns: ReactTableColumnType[] = useMemo(
    () => [
      {
        header: "Date",
        accessorKey: "saleDate",
        cell: ({ row }) => dateFormatter(row.original.saleDate),
        //
      },
      {
        header: "ref",
        accessorKey: "ref",
        //
      },
      {
        header: "Id Client",
        accessorKey: "client.username",
        //
      },
      {
        header: "société",
        accessorKey: "client.ste.name",
        //
      },
    ],
    []
  );
  return (
    <TskTable
      // loading={loading}
      columns={columns}
      data={delivery.sales}
      noHeader
    />
  );
};

export default DetailDeliveryDone;
