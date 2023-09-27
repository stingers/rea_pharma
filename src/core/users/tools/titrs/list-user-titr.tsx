import { AdditNaCoSh, ColEditDel, ModalBase, ReactTableColumnType, TskTable, colNaCo, useQueryCrud } from "asv-hlps-react";
// import useCrud from "asv-hlps-react/lib/cjs/reacts/hooks/uses/useCrud";
import { useMemo } from "react";

import httpService from "../../../../services/httpService";

const ListUserTitr = ({ url }) => {
  const { cancelForm, tob, onAdd, modal, tobs, isLoading, handleDelete, handleToggle, handleEdit, closeModal, handleSubmit } = useQueryCrud(
    {
      url,
      keys: ["titrs"],
      httpService,
    }
  );

  const columns: ReactTableColumnType[] = useMemo(
    () => [...colNaCo, { ...ColEditDel({ handleDelete, handleEdit }) }],
    // [handleDelete]
    [handleDelete, handleToggle]
  );

  return (
    <>
      <TskTable headTitle={"titres"} onAdd={onAdd} columns={columns} data={tobs} loading={isLoading} />
      <ModalBase
        title={"titre"}
        icon={"fas fa-pen"}
        show={modal}
        onCloseModal={closeModal}
        content={<AdditNaCoSh url={url} type="naco" tob={tob} onSubmitForm={handleSubmit} onCancelForm={cancelForm} />}
      />
    </>
  );
};

export default ListUserTitr;
