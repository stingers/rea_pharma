import { AdditNaCoSh, ColEditDel, colNa, ColToggle, ModalBase, ReactTableColumnType, TskTable, useQueryCrud } from "asv-hlps-react";
import { useMemo } from "react";

import httpService from "../../../services/httpService";

const ListOhadaSubCat = ({ url }) => {
  const { cancelForm, tob, onAdd, modal, tobs, isLoading, handleDelete, handleToggle, handleEdit, closeModal, handleSubmit } = useQueryCrud(
    {
      httpService,
      url,
      keys: ["ohadaSubcats"],
      queryConfigs: { refetchOnWindowFocus: true },
    }
  );

  const columns: ReactTableColumnType[] = useMemo(
    () => [
      { header: "compte", accessorKey: "id", sort: true },
      ...colNa,
      { header: "catégories", accessorKey: "cat.name", sort: true },
      { ...ColToggle({ header: "active", accessorKey: "isActive", handleToggle }) },
      { ...ColEditDel({ handleDelete, handleEdit }) },
    ],
    [handleDelete]
  );
  return (
    <>
      <TskTable headTitle={"sous catégories"} onAdd={onAdd} columns={columns} data={tobs} loading={isLoading} />
      <ModalBase
        title={<span>sous catégorie</span>}
        icon="fas fa-pen"
        show={modal}
        onCloseModal={closeModal}
        content={<AdditNaCoSh type="naco" url={url} tob={tob} onSubmitForm={handleSubmit} onCancelForm={cancelForm} />}
      />
    </>
  );
};

export default ListOhadaSubCat;
