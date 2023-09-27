import { ColEditDel, ModalBase, ReactTableColumnType, TskTable, useQueryCrud } from "asv-hlps-react";

import httpService from "../../../services/httpService";
import AdditContinent from "../continents/addit-continent";

const ListRegion = () => {
  const url = "regions";
  const { cancelForm, tob, onAdd, modal, tobs, isLoading, handleDelete, handleEdit, closeModal, showModal, handleSubmit } = useQueryCrud({
    httpService,
    url,
    keys: ["regions"],
  });
  const columns: ReactTableColumnType[] = [
    { header: "nom", accessorKey: "name" },
    { header: "pays", accessorKey: "country.nameFr" },
    { ...ColEditDel({ handleDelete, handleEdit }) },
  ];

  return (
    <>
      <TskTable headTitle={"regions"} onAdd={onAdd} columns={columns} data={tobs || []} loading={isLoading} />
      <ModalBase
        title={"region"}
        icon={"fas fa-pen"}
        show={modal}
        onCloseModal={closeModal}
        content={<AdditContinent tob={tob} onSubmitForm={handleSubmit} onCancelForm={cancelForm} />}
      />
    </>
  );
};

export default ListRegion;
