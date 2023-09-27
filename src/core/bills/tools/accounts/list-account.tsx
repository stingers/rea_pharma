import { ColEditDel, colNa, ModalBase, ReactTableColumnType, TskTable, useQueryCrud } from "asv-hlps-react";
import { useMemo } from "react";

import httpService from "../../../../services/httpService";
import AdditAccount from "./addit-account";

const ListAccount = ({ url }) => {
  const { cancelForm, tob, onAdd, modal, tobs, isLoading, handleDelete, handleEdit, closeModal, handleSubmit } = useQueryCrud({
    httpService,
    url,
    keys: ["accounts"],
    urlOther: "accounts/new",
  });
  const columns: ReactTableColumnType[] = useMemo(
    () => [...colNa, { header: "banque", accessorKey: "bank.name" }, { ...ColEditDel({ handleDelete, handleEdit }) }],
    [handleDelete]
  );

  return (
    <>
      <TskTable headTitle={"comptes bancaires"} onAdd={onAdd} columns={columns} data={tobs} loading={isLoading} />
      <ModalBase
        title={"compte bancaire"}
        icon={"fas fa-pen"}
        show={modal}
        onCloseModal={closeModal}
        content={<AdditAccount tob={tob} onSubmitForm={handleSubmit} onCancelForm={cancelForm} />}
      />
    </>
  );
};

export default ListAccount;
