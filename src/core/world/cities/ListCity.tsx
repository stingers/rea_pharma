import { ModalBase, ReactTableColumnType, TskTable, useQueryCrud } from "asv-hlps-react";

import httpService from "../../../services/httpService";
import AdditContinent from "../continents/addit-continent";

const ListCity = () => {
  const url = "cities";
  const { cancelForm, tob, onAdd, modal, tobs, isLoading, handleDelete, handleEdit, closeModal, showModal, handleSubmit } = useQueryCrud({
    httpService,
    url,
    keys: ["cities"],
  });
  const columns: ReactTableColumnType[] = [
    { header: "nom", accessorKey: "name" },
    { header: "region", accessorKey: "region.name" },
    { header: "pays", accessorKey: "country.nameFr" },
    // { ...ColEditDel({ handleDelete, handleEdit }) },
  ];

  return (
    <>
      <TskTable headTitle={"Villes"} onAdd={onAdd} columns={columns} data={tobs || []} loading={isLoading} />
      <ModalBase
        title={"Ville"}
        icon={"fas fa-pen"}
        show={modal}
        onCloseModal={closeModal}
        content={<AdditContinent tob={tob} onSubmitForm={handleSubmit} onCancelForm={cancelForm}></AdditContinent>}
      />
    </>
  );
};

export default ListCity;
