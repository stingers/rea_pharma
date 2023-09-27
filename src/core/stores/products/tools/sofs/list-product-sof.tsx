import { ColEditDel, ModalBase, ReactTableColumnType, TskTable, useTobCrud } from "asv-hlps-react";
import { useMemo } from "react";

import httpService from "../../../../../services/httpService";
import AdditNaCoSh from "../../../../../shared/forms/AdditNaCoSh";
import { colNa } from "../../../../../shared/helpers/hlpColumn";

const ListProductSof = ({ url }) => {
  const { cancelForm, tob, onAdd, modal, tobs, loading, handleDelete, handleEdit, closeModal, handleSubmit } = useTobCrud({
    httpService,
    url,
  });
  const columns: ReactTableColumnType[] = useMemo(() => [...colNa, { ...ColEditDel({ handleDelete, handleEdit }) }], [handleDelete]);

  return (
    <>
      <TskTable headTitle={"formats"} onAdd={onAdd} columns={columns} data={tobs} loading={loading} />
      <ModalBase
        title={"format"}
        icon={"fas fa-pen"}
        show={modal}
        onCloseModal={closeModal}
        content={<AdditNaCoSh url={url} type="na" tob={tob} onSubmitForm={handleSubmit} onCancelForm={cancelForm} />}
      />
    </>
  );
};

export default ListProductSof;
