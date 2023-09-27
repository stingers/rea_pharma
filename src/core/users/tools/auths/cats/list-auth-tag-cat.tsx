import { ColEditDel, colNa, ColToggle, ModalBase, ReactTableColumnType, TskTable, useQueryCrud } from "asv-hlps-react";
import { useMemo } from "react";

import httpService from "../../../../../services/httpService";
import AdditNaCoSh from "../../../../../shared/forms/AdditNaCoSh";

const ListAuthTagCat = ({ url }) => {
  const { cancelForm, tob, onAdd, modal, tobs, isLoading, handleDelete, handleToggle, handleEdit, closeModal, handleSubmit } = useQueryCrud(
    {
      url,
      keys: ["authtagcats"],
      httpService,
    }
  );
  const columns: ReactTableColumnType[] = useMemo(
    () => [
      ...colNa,
      { ...ColToggle({ header: "interne ", accessorKey: "intern", handleToggle, style: { width: "5%", textAlign: "center" } }) },
      { ...ColToggle({ header: "externe ", accessorKey: "extern", handleToggle, style: { width: "5%", textAlign: "center" } }) },
      { ...ColToggle({ header: "active ", accessorKey: "isActive", handleToggle, style: { width: "5%", textAlign: "center" } }) },
      { ...ColEditDel({ handleDelete, handleEdit }) },
    ],
    [handleDelete]
  );

  return (
    <>
      <TskTable headTitle={"auth catégories"} onAdd={onAdd} columns={columns} data={tobs} loading={isLoading} />
      <ModalBase
        title={"auth catégorie"}
        icon={"fas fa-pen"}
        show={modal}
        onCloseModal={closeModal}
        content={<AdditNaCoSh url={url} type="na" tob={tob} onSubmitForm={handleSubmit} onCancelForm={cancelForm} />}
      />
    </>
  );
};

export default ListAuthTagCat;
