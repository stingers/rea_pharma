import { AdditNaCoSh, ColEditDel, colNaCo, ColToggle, ModalBase, ReactTableColumnType, useQueryCrud } from "asv-hlps-react";
import { TskTable } from "asv-hlps-react/lib/cjs/reacts/tanstack-table";
import { useMemo } from "react";

import httpService from "../../../../services/httpService";

const ListUserRole = ({ url }) => {
  const { tob, onAdd, modal, tobs, isLoading, error, handleSubmit, cancelForm, closeModal, handleToggle, handleDelete, handleEdit } =
    useQueryCrud({
      url: "userroles",
      keys: ["roles"],
      httpService,
    });

  const columns: ReactTableColumnType[] = useMemo(
    () => [
      ...colNaCo,
      { ...ColToggle({ header: "interne", accessorKey: "intern", handleToggle, style: { width: "5%", textAlign: "center" } }) },
      { ...ColToggle({ header: "externe", accessorKey: "extern", handleToggle, style: { width: "5%", textAlign: "center" } }) },
      { ...ColToggle({ header: "active", accessorKey: "isActive", handleToggle, style: { width: "5%", textAlign: "center" } }) },

      { ...ColEditDel({ handleDelete, handleEdit }) },
    ],
    []
  );

  return (
    <>
      <TskTable headTitle={"roles"} onAdd={onAdd} columns={columns} data={tobs || []} loading={isLoading} />
      <ModalBase
        title={"role"}
        icon={"fas fa-pen"}
        show={modal}
        onCloseModal={closeModal}
        content={<AdditNaCoSh url={url} type="naco" tob={tob} onSubmitForm={handleSubmit} onCancelForm={cancelForm} />}
      />
    </>
  );
};

export default ListUserRole;
