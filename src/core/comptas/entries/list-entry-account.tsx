import { ColEditDel, ModalBase, ReactTableColumnType, TskTable, useQueryCrud } from "asv-hlps-react";
import AdditNaCoSh from "asv-hlps-react/lib/cjs/reacts/forms/AdditNaCoSh";
import { useMemo } from "react";

import httpService from "../../../services/httpService";

const ListEntryAccount = ({ url }) => {
  const { cancelForm, tob, onAdd, modal, tobs, isLoading, handleDelete, handleEdit, closeModal, handleSubmit } = useQueryCrud({
    httpService,
    url,
    keys: ["entryaccounts"],
  });

  const columns: ReactTableColumnType[] = useMemo(
    () => [
      { header: "Compte", accessorKey: "id" },
      { header: "Description", accessorKey: "name" },
      { ...ColEditDel({ handleDelete, handleEdit }) },
    ],
    []
  );
  return (
    <>
      <TskTable onAdd={onAdd} data={tobs} loading={isLoading} headTitle={"comptes"} columns={columns} />
      <ModalBase
        title={"compte"}
        show={modal}
        onCloseModal={closeModal}
        content={<AdditNaCoSh url={url} type="naco" tob={tob} onSubmitForm={handleSubmit} onCancelForm={cancelForm} />}
      />
    </>
  );
};

export default ListEntryAccount;
