import { ModalBase, useQueryCrud } from "asv-hlps-react";

import { ColEditDel, ReactTableColumnType, TskTable } from "asv-hlps-react";
import httpService from "../../../services/httpService";
import AdditContinent from "../continents/addit-continent";

const ListQuarter = () => {
  const url = "quarters";
  const { cancelForm, tob, onAdd, modal, tobs, isLoading, handleDelete, handleEdit, closeModal, showModal, handleSubmit } = useQueryCrud({
    httpService,
    url,
    keys: ["quarters"],
  });
  const columns: ReactTableColumnType[] = [
    { header: "nom", accessorKey: "name" },
    { header: "region", accessorKey: "city.region.name" },
    { header: "ville", accessorKey: "city.name" },
    { header: "pays", accessorKey: "city.region.country.nameFr" },
    { ...ColEditDel({ handleDelete, handleEdit }) },
  ];

  return (
    <>
      <TskTable headTitle={"quartiers"} onAdd={onAdd} columns={columns} data={tobs || []} loading={isLoading} />
      <ModalBase
        title={"quartier"}
        icon={"fas fa-pen"}
        show={modal}
        onCloseModal={closeModal}
        content={<AdditContinent tob={tob} onSubmitForm={handleSubmit} onCancelForm={cancelForm}></AdditContinent>}
      />
    </>
  );
};

export default ListQuarter;
