import { currencyFormatterCfa, dateFormatter, Product } from "asv-hlps";
import { ReactTableColumnType, TskTable } from "asv-hlps-react";
import useTobCrud from "asv-hlps-react/lib/cjs/reacts/hooks/uses/useTobCrud";
import { useMemo } from "react";

import httpService from "../../../../services/httpService";

type TobType = {
  product: Product;
};

const PriceProduct = ({ product }: TobType) => {
  const { tobs, loading } = useTobCrud({ httpService, url: "productins/prices", getByParam: product.id });
  const columns: ReactTableColumnType[] = useMemo(
    () => [
      {
        header: "date",
        accessorKey: "createdAt",

        cell: ({ row }) => dateFormatter(row.original.createdAt),
      },
      {
        header: "référence mouvement",
        accessorKey: "mvt.ref",
      },
      {
        header: "prix fournisseur",
        accessorKey: "pvdPrice",

        cell: ({ row }) => currencyFormatterCfa(row.original.pvdPrice || 0),
      },
    ],
    []
  );

  return (
    <TskTable
      headTitle={" tarification"}
      // onAdd={onAdd}
      columns={columns}
      data={tobs}
      loading={loading}
    />
  );
};

export default PriceProduct;
