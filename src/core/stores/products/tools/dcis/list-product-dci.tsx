import { AdditNaCoSh, ColEditDel, ModalBase, ReactTableColumnType, TskTable, useQueryCrud } from "asv-hlps-react";
import { useMemo } from "react";

import httpService from "../../../../../services/httpService";
import { colNa } from "../../../../../shared/helpers/hlpColumn";

const ListProductDci = ({ url }) => {
  const { cancelForm, tob, onAdd, modal, tobs, isLoading, handleDelete, handleEdit, closeModal, handleSubmit } = useQueryCrud({
    httpService,
    url,
    keys: ["productsdcis"],
  });

  const columns: ReactTableColumnType[] = useMemo(() => [...colNa, { ...ColEditDel({ handleDelete, handleEdit }) }], [handleDelete]);
  return (
    <>
      <TskTable headTitle={"dcis"} loading={isLoading} columns={columns} data={tobs} onAdd={onAdd} />
      <ModalBase
        title={<span>dci</span>}
        icon="fas fa-pen"
        show={modal}
        onCloseModal={closeModal}
        content={<AdditNaCoSh type="na" url={url} tob={tob} onSubmitForm={handleSubmit} onCancelForm={cancelForm} />}
      />
    </>
  );
};

export default ListProductDci;
