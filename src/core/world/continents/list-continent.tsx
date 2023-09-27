import { ColEditDel, ModalBase, ReactTableColumnType, TskTable, useQueryCrud } from "asv-hlps-react";
import { useMemo } from "react";

import httpService from "../../../services/httpService";
import AdditContinent from "./addit-continent";

const ListContinent = () => {
  const url = "continents";

  const { cancelForm, tob, onAdd, modal, tobs, isLoading, handleDelete, handleEdit, closeModal, handleSubmit } = useQueryCrud({
    httpService,
    url,
    keys: ["continents"],
  });

  const columns: ReactTableColumnType[] = useMemo(
    () => [{ header: "nom", accessorKey: "name" }, { ...ColEditDel({ handleDelete, handleEdit }) }],
    []
  );

  return (
    <>
      <TskTable headTitle={"contients"} onAdd={onAdd} columns={columns} data={tobs} loading={isLoading} />
      <ModalBase
        title={"contient"}
        icon={"fas fa-pen"}
        show={modal}
        onCloseModal={closeModal}
        content={<AdditContinent tob={tob} onSubmitForm={handleSubmit} onCancelForm={cancelForm} />}
      />
    </>
  );
};

export default ListContinent;
