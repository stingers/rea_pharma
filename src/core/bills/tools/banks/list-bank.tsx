import { BtnToggle, ColEditDel, ModalBase, ReactTableColumnType, TskTable } from "asv-hlps-react";
import { useMemo } from "react";

import AdditNaCoSh from "../../../../shared/forms/AdditNaCoSh";
import useQueryCrud from "../../../../shared/hooks/react-query/useQueryCrud";

const ListBank = ({ url }) => {
  const { cancelForm, tob, onAdd, modal, tobs, isLoading, handleDelete, handleToggle, handleEdit, closeModal, handleSubmit } = useQueryCrud(
    {
      // httpService,
      url,
      keys: ["banks"],
    }
  );

  const columns: ReactTableColumnType[] = useMemo(
    () => [
      {
        header: "nom",
        accessorKey: "name",
      },
      {
        header: () => (
          <span data-tip="active">
            <i className="fas fa-check-double"></i>
          </span>
        ),
        accessorKey: "isActive",
        cell: ({ row }) => <BtnToggle check={row?.original.isActive} onToggle={() => handleToggle(row.original, "isActive")}></BtnToggle>,
        style: { width: "3%", textAlign: "center" },
      },
      { ...ColEditDel({ handleDelete, handleEdit }) },
    ],
    [handleToggle]
  );

  return (
    <>
      <TskTable headTitle={"banques"} onAdd={onAdd} columns={columns} data={tobs} loading={isLoading} />
      <ModalBase
        title={"banque"}
        icon={"fas fa-pen"}
        show={modal}
        onCloseModal={closeModal}
        content={<AdditNaCoSh url={url} type="na" tob={tob} onSubmitForm={handleSubmit} onCancelForm={cancelForm} />}
      />
    </>
  );
};

export default ListBank;
