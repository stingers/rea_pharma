import { AdditNaCoSh, ColEditDel, colNa, ColToggle, ModalBase, ReactTableColumnType, TskTable, useTobCrud } from "asv-hlps-react";

import httpService from "../../../services/httpService";

const ListOhadaGrp = ({ url }) => {
  const { cancelForm, tob, onAdd, modal, tobs, loading, handleDelete, handleEdit, handleToggle, closeModal, showModal, handleSubmit } =
    useTobCrud({
      httpService,
      url,
    });

  const columns: ReactTableColumnType[] = [
    { header: "compte", accessorKey: "id", sort: true },
    ...colNa,
    { header: "classe", accessorKey: "plan.name", sort: true },
    {
      ...ColToggle({
        header: () => (
          <span data-tip="active">
            <i className="fas fa-check-double"></i>
          </span>
        ),
        accessorKey: "isActive",
        handleToggle,
      }),
    },
    { ...ColEditDel({ handleDelete, handleEdit }) },
  ];
  return (
    <>
      <TskTable headTitle={"groupes"} onAdd={onAdd} columns={columns} data={tobs} loading={loading} />
      <ModalBase
        title={<span>groupe</span>}
        icon="fas fa-pen"
        show={modal}
        onCloseModal={closeModal}
        content={<AdditNaCoSh type="naco" url={url} tob={tob} onSubmitForm={handleSubmit} onCancelForm={cancelForm} />}
      />
    </>
  );
};

export default ListOhadaGrp;
