import { ColEditDel, ModalBase, ReactTableColumnType, TskTable, useQueryCrud } from "asv-hlps-react";
import { useMemo } from "react";

import httpService from "../../../../services/httpService";
import AdditGender from "./addit-gender";

const ListGender = ({ url }) => {
  const { cancelForm, tob, modal, onAdd, tobs, isLoading, handleDelete, handleEdit, closeModal, handleSubmit } = useQueryCrud({
    httpService,
    url,
    keys: ["genders"],
  });
  const columns: ReactTableColumnType[] = useMemo(
    () => [
      { header: "nom", accessorKey: "name" },
      { header: "abr", accessorKey: "abr" },
      { header: "avatar", accessorKey: "avatar" },
      { ...ColEditDel({ handleDelete, handleEdit }) },
    ],
    [handleDelete]
  );

  return (
    <>
      <TskTable headTitle={"genres"} onAdd={onAdd} columns={columns} data={tobs} loading={isLoading} />
      <ModalBase
        title={"genre"}
        icon={"fas fa-pen"}
        show={modal}
        onCloseModal={closeModal}
        content={<AdditGender tob={tob} onSubmitForm={handleSubmit} onCancelForm={cancelForm} />}
      />
    </>
  );
};

export default ListGender;
