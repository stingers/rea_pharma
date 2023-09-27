import { ColEditDel, ModalBase, ReactTableColumnType, TskTable, useTobCrud } from "asv-hlps-react";
import httpService from "../../../../../services/httpService";
import AdditNaCoSh from "../../../../../shared/forms/AdditNaCoSh";
import { colNa } from "../../../../../shared/helpers/hlpColumn";

const ListProductOutReason = ({ url }) => {
  const { cancelForm, tob, onAdd, modal, tobs, loading, handleDelete, handleToggle, handleEdit, closeModal, showModal, handleSubmit } =
    useTobCrud({ httpService, url });
  const columns: ReactTableColumnType[] = [...colNa, { ...ColEditDel({ handleDelete, handleEdit }) }];

  return (
    <>
      <TskTable headTitle={" raisons de sortie"} onAdd={onAdd} columns={columns} data={tobs} loading={loading} />
      <ModalBase
        title={" raison de sortie"}
        icon={"fas fa-pen"}
        show={modal}
        onCloseModal={closeModal}
        content={<AdditNaCoSh url={url} type="na" tob={tob} onSubmitForm={handleSubmit} onCancelForm={cancelForm} />}
      />
    </>
  );
};

export default ListProductOutReason;
