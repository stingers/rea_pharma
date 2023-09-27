import { ModalBase, useQueryCrud } from "asv-hlps-react";

import { ColEditDel, ReactTableColumnType, TskTable } from "asv-hlps-react";
import httpService from "../../../services/httpService";
import AdditContinent from "../continents/addit-continent";

const ListDepartment = () => {
  const url = "departments";
  const { cancelForm, tob, onAdd, modal, tobs, isLoading, handleDelete, handleToggle, handleEdit, closeModal, handleSubmit } = useQueryCrud(
    {
      httpService,
      url,
      keys: ["departments"],
    }
  );

  const columns: ReactTableColumnType[] = [
    { header: "nom", accessorKey: "name" },
    { header: "pays", accessorKey: "country.nameFr" },
    { ...ColEditDel({ handleDelete, handleEdit }) },
  ];

  return (
    <>
      <TskTable headTitle={"Departements"} onAdd={onAdd} columns={columns} data={tobs || []} loading={isLoading} />
      <ModalBase
        title={"Departement"}
        icon={"fas fa-pen"}
        show={modal}
        onCloseModal={closeModal}
        content={<AdditContinent tob={tob} onSubmitForm={handleSubmit} onCancelForm={cancelForm}></AdditContinent>}
      />
    </>
  );
};

export default ListDepartment;
