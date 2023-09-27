import { Product } from "asv-hlps";
import { ReactTableColumnType, TskTable } from "asv-hlps-react";
import { useEffect, useMemo, useState } from "react";

import httpService from "../../../services/httpService";
import BtnOrderProduct from "./btn-order-product";

type TobType = {
  product: Product;
};

const ListProductSubstitue = ({ product }: TobType) => {
  const [tobs, setTobs] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [dates, setDates] = useState(null);
  // --------------------
  const fetchDatas = async () => {
    // setLoading(true);
    const { data: tobs } = await httpService.getByParam(product.id, "products/dci");
    setLoading(false);
    setTobs(tobs);
  };
  useEffect(() => {
    fetchDatas();
    return () => {};
  }, [dates]);
  // --------------------

  const columns: ReactTableColumnType[] = useMemo(
    () => [
      {
        header: "produits",
        accessorKey: "designation",
        cell: ({ row }) => {
          const tob: Product = row.original;
          return (
            <>
              <span>{tob.designation}</span>
              <BtnOrderProduct product={product} />
            </>
          );
        },
      },
    ],
    []
  );

  return <TskTable noHeader={true} loading={loading} columns={columns} data={tobs} />;
};

export default ListProductSubstitue;
