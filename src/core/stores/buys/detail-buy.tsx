import { currencyFormatterCfa } from "asv-hlps";
import { ReactTableColumnType, TskTable } from "asv-hlps-react";

import { Buy } from "asv-hlps/lib/cjs/models/entities/buys/Buy";
import { useState } from "react";

type TobType = {
  buy: Buy;
};
const DetailBuy = ({ buy: getBuy }: TobType) => {
  const [buy] = useState<Buy>(getBuy);
  const [loading, setLoading] = useState(false);
  const [buyProducts] = useState(buy.buyProducts);

  const columns: ReactTableColumnType[] = [
    { header: "designation", accessorKey: "product.designation", sort: true },
    { header: "quantité commandée", accessorKey: "qtityOdr", sort: true },
    {
      header: "montant estimé",
      accessorKey: "amount",

      cell: ({ row }) => {
        const tob = row.original;
        return tob.qtityOdr * tob.product.stores[0].pghtPrice;
      },
    },
  ];

  return (
    <TskTable
      pushTrs={
        <tr className="text-black fw-bold">
          <td colSpan={3} className={"text-end"}>
            Montant total
          </td>
          <td>
            {currencyFormatterCfa(
              buyProducts.reduce((prev, curr) => {
                return +prev + curr.qtityOdr * curr.product.stores[0].pghtPrice;
              }, 0)
            )}
          </td>
        </tr>
      }
      columns={columns}
      data={buyProducts}
      loading={loading}
      headTitle={`${buy.ref} (${buy.pvd.ste.name})`}
    />
  );
};

export default DetailBuy;
