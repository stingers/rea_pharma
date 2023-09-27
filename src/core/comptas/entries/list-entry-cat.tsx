import { AdditNaCoSh, ColEditDel, ModalBase, ReactTableColumnType, TskTable, colNaCo, useQueryCrud } from "asv-hlps-react";
import httpService from "../../../services/httpService";

const ListEntryCat = ({ url }) => {
  const { cancelForm, tob, onAdd, modal, tobs, isLoading, handleDelete, handleEdit, closeModal, showModal, handleSubmit } = useQueryCrud({
    httpService,
    url: "entrycats",
    keys: ["entrycats"],
  });

  const columns: ReactTableColumnType[] = [...colNaCo, { ...ColEditDel({ handleDelete, handleEdit }) }];
  return (
    <>
      <TskTable onAdd={onAdd} data={tobs || []} loading={isLoading} headTitle={"classeurs"} columns={columns} />
      <ModalBase
        title={"catégorie"}
        icon="fas fa-pen"
        show={modal}
        onCloseModal={closeModal}
        content={<AdditNaCoSh url={url} type="naco" tob={tob} onSubmitForm={handleSubmit} onCancelForm={cancelForm} />}
      />
    </>
  );
};

export default ListEntryCat;
