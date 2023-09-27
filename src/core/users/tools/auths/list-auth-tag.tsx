import { ColEditDel, colNaCo, ColToggle, ModalBase, ReactTableColumnType, TskTable, useQueryCrud } from "asv-hlps-react";
import { useMemo } from "react";

import httpService from "../../../../services/httpService";
import AdditAuthTag from "./addit-auth-tag";

const ListAuthTag = ({ url }) => {
  const { cancelForm, tob, onAdd, modal, tobs, isLoading, handleDelete, handleToggle, handleEdit, closeModal, handleSubmit } = useQueryCrud(
    {
      url,
      urlOther: "authtags/new",
      keys: ["authtags"],
      httpService,
    }
  );
  const columns: ReactTableColumnType[] = useMemo(
    () => [
      ...colNaCo,
      { header: "catégorie", accessorKey: "cat.name", sort: true },

      { ...ColToggle({ header: "interne ", accessorKey: "intern", handleToggle, style: { width: "5%", textAlign: "center" } }) },
      { ...ColToggle({ header: "externe ", accessorKey: "extern", handleToggle, style: { width: "5%", textAlign: "center" } }) },
      { ...ColToggle({ header: "active ", accessorKey: "isActive", handleToggle, style: { width: "5%", textAlign: "center" } }) },
      { ...ColEditDel({ handleDelete, handleEdit }) },
    ],
    [handleDelete]
  );

  return (
    <>
      <TskTable headTitle={"auth tags"} onAdd={onAdd} columns={columns} data={tobs} loading={isLoading} />
      <ModalBase
        title={"auth tag"}
        icon={"fas fa-pen"}
        show={modal}
        onCloseModal={closeModal}
        content={<AdditAuthTag tob={tob} onSubmitForm={handleSubmit} onCancelForm={cancelForm} />}
      />
    </>
  );
};

export default ListAuthTag;
