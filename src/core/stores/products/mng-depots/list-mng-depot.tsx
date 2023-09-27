import { ReactTableColumnType, TskTable, useQueryGet } from "asv-hlps-react";
import { ModalBase } from "asv-hlps-react/lib/cjs/reacts/minton/modals/modal-base";
import { useEffect, useMemo, useState } from "react";

import httpService from "../../../../services/httpService";
import LinkCardProduct from "../link-card-product";
import MngDepotLot from "./mng-depot-lot";

const ListMngDepot = () => {
  const [tob, setTob] = useState(null);
  // const [tobs, setTobs] = useState<any[]>([]);
  const [modal, setModal] = useState(false);
  const [depots, setDepots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [depotNames, setDepotNames] = useState<string[]>([]);
  // const excludes = ["qtities", "qtityInTransfert", "id", "ref", "designation", "soms"];

  const { data: tobs, isLoading } = useQueryGet<any[]>({ httpService, keys: ["pdtInDepots"], url: "productins/indepots" });
  // --------------------

  const fetchTobs = async () => {
    /*  setLoading(true);
    const { data: tobs } = await httpService.get("productins/indepots");
    setLoading(false);
    setTobs(tobs); */
    // ------ getdepots ------
    let depots = [];
    if (tobs) {
      for (const tob of tobs) {
        depots.push({
          id: tob.id,
          ref: tob.ref,
          qtities: tob.qtities,
          designation: tob.designation,
          qtityInTransfert: tob.qtityInTransfert,
          ...tob.soms.reduce((r, { name, qtities }) => ((r[name] = qtities || 0), r), {}),
          // depots: [...tob.soms.reduce((r, { name, qtities }) => ((r[name] = qtities || 0), r), {})],
        });
      }
      setDepots(depots);
      // ------ get depotNames ------
      setDepotNames(Object.keys(tobs[0]?.soms.reduce((r, { name, qtities }) => ((r[name] = qtities || 0), r), {})));
      // setDepotNames(tobs[0]?.soms.reduce((r, { name, qtities }) => ((r[name] = qtities || 0), r), {}));
    }
  };

  const colDepotNames = () => {
    let names: any[] = [];
    for (const depot of depotNames) {
      const col: ReactTableColumnType = {
        id: depot,
        header: () => `${depot}`,
        accessorFn: () => `${depot}`,
        cell: ({ row }) => {
          const tob = row.original;
          return (
            <span onClick={() => onLotByDepot({ id: tob.id, designation: tob.designation, depot: depot, qtities: tob[depot] })}>
              {tob[depot]}
            </span>
          );
        },
      };
      names.push(col);
    }
    return names;
  };
  /* const colDepotNames = () => {
    let names: any[] = [];
    for (const depot of depotNames) {
      const col: ReactTableColumnType = {
        header: depot,
        accessorKey: depot,
        cell: ({ row }) => {
          const tob = row.original;
          return (
            <span onClick={() => onLotByDepot({ id: tob.id, designation: tob.designation, depot: depot, qtities: tob[depot] })}>
              {tob[depot]}
            </span>
          );
        },
      };
      names.push(col);
    }
    return names;
  }; */

  useEffect(() => {
    fetchTobs();

    return () => {};
  }, [tobs]);
  // --------------------

  const columns: ReactTableColumnType[] = useMemo(
    () => [
      {
        header: "ref",
        accessorKey: "ref",
      },
      {
        header: "designation",
        accessorKey: "designation",
        cell: ({ row }) => <LinkCardProduct product={row.original} />,
      },
      ...colDepotNames(),
    ],
    [colDepotNames]
  );

  const onLotByDepot = (tob) => {
    setTob(tob);
    setModal(true);
  };
  return (
    <>
      <TskTable headTitle={"depots"} loading={isLoading} columns={columns} data={depots} />;
      <ModalBase
        title={tob ? `${tob.designation} (${tob.depot})` : "liste"}
        icon={"fas fa-pen"}
        show={modal}
        onCloseModal={() => setModal(false)}
        content={<MngDepotLot tob={tob} />}
      />
    </>
  );
};

export default ListMngDepot;
