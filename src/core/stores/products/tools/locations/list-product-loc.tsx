import { ColEditDel, ModalBase, ReactTableColumnType, TskTable, useTobCrud } from "asv-hlps-react";
import { useMemo } from "react";
import httpService from "../../../../../services/httpService";
import AdditNaCoSh from "../../../../../shared/forms/AdditNaCoSh";
import { colNa } from "../../../../../shared/helpers/hlpColumn";

const ListProductLoc = ({ url }) => {
  const { cancelForm, tob, onAdd, modal, tobs, loading, handleDelete, handleEdit, closeModal, handleSubmit } = useTobCrud({
    httpService,
    url,
  });
  const columns: ReactTableColumnType[] = useMemo(
    () => [...colNa, { header: "colonne", accessorKey: "col" }, { ...ColEditDel({ handleDelete, handleEdit }) }],
    [handleDelete]
  );

  return (
    <>
      <TskTable headTitle={"emplacements"} onAdd={onAdd} columns={columns} data={tobs} loading={loading} />
      <ModalBase
        title={"emplacement"}
        icon={"fas fa-pen"}
        show={modal}
        onCloseModal={closeModal}
        content={<AdditNaCoSh url={url} type="naco" tob={tob} onSubmitForm={handleSubmit} onCancelForm={cancelForm} />}
      />
    </>
  );
};

export default ListProductLoc;
