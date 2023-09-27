import { Product, dateFormatter } from "asv-hlps";
import { ReactTableColumnType, TskTable } from "asv-hlps-react";
import DisplayTooltip from "asv-hlps-react/lib/cjs/reacts/displays/display-tooltip";
import useTobCrud from "asv-hlps-react/lib/cjs/reacts/hooks/uses/useTobCrud";
import { useMemo } from "react";
import httpService from "../../../../services/httpService";

type TobType = {
  product: Product;
};
const UgProduct = ({ product }: TobType) => {
  const {
    cancelForm,
    tob,
    onAdd,
    modal,
    tobs,
    loading,
    handleDelete,
    handleSelectedDates,
    handleToggle,
    handleEdit,
    closeModal,
    showModal,
    handleRefresh,
    handleSubmit,
  } = useTobCrud({ httpService, url: "saleproducts/ugs", postParam: { pdtId: product.id }, withDates: true });

  const columns: ReactTableColumnType[] = useMemo(
    () => [
      {
        header: "date",
        accessorKey: "createdAt",

        cell: ({ row }) => dateFormatter(row.original.createdAt),
      },
      {
        header: "N° de commande",
        accessorKey: "sale.ref",
      },
      {
        header: "Client",
        accessorKey: "sale.client.ste.name",
      },
      {
        header: () => (
          <DisplayTooltip content={"Quantités commandées"}>
            <span>Q.C</span>
          </DisplayTooltip>
        ),
        accessorKey: "qtityOdr",
      },
      {
        header: () => (
          <DisplayTooltip content={"Quantités delivrées"}>
            <span>Q.D</span>
          </DisplayTooltip>
        ),
        accessorKey: "qtityDlvr",
      },
      {
        header: () => (
          <DisplayTooltip content={"unités gratuites"}>
            <span>U.G</span>
          </DisplayTooltip>
        ),
        accessorKey: "qtityFree",
      },
    ],
    []
  );

  return <TskTable headTitle={"ugs"} onSelectedDate={handleSelectedDates} loading={loading} columns={columns} data={tobs} />;
};

export default UgProduct;
