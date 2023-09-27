import { ColEditDel, colNa, ModalBase, ReactTableColumnType, TskTable, useTobCrud } from "asv-hlps-react";
import { useMemo } from "react";

import httpService from "../../../../../../services/httpService";
import AdditNaCoSh from "../../../../../../shared/forms/AdditNaCoSh";

const ListProductTclGrp = ({ url }) => {
  const { cancelForm, tob, onAdd, modal, tobs, loading, handleDelete, handleEdit, closeModal, showModal, handleSubmit } = useTobCrud({
    httpService,
    url,
  });
  const columns: ReactTableColumnType[] = useMemo(() => [...colNa, { ...ColEditDel({ handleDelete, handleEdit }) }], [handleDelete]);

  return (
    <>
      <TskTable headTitle={"tcl groupes"} onAdd={onAdd} columns={columns} data={tobs} loading={loading} />
      <ModalBase
        title={"tcl groupe"}
        icon={"fas fa-pen"}
        show={modal}
        onCloseModal={closeModal}
        content={<AdditNaCoSh url={url} type="na" tob={tob} onSubmitForm={handleSubmit} onCancelForm={cancelForm} />}
      />
    </>
  );
};

export default ListProductTclGrp;
