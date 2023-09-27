import { currencyFormatter, dateFormatter } from "asv-hlps";
import { ReactTableColumnType, TskTable } from "asv-hlps-react";
import { useMemo, useState } from "react";

import httpService from "../../../services/httpService";
import useCrud from "../../../shared/hooks/useCrud";

const CreditUser = ({ clientId }) => {
  const [status, setStatus] = useState<"back" | "escompte" | "depot">("back");
  const [dates, setDates] = useState(null);
  const { tobs, isLoading, handleSelectedDates } = useCrud({
    httpService,
    url: "usercredits/status",
    withDates: true,
    postParam: { status, userId: clientId },
  });

  const columns: ReactTableColumnType[] = useMemo(
    () => [
      {
        header: "date",
        accessorKey: "createdAt",
        cell: ({ row }) => dateFormatter(row.original.createdAt, "dmy", "/"),
      },
      {
        header: "commande",
        accessorFn: (row) => row.sale?.ref,
      },
      {
        header: "facture",
        accessorFn: (row) => row.sale?.bill?.ref,
      },
      {
        header: "credit",
        accessorKey: "credit",
        cell: ({ row }) => currencyFormatter(row.original.credit),
      },
      {
        header: "a crediter",
        accessorKey: "dueCredit",
        cell: ({ row }) => currencyFormatter(row.original.dueCredit),
      },
      {
        header: "status",
        accessorFn: (row) => row.motive,
      },
    ],
    []
  );

  // return <TskTable loading={isLoading} columns={columns} data={tobs} onSelectedDate={handleSelectedDates} />;
  return <TskTable columns={columns} data={tobs} onSelectedDate={handleSelectedDates} />;
};

export default CreditUser;
