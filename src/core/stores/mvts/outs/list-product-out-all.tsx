import { dateFormatter } from "asv-hlps";
import { ReactTableColumnType, TskTable } from "asv-hlps-react";
import DisplayPopover from "asv-hlps-react/lib/cjs/reacts/displays/display-popover";
import useTobCrud from "asv-hlps-react/lib/cjs/reacts/hooks/uses/useTobCrud";

import { useMemo } from "react";

import httpService from "../../../../services/httpService";

const ListProductOutAll = () => {
  const { tobs, loading, handleSelectedDates } = useTobCrud({ httpService, url: "productouts/all", params: { withDates: true } });

  const columns: ReactTableColumnType[] = useMemo(
    () => [
      {
        header: "date",
        accessorKey: "createdAt",

        cell: ({ row }) => dateFormatter(row.original.createdAt, "dmy", "/"),
      },
      {
        header: "ref",
        accessorKey: "product.ref",
      },
      {
        header: "designation",
        accessorKey: "product.designation",
      },
      {
        header: "N° Lot",
        accessorKey: "lot",
      },
      {
        header: "pght",
        accessorKey: "product.stores[0].pght",
      },
      {
        header: "qtités",
        accessorKey: "qtity",
      },
      {
        header: "motif",
        accessorKey: "reason.name",
      },
      {
        header: "agence",
        accessorKey: "product.agcy.ste.name",
      },
      {
        header: "auteur",
        accessorKey: "author.username",
        cell: ({ row }) => (
          <DisplayPopover title={row.original.author.username} content={row.original.author.fullname}>
            {row.original.author.username}
          </DisplayPopover>
        ),
      },
    ],
    []
  );

  return <TskTable onSelectedDate={handleSelectedDates} headTitle={"les sorties"} columns={columns} data={tobs} loading={loading} />;
};

export default ListProductOutAll;
