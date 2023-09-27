import { ReactTableColumnType, TskTable, useQueryPost } from "asv-hlps-react";
import LinkTob from "asv-hlps-react/lib/cjs/reacts/links/link-tob";
import { dateFormatter } from "asv-hlps/lib/cjs/utils";
import dayjs from "dayjs";
import { useMemo, useState } from "react";

import httpService from "../../services/httpService";
import DetailDeliveryDone from "./detail-delivery-done";

const ListDeliveryDone = () => {
  const [dates, setDates] = useState(null);
  // --------------------
  const { data: tobs, isLoading } = useQueryPost({
    httpService,
    keys: ["listdeliveriedones", dates],
    url: "saledeliveries/dones",
    postParam: { dates },
  });

  const onSelectedDates = (dates) => {
    setDates(dates);
  };

  // --------------------
  const driverHours = (tob) => {
    const startDate = dayjs(tob.startDate).format("HH:mm");
    const endDate = dayjs(tob.endDate).format("HH:mm");
    return startDate + " - " + endDate || "sans transport";
  };
  const columns: ReactTableColumnType[] = useMemo(
    () => [
      {
        header: "date",
        accessorKey: "createdAt",
        cell: ({ row }) => dateFormatter(row.original.createdAt),
      },
      {
        header: "ref",
        accessorKey: "ref",
        cell: ({ row }) => {
          const tob = row.original;
          return (
            <LinkTob
              withModal={{ size: "lg", title: `${tob.ref} (${tob.driver.fullname})`, content: <DetailDeliveryDone delivery={tob} /> }}
              tob={tob}>
              {row.original.ref}
            </LinkTob>
          );
        },
      },
      {
        header: "chauffeur",
        accessorKey: "driver.fullname",
      },
      {
        header: "vehicule",
        accessorKey: "vehicle",
      },
      {
        header: "horaire",
        accessorKey: "horaire",
        cell: ({ row }) => driverHours(row.original),
      },
      {
        header: "kms",
        // accessorKey: "endVehiculeKms | startVehiculeKms",
        accessorFn: (tob) => tob.endVehiculeKms || tob.startVehiculeKms,
        cell: ({ row }) => {
          const tob = row.original;
          return `${+tob.endVehiculeKms} - ${+tob.startVehiculeKms}`;
        },
      },
      {
        header: "diff",
        accessorKey: "diff",
        cell: ({ row }) => {
          const tob = row.original;
          return <span className="fw-bold">{tob.endVehiculeKms - tob.startVehiculeKms}</span>;
        },
      },
    ],
    []
  );
  // --------------------
  return (
    <TskTable
      onSelectedDate={onSelectedDates}
      headTitle={"livaisons terminées"}
      // loading={isLoading}
      columns={columns}
      data={tobs || []}
      //
    />
  );
};

export default ListDeliveryDone;
