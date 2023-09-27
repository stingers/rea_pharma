import { colToolTip, ModalBase, ReactTableColumnType, TskTable } from "asv-hlps-react";
import useReadonlyFetchTobs from "asv-hlps-react/lib/cjs/reacts/hooks/uses/useReadonlyFetchTobs";

import { useEffect, useMemo, useState } from "react";

import { currencyFormatterCfa } from "asv-hlps";
import httpService from "../../../services/httpService";
import DraftBuyByPvd from "./draft-buy-by-pvd";

const DraftBuy = () => {
  const [filteredTobs, setFilteredTobs] = useState([]);
  const [tobs, setTobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tob, setTob] = useState(null);
  const [products, setProducts] = useState([]);
  const [dates, setDates] = useState(null);
  const [modal, setModal] = useState(false);
  // const [month, setMonth] = useState(false);
  let { tobs: pvds } = useReadonlyFetchTobs(httpService, "products/usersPvdForBuy");
  pvds = [{ id: 0, name: "tous" }, ...pvds];
  // --------------------
  const fetchTobs = async () => {
    // setLoading(true);
    const { data: tobs } = await httpService.getByParam(3, "products/reappro");
    setLoading(false);
    setTobs(tobs);
    setFilteredTobs(tobs);
  };
  useEffect(() => {
    fetchTobs();
    return () => {};
    // }, [dates]);
  }, []);
  // --------------------
  const onSelectedDates = (dates) => {
    setDates(dates);
    fetchTobs();
  };

  const onSelectedPvd = (prop) => {
    if (prop.id === 0) {
      setFilteredTobs(tobs);
    } else {
      const filtereds = tobs.filter((x) => x.pvdId === prop.id);
      setFilteredTobs(filtereds);
    }
  };

  const onPvd = (pvd) => {
    const pvdProducts = tobs.filter((x) => x?.pvdId === pvd?.id);
    setProducts(pvdProducts);
    setModal(true);
  };

  // --------------------
  const columns: ReactTableColumnType[] = useMemo(
    () => [
      {
        header: "ref",
        accessorKey: "ref",
        /* cell: ({ row }) => {
        return <LinkProductCard tob={row.original} />;
      }, */
      },
      {
        header: "designation",
        accessorKey: "designation",

        /* cell: ({ row }) => {
        return <LinkProductAddit product={row.original} />;
      }, */
      },
      {
        header: "fournisseur",
        accessorKey: "pvdName",
        style: { width: "20%" },
        cell: ({ row }) => {
          const tob = row.original;
          return (
            <span className="fw-bold cursor-pointer" onClick={() => onPvd({ id: tob.pvdId, name: tob.pvdName })}>
              {row.original.pvdName}
            </span>
          );
        },
        //
      },
      {
        header: "pght",
        accessorKey: "pvdPrice",
      },
      {
        header: "stock",
        accessorKey: "stockTotal",
      },
      {
        header: () => colToolTip("Q.V", "Quantité vendues"),
        accessorKey: "saleds.sumQtityDlvr",
        cell: ({ row }) => {
          const tob = row.original;
          const total = tob.saleds.sumQtityDlvr;
          return <span className="text-black fw-bold">{total > 0 ? total : 0}</span>;
        },
      },
      {
        header: () => colToolTip("Q.UG", "Quantité ug"),
        accessorKey: "saleds.sumQtityFree",
        cell: ({ row }) => {
          const tob = row.original;
          const total = tob.saleds.sumQtityFree;
          return <span>{total > 0 ? total : 0}</span>;
        },
      },
      {
        header: () => colToolTip("Q.A.C", "Quantité à commander proposée"),
        accessorKey: "qac",
        cell: ({ row }) => {
          const tob = row.original;
          const total = tob.saleds.sumQtityDlvr * tob.buyIncreasePercent;
          return <span className="text-black fw-bold">{total > 0 ? total : 1}</span>;
        },
      },
      {
        header: "montant estimé",
        accessorKey: "me",
        cell: ({ row }) => {
          const tob = row.original;
          const total = tob.saleds.sumQtityDlvr * tob.buyIncreasePercent > 0 ? tob.saleds.sumQtityDlvr * tob.buyIncreasePercent : 1;
          return <span className="text-black fw-bold">{currencyFormatterCfa(Math.ceil(total * tob.pvdPrice))}</span>;
        },
      },
    ],
    []
  );
  // --------------------
  return (
    <>
      <TskTable
        rSelect={{ options: pvds, onSelectedOption: onSelectedPvd, className: "ms-2" }}
        // tableClass="table-"
        columns={columns}
        data={filteredTobs}
        loading={loading}
        headTitle={"produits reappro"}
      />
      <ModalBase
        size="xl"
        title={`fournisseur ${products[0]?.pvdName}`}
        show={modal}
        onCloseModal={() => setModal(false)}
        content={<DraftBuyByPvd tob={products} />}
      />
    </>
  );
};

export default DraftBuy;
