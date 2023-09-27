import { ColEditDel, ColToggle, ModalBase, ReactTableColumnType, TskTable, useQueryCrud } from "asv-hlps-react";
import { useMemo } from "react";
import httpService from "../../../../services/httpService";
import { colNaCoSh } from "../../../../shared/helpers/hlpColumn";
import AdditUserGrp from "./addit-user-grp";

const ListUserGrp = ({ url }) => {
  const { cancelForm, tob, onAdd, modal, tobs, isLoading, handleDelete, handleToggle, handleEdit, closeModal, handleSubmit } = useQueryCrud(
    {
      url,
      keys: ["grps"],
      httpService,
    }
  );

  const columns: ReactTableColumnType[] = useMemo(
    () => [
      ...colNaCoSh,
      { header: "coef", accessorKey: "coef" },
      { ...ColToggle({ header: "active", accessorKey: "isActive", handleToggle, style: { width: "5%", textAlign: "center" } }) },
      { ...ColEditDel({ handleDelete, handleEdit }) },
    ],
    [handleDelete]
  );

  return (
    <>
      <TskTable headTitle={"groupes"} onAdd={onAdd} columns={columns} data={tobs} loading={isLoading} />
      <ModalBase
        title={"groupe"}
        icon={"fas fa-pen"}
        show={modal}
        onCloseModal={closeModal}
        content={<AdditUserGrp url={url} tob={tob} onSubmitForm={handleSubmit} onCancelForm={cancelForm} />}
      />
    </>
  );
};

export default ListUserGrp;
