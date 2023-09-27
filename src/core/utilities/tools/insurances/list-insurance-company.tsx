import { AdditNaCoSh, ColEditDel, colNa, ColToggle, ModalBase, ReactTableColumnType, TskTable, useQueryCrud } from "asv-hlps-react";
import { useMemo } from "react";

import httpService from "../../../../services/httpService";

const ListInsuranceCompany = () => {
  const url = "insurances";
  const { cancelForm, tob, onAdd, modal, tobs, isLoading, handleDelete, handleToggle, handleEdit, closeModal, handleSubmit } = useQueryCrud(
    {
      url,
      keys: ["insurances"],
      httpService,
    }
  );

  const columns: ReactTableColumnType[] = useMemo(
    () => [
      ...colNa,
      { ...ColToggle({ header: "active", accessorKey: "isActive", handleToggle, style: { width: "5%", textAlign: "center" } }) },
      { ...ColEditDel({ handleDelete, handleEdit }) },
    ],
    [handleDelete]
  );

  return (
    <>
      <TskTable headTitle={"Compagnies d'assurance"} onAdd={onAdd} columns={columns} data={tobs} loading={isLoading} />
      <ModalBase
        title={"Compagnie d'assurance"}
        icon={"fas fa-pen"}
        show={modal}
        onCloseModal={closeModal}
        content={<AdditNaCoSh type="na" codeMaxLength={2} url={url} tob={tob} onSubmitForm={handleSubmit} onCancelForm={cancelForm} />}
      />
    </>
  );
};

export default ListInsuranceCompany;
