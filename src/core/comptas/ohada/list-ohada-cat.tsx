import { AdditNaCoSh, ColEditDel, ModalBase, ReactTableColumnType, TskTable, colNa, useTobCrud } from "asv-hlps-react";
import { useMemo } from "react";

import httpService from "../../../services/httpService";

const ListOhadaCat = ({ url }) => {
  const { cancelForm, tob, onAdd, modal, tobs, loading, handleDelete, handleEdit, closeModal, handleSubmit } = useTobCrud({
    httpService,
    url,
  });

  const columns: ReactTableColumnType[] = useMemo(
    () => [
      { header: "compte", accessorKey: "id", sort: true },
      ...colNa,
      { header: "groupe", accessorKey: "grp.name" },
      { ...ColEditDel({ handleDelete, handleEdit }) },
    ],
    [handleDelete]
  );
  return (
    <>
      <TskTable headTitle={"catégories"} onAdd={onAdd} columns={columns} data={tobs} loading={loading} />
      <ModalBase
        title={<span>categorie</span>}
        icon="fas fa-pen"
        show={modal}
        onCloseModal={closeModal}
        content={<AdditNaCoSh type="naco" url={url} tob={tob} onSubmitForm={handleSubmit} onCancelForm={cancelForm} />}
      />
    </>
  );
};

export default ListOhadaCat;
