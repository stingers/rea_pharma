import { currencyFormatterCfa, ProductInOut } from "asv-hlps";
import { ColEditDel, colToolTip, ReactTableColumnType, TskTable } from "asv-hlps-react";
import { useMemo } from "react";

import LinkCardProduct from "../../products/link-card-product";

type TobType = {
  tobs;
  handleDelete;
  handleEdit?;
  loading;
  onSelectedDate?;
  noHeader?;
  handleRefresh?;
  withMvt?: boolean;
};

const InputListProductOut = ({ tobs, handleDelete, handleEdit, loading, handleRefresh, noHeader, withMvt }: TobType) => {
  // --------------------
  const getTotalPriceEstimed = () => {
    if (tobs) {
      return (
        tobs.reduce((prev, curr: ProductInOut) => {
          return prev + +curr?.qtity * +curr?.product?.stores[0]?.pghtPrice;
        }, 0) || 0
      );
    }
    return 0;
  };
  const colMvt = {
    header: () => colToolTip("mvt", "mouvement"),
    accessorKey: "mvt.ref",
  };

  // --------------------
  const columns: ReactTableColumnType[] = useMemo(
    () => [
      {
        header: "ref",
        accessorKey: "product.ref",
        cell: ({ row }) => {
          return <LinkCardProduct product={row.original.product} />;
        },
      },
      {
        header: "designation",
        accessorKey: "product.designation",

        /* cell: ({ row }) => {
          return <LinkProductAddit product={row.original.product} />;
        }, */
      },

      {
        header: "lot",
        accessorKey: "lot",
      },

      {
        header: () => colToolTip("q.s", "quantité sortie"),
        accessorKey: "qtity",
      },
      {
        header: "pght",
        accessorKey: "product.stores[0].pghtPrice",
      },
      {
        header: () => colToolTip("M.T", "Montant total"),
        accessorKey: "productTotalAmount",

        cell: ({ row }) => {
          const tob: ProductInOut = row.original;
          return currencyFormatterCfa(+tob.qtity * +tob.product.stores[0].pghtPrice || 0);
        },
      },
      {
        header: "raison",
        accessorKey: "reason.name",
      },

      { ...ColEditDel({ handleDelete, handleEdit }) },
    ],
    []
  );

  return (
    <>
      <TskTable
        pushTrs={
          <tr>
            <td colSpan={6} className={"text-right fw-bold"}>
              Montant estimé
            </td>
            <td className={"text-right fw-bold"}>{currencyFormatterCfa(+getTotalPriceEstimed() || 0)}</td>
          </tr>
        }
        loading={loading}
        columns={withMvt ? [...columns.splice(0, 0, colMvt)] : columns}
        data={tobs}
        noHeader={noHeader}
      />
    </>
  );
};

export default InputListProductOut;
