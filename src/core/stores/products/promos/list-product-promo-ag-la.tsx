import { dateFormatter } from "asv-hlps";
import { ColEditDel, ColToggle, ReactTableColumnType, TskTable } from "asv-hlps-react";
import DisplayTooltip from "asv-hlps-react/lib/cjs/reacts/displays/display-tooltip";
import { useMemo } from "react";

const ListProductPromoAgLa = ({ tobs, handleToggle, handleEdit, handleDelete }) => {
  const columns: ReactTableColumnType[] = useMemo(
    () => [
      { header: "ref", accessorKey: "store.product.ref" },
      { header: "designation", accessorKey: "store.product.designation" },
      {
        header: "debut",
        accessorKey: "startDate",
        cell: ({ row }) => <span>{dateFormatter(row.original.startDate, "dmy", "/")}</span>,
      },
      { header: "fin", accessorKey: "endDate", cell: ({ row }) => <span>{dateFormatter(row.original.endDate, "dmy", "/")}</span> },
      {
        header: () => (
          <DisplayTooltip content={"quantité en promo"}>
            <>Q.P</>
          </DisplayTooltip>
        ),
        accessorKey: "qtityFree",
      },
      {
        header: () => (
          <DisplayTooltip content={"quantité achetée"}>
            <>Q.A</>
          </DisplayTooltip>
        ),
        accessorKey: "qtityPromo",
      },
      {
        header: () => (
          <DisplayTooltip content={"laboratoire"}>
            <span>labo</span>
          </DisplayTooltip>
        ),
        cell: ({ row }) => {
          const tob = row.original;
          return <span className="cursor-pointer fw-bold">{tob.store.product.labo.ste.name}</span>;
        },
        accessorKey: "store.product.labo.ste.name",
      },
      {
        header: () => (
          <DisplayTooltip content={"agence"}>
            <span>agence</span>
          </DisplayTooltip>
        ),
        cell: ({ row }) => {
          const tob = row.original;
          return (
            // <span className="cursor-pointer fw-bold" onClick={() => showPromoBy({ tob, ste: "agcy" })}>
            <span className="cursor-pointer fw-bold">{tob.store.product.agcy.ste.name}</span>
          );
        },
        accessorKey: "store.product.agcy.ste.name",
      },
      {
        ...ColToggle({
          header: () => (
            <DisplayTooltip content={"active"}>
              <i className="fas fa-check-double"></i>
            </DisplayTooltip>
          ),
          accessorKey: "isActive",
          handleToggle,
        }),
      },

      { ...ColEditDel({ handleDelete, handleEdit }) },
    ],
    [handleDelete]
  );
  return (
    <TskTable
      // headerPills={pills}

      // tob={tob}
      // onAdd={onAdd}
      // onSelectedDate={handleSelectedDates}
      data={tobs}
      // loading={loading}
      headTitle={" promos"}
      columns={columns}
    />
  );
};

export default ListProductPromoAgLa;
