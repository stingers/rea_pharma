import { ColEditDel, ModalBase, ReactTableColumnType, TskTable, useTobCrud } from "asv-hlps-react";
import { useMemo } from "react";

import httpService from "../../../../../../services/httpService";
import { colNa } from "../../../../../../shared/helpers/hlpColumn";
import AdditTclForm from "./addit-tcl-form";

const ListProductTclFrm = ({ url }) => {
  const { cancelForm, tob, onAdd, modal, handleRefresh, tobs, loading, handleDelete, handleEdit, closeModal, handleSubmit } = useTobCrud({
    httpService,
    url,
  });
  const columns: ReactTableColumnType[] = useMemo(
    () => [...colNa, { header: "groupe", accessorKey: "grp.name" }, { ...ColEditDel({ handleDelete, handleEdit }) }],
    [handleDelete]
  );

  return (
    <>
      <TskTable headTitle={"tcl forms"} onAdd={onAdd} columns={columns} data={tobs} loading={loading} />
      <ModalBase
        title={"tcl form"}
        icon={"fas fa-pen"}
        show={modal}
        onCloseModal={closeModal}
        content={<AdditTclForm tob={tob} onSubmitForm={handleSubmit} onCancelForm={cancelForm} />}
      />
    </>
  );
};

export default ListProductTclFrm;
