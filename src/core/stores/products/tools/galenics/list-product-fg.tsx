import { ColEditDel, ModalBase, ReactTableColumnType, TskTable, useTobCrud } from "asv-hlps-react";
import { useMemo } from "react";

import httpService from "../../../../../services/httpService";
import AdditNaCoSh from "../../../../../shared/forms/AdditNaCoSh";
import { colNaCo } from "../../../../../shared/helpers/hlpColumn";

const ListProductFg = ({ url }) => {
  const { onAdd, tob, modal, tobs, loading, handleDelete, handleRefresh, handleEdit, closeModal, handleSubmit } = useTobCrud({
    httpService,
    url,
  });
  const columns: ReactTableColumnType[] = useMemo(() => [...colNaCo, { ...ColEditDel({ handleDelete, handleEdit }) }], [handleDelete]);

  return (
    <>
      <TskTable
        headTitle={"formes galéniques"}
        loading={loading}
        columns={columns}
        data={tobs}
        onAdd={onAdd}
        // onAsyncSearch={handleAsyncSearch}
      />
      <ModalBase
        title={"forme galénique"}
        icon="fas fa-pen"
        show={modal}
        onCloseModal={closeModal}
        content={<AdditNaCoSh type="naco" url={url} tob={tob} onSubmitForm={handleSubmit} onCancelForm={closeModal} />}
      />
    </>
  );
};

export default ListProductFg;
