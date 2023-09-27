import { ColEditDel, colNa, ModalBase, ReactTableColumnType, TskTable, useQueryCrud } from "asv-hlps-react";
import { useMemo } from "react";

import httpService from "../../../../services/httpService";
import AdditNaCoSh from "../../../../shared/forms/AdditNaCoSh";

const ListCurrency = ({ url }) => {
  const { cancelForm, tob, modal, tobs, onAdd, isLoading, handleDelete, handleEdit, closeModal, handleSubmit } = useQueryCrud({
    httpService,
    url,
    keys: ["currencies"],
  });
  const columns: ReactTableColumnType[] = useMemo(
    () => [
      ...colNa,
      { header: "sigle", accessorKey: "shortname" },
      { header: "symbol", accessorKey: "code" },
      { ...ColEditDel({ handleDelete, handleEdit }) },
    ],
    [handleDelete]
  );

  return (
    <>
      <TskTable headTitle={"devises"} onAdd={onAdd} columns={columns} data={tobs} loading={isLoading} />
      <ModalBase
        title={"devise"}
        icon={"fas fa-pen"}
        show={modal}
        onCloseModal={closeModal}
        content={<AdditNaCoSh url={url} type="nacosh" tob={tob} onSubmitForm={handleSubmit} onCancelForm={cancelForm} />}
      />
    </>
  );
};

export default ListCurrency;
