import { useQueryClient } from "@tanstack/react-query";
import { AdditNaCoSh, ColEditDel, ColToggle, ModalBase, ReactTableColumnType, TskTable, useQueryCrud } from "asv-hlps-react";
import { toggleProp } from "asv-hlps/lib/cjs/utils";
import { useMemo, useState } from "react";

import httpService from "../../../../../services/httpService";
import { colNaCo } from "../../../../../shared/helpers/hlpColumn";
import hlpCrud from "../../../../../shared/helpers/hlpCrud";
import { Toastify } from "../../../../../shared/helpers/Toastify";

const ListProductDepot = ({ url }) => {
  const queryClient = useQueryClient();

  const { tobs, isLoading, handleDelete, onAdd, handleSubmit, handleEdit, handleToggle } = useQueryCrud({
    httpService,
    keys: ["productdepots"],
    url: url,
  });

  const [tob, setTob] = useState(null);
  const [modal, setModal] = useState(false);
  // --------------------

  const handleDepot = async (tob) => {
    const nTob = { ...tob };
    nTob.main = nTob.main === "master" ? "slave" : "master";
    // --------------------
    const oldTobs: any[] = queryClient.getQueryData(["productdepots"]);
    queryClient.setQueriesData(["productdepots"], (tobs: any[]) => hlpCrud.updateTobOnList(nTob, tobs));
    try {
      await httpService.postId(tob.id, `${url}/toggleMain`);
      Toastify.success();
    } catch (error) {
      queryClient.setQueryData<any[]>(["productdepots"], (tobs: any[]) => (tobs = oldTobs));
      Toastify.error();
    }
  };

  /* const toggleProp = (tob: any, propToToggle: string) => {
    const nTob = { ...tob };
    nTob[propToToggle] = !nTob[propToToggle];
    return nTob;
  }; */

  const handleHasViewStock = async (tob) => {
    const nTob = toggleProp(tob, "hasViewStock");
    // --------------------
    const oldTobs: any[] = queryClient.getQueryData(["productdepots"]);
    queryClient.setQueriesData(["productdepots"], (tobs: any[]) => hlpCrud.updateTobOnList(nTob, tobs));
    try {
      await httpService.postId(tob.id, `${url}/hasViewStock`);
      Toastify.success();
    } catch (error) {
      queryClient.setQueryData<any[]>(["productdepots"], (tobs: any[]) => (tobs = oldTobs));
      Toastify.error();
    }
  };

  const columns: ReactTableColumnType[] = useMemo(
    () => [
      ...colNaCo,
      { ...ColToggle({ header: () => <i className="uil uil-eye"></i>, accessorKey: "hasViewStock", handleToggle: handleHasViewStock }) },
      { ...ColToggle({ header: () => "active", accessorKey: "isActive", handleToggle }) },
      { ...ColToggle({ header: () => "type", accessorKey: "main", handleToggle: handleDepot }) },
      /* {
        header: "type",
        accessorKey: "main",
        cell: ({ row }) => (
          <span className="cursor-pointer" onClick={() => handleDepot(row.original)}>
            {row.original.main}
          </span>
        ),
      }, */

      { ...ColEditDel({ handleDelete, handleEdit }) },
    ],
    [handleDelete, handleDepot]
  );

  return (
    <>
      <TskTable onAdd={onAdd} loading={isLoading} headTitle={"depots"} columns={columns} data={tobs} />
      <ModalBase
        show={modal}
        title={"depot"}
        icon={"fas fa-pen"}
        onCloseModal={() => {
          setModal(false);
          setTob(null);
        }}
        content={
          <AdditNaCoSh
            type="naco"
            url={url}
            tob={tob}
            onSubmitForm={handleSubmit}
            onCancelForm={() => {
              setModal(false);
              setTob(null);
            }}
          />
        }
      />
    </>
  );
};

export default ListProductDepot;
