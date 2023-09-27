import { ColEditDel, colNaCo, ModalBase, ReactTableColumnType, TskTable, useQueryCrud } from "asv-hlps-react";
import { useMemo } from "react";

import httpService from "../../../../services/httpService";
import AdditNaCoSh from "../../../../shared/forms/AdditNaCoSh";

const ListPaymentMode = ({ url }) => {
  const { cancelForm, tob, onAdd, modal, tobs, isLoading, handleDelete, handleEdit, closeModal, handleSubmit } = useQueryCrud({
    httpService,
    url,
    keys: ["paymentmodes"],
  });
  const columns: ReactTableColumnType[] = useMemo(() => [...colNaCo, { ...ColEditDel({ handleDelete, handleEdit }) }], []);

  return (
    <>
      <TskTable headTitle={"Modes de payment"} onAdd={onAdd} columns={columns} data={tobs} loading={isLoading} />
      <ModalBase
        title={"Mode de payment"}
        icon={"fas fa-pen"}
        show={modal}
        onCloseModal={closeModal}
        content={<AdditNaCoSh url={url} type="naco" tob={tob} onSubmitForm={handleSubmit} onCancelForm={cancelForm} />}
      />
    </>
  );
};

export default ListPaymentMode;
