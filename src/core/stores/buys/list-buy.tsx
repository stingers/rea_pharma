import { dateFormatter } from "asv-hlps";
import { ColEditDel, ReactTableColumnType, TskTable } from "asv-hlps-react";
import LinkTob from "asv-hlps-react/lib/cjs/reacts/links/link-tob";

import classNames from "classnames";
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import httpService from "../../../services/httpService";
import { Toastify } from "../../../shared/helpers/Toastify";
import hlpCrud from "../../../shared/helpers/hlpCrud";
import DetailBuy from "./detail-buy";

const ListBuy = () => {
  const [tobs, setTobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dates, setDates] = useState(null);
  // --------------------
  const fetchTobs = async () => {
    // setLoading(true);
    const { data: tobs } = await httpService.getByDates(dates, "buys");
    setLoading(false);
    setTobs(tobs);
  };
  useEffect(() => {
    fetchTobs();
    return () => {};
  }, [dates]);
  // --------------------
  const onSelectedDates = (dates) => {
    setDates(dates);
    fetchTobs();
  };

  const handleEdit = () => {};
  const handleDelete = async (tob) => {
    const nTobs = tobs.filter((x) => x.id !== tob.id);
    setTobs(nTobs);
    Toastify.success();
    const err = await hlpCrud.persistDelete(tob, `buys/del`, tobs);
    if (err) {
      setTobs(tobs);
      Toastify.error();
    }
  };
  // --------------------
  const columns: ReactTableColumnType[] = [
    {
      header: "date de creation",
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
            title={
              <span className="text-black fw-bold">
                commande n° {row.original.ref} ({row.original.pvd.ste.name}) du {dateFormatter(row.original.createdAt)}
              </span>
            }
            size="lg"
            content={<DetailBuy buy={row.original} />}
            tob={row.original}>
            {tob.ref}
          </LinkTob>
        );
      },
    },
    {
      header: "fournisseur",
      accessorKey: "pvd.ste.name",
    },
    {
      header: "author",
      accessorKey: "author.fullname",
    },
    {
      header: "status",
      accessorKey: "isReceipt",

      cell: ({ row }) => (
        <Button className={classNames("btn btn-xs text-uppercase", row.original.isReceipt ? "btn-success" : "btn-danger")}>
          {row.original.isReceipt ? "livrée" : "non livrée"}
        </Button>
      ),
    },
    { ...ColEditDel({ handleDelete, handleEdit }) },
  ];

  return (
    <>
      <TskTable headTitle={"liste achats"} onSelectedDate={onSelectedDates} loading={loading} columns={columns} data={tobs} />
    </>
  );
};

export default ListBuy;
