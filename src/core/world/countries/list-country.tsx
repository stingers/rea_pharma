import { ModalBase, useQueryCrud } from "asv-hlps-react";
import { useMemo } from "react";

import { ColEditDel, ReactTableColumnType, TskTable } from "asv-hlps-react";
import httpService from "../../../services/httpService";
import AdditContinent from "../continents/addit-continent";

const ListCountry = () => {
  const url = "countries";
  const { cancelForm, tob, onAdd, modal, tobs, isLoading, handleDelete, handleEdit, closeModal, handleSubmit } = useQueryCrud({
    httpService,
    url,
    keys: ["countries"],
  });
  const columns: ReactTableColumnType[] = useMemo(
    () => [
      { header: "nom", accessorKey: "nameFr" },
      { header: "continent", accessorKey: "continent.name" },
      { ...ColEditDel({ handleDelete, handleEdit }) },
    ],
    [handleDelete]
  );

  return (
    <>
      <TskTable headTitle={"pays"} onAdd={onAdd} columns={columns} data={tobs || []} loading={isLoading} />
      <ModalBase
        title={"pays"}
        icon={"fas fa-pen"}
        show={modal}
        onCloseModal={closeModal}
        content={<AdditContinent tob={tob} onSubmitForm={handleSubmit} onCancelForm={cancelForm} />}
      />
    </>
  );
};

export default ListCountry;
