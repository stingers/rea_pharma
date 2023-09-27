import { ColEditDel, colNa, ModalBase, ReactTableColumnType, TskTable, useQueryCrud } from "asv-hlps-react";

import httpService from "../../../../services/httpService";
import AdditNaCoSh from "../../../../shared/forms/AdditNaCoSh";

const ListBillCat = ({ url }) => {
  const { cancelForm, tob, onAdd, modal, tobs, isLoading, handleDelete, handleEdit, closeModal, showModal, handleSubmit } = useQueryCrud({
    httpService,
    url,
    keys: ["billcats"],
  });
  const columns: ReactTableColumnType[] = [...colNa, { ...ColEditDel({ handleDelete, handleEdit }) }];

  const modalTitle = () => (
    <span>
      <i className="fas fa-pen"></i> Categorie
    </span>
  );
  return (
    <>
      <TskTable loading={isLoading} columns={columns} data={tobs} headTitle={"Categories"} />
      <ModalBase
        title={modalTitle()}
        show={modal}
        onCloseModal={closeModal}
        content={<AdditNaCoSh type="na" url={url} tob={tob} onSubmitForm={handleSubmit} onCancelForm={cancelForm} />}
      />
    </>
  );
};

export default ListBillCat;
