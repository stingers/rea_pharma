import { AdditNaCoSh, ColEditDel, colNa, ColToggle, ModalBase, ReactTableColumnType, TskTable, useTobCrud } from "asv-hlps-react";

import httpService from "../../../services/httpService";

const ListOhadaPlan = ({ url }) => {
  const { cancelForm, tob, onAdd, modal, tobs, loading, handleDelete, handleEdit, handleToggle, closeModal, handleSubmit } = useTobCrud({
    httpService,
    url,
  });

  const columns: ReactTableColumnType[] = [
    { header: "compte", accessorKey: "id", sort: true },
    ...colNa,
    { ...ColToggle({ header: "active", accessorKey: "isActive", handleToggle }) },
    { ...ColEditDel({ handleDelete, handleEdit }) },
  ];
  return (
    <>
      <TskTable headTitle={"classes"} onAdd={onAdd} columns={columns} data={tobs} loading={loading} />
      <ModalBase
        title={<span>classe</span>}
        icon="fas fa-pen"
        show={modal}
        onCloseModal={closeModal}
        content={<AdditNaCoSh type="na" url={url} tob={tob} onSubmitForm={handleSubmit} onCancelForm={cancelForm} />}
      />
    </>
  );
};

export default ListOhadaPlan;
