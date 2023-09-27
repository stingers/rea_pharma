import { ColEditDel, ModalBase, ReactTableColumnType, TskTable, useTobCrud } from "asv-hlps-react";
import { useMemo } from "react";

import httpService from "../../../../../services/httpService";
import AdditNaCoSh from "../../../../../shared/forms/AdditNaCoSh";
import { colNaCo } from "../../../../../shared/helpers/hlpColumn";

const ListProductDos = ({ url }) => {
  const { onAdd, cancelForm, tob, modal, tobs, loading, handleDelete, handleEdit, closeModal, handleSubmit } = useTobCrud({
    httpService,
    url,
  });
  const columns: ReactTableColumnType[] = useMemo(() => [...colNaCo, { ...ColEditDel({ handleDelete, handleEdit }) }], [handleDelete]);

  return (
    <>
      <TskTable headTitle={"dosages"} onAdd={onAdd} columns={columns} data={tobs} loading={loading} />
      <ModalBase
        title={"dosage"}
        icon={"fas fa-pen"}
        show={modal}
        onCloseModal={closeModal}
        content={<AdditNaCoSh url={url} type="na" tob={tob} onSubmitForm={handleSubmit} onCancelForm={cancelForm} />}
      />
    </>
  );
};

export default ListProductDos;
