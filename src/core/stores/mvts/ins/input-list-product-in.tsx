import { currencyFormatterCfa, dateFormatter, ProductIn } from "asv-hlps";
import { ColEditDel, ReactTableColumnType, TskTable } from "asv-hlps-react";
import DisplayTooltip from "asv-hlps-react/lib/cjs/reacts/displays/display-tooltip";

type TobType = {
  tobs;
  handleDelete;
  handleEdit;
  loading;
  noHeader?: boolean;
  onSelectedDate?;
  withMvt?: boolean;
};

const InputListProductIn = ({ tobs, handleDelete, handleEdit, loading, noHeader, onSelectedDate, withMvt }: TobType) => {
  const colMvt = {
    header: () => (
      <DisplayTooltip content={"Mouvement"}>
        <span>mvt</span>
      </DisplayTooltip>
    ),
    accessorKey: "mvt.ref",
  };
  const columns: ReactTableColumnType[] = [
    {
      header: "date",
      accessorKey: "createdAt",

      cell: ({ row }) => dateFormatter(row.original.createdAt),
    },

    {
      header: "ref",
      accessorKey: "product.ref",
      /* cell: ({ row }) => {
        return <LinkCardProduct product={row.original.product} />;
      }, */
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
      header: () => (
        <DisplayTooltip content={"quantité ajoutée"}>
          <span>qtity</span>
        </DisplayTooltip>
      ),
      accessorKey: "qtityIn",
    },
    {
      header: () => (
        <DisplayTooltip content={"quantité restante"}>
          <span>qtity. R</span>
        </DisplayTooltip>
      ),

      accessorKey: "qtity",
    },
    {
      // header: () =>  colToolTip("p.f", "prix fournisseur"),
      header: () => (
        <DisplayTooltip content={"prix fournisseur"}>
          <span>P.F</span>
        </DisplayTooltip>
      ),

      accessorKey: "pvdPrice",
    },
    {
      header: () => (
        <DisplayTooltip content={"date de fabrication"}>
          <span>fab</span>
        </DisplayTooltip>
      ),
      accessorKey: "manufDate",

      cell: ({ row }) => dateFormatter(row.original.manufDate),
    },
    {
      header: () => (
        <DisplayTooltip content={"date d' expiration"}>
          <span>exp</span>
        </DisplayTooltip>
      ),
      accessorKey: "expirationDate",

      cell: ({ row }) => dateFormatter(row.original.expirationDate),
    },
    {
      header: "Montant",
      accessorKey: "montant",

      cell: ({ row }) => {
        const tob: ProductIn = row.original;
        return currencyFormatterCfa(tob.qtityIn * tob.pvdPrice);
      },
    },
    {
      header: "depot",
      accessorKey: "depot.name",
    },
    { ...ColEditDel({ handleDelete, handleEdit }) },
  ];

  return (
    <>
      <TskTable
        pushTrs={
          <tr>
            <td colSpan={10} className={"text-end"}>
              Montant total estimé
            </td>
            <td>
              {currencyFormatterCfa(
                tobs.reduce((prev, curr) => {
                  return +prev + curr.qtityIn * +curr?.pvdPrice;
                }, 0)
              )}
            </td>
          </tr>
        }
        loading={loading}
        columns={columns}
        data={tobs}
        //
        onSelectedDate={onSelectedDate}
        noHeader={noHeader}
      />
      {/*  */}
    </>
  );
};

export default InputListProductIn;
