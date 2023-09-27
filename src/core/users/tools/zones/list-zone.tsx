import { AdditNaCoSh, ColEditDel, colNaCoSh, ModalBase, ReactTableColumnType, TskTable } from "asv-hlps-react";
import { useMemo } from "react";

import useQueryCrud from "../../../../shared/hooks/react-query/useQueryCrud";

const ListZone = ({ url }) => {
  const { cancelForm, tob, onAdd, modal, tobs, isLoading, handleDelete, handleEdit, closeModal, handleSubmit } = useQueryCrud({
    url,
    keys: ["zones"],
  });
  const columns: ReactTableColumnType[] = useMemo(() => [...colNaCoSh, { ...ColEditDel({ handleDelete, handleEdit }) }], []);

  return (
    <>
      <TskTable headTitle={"zones"} onAdd={onAdd} columns={columns} data={tobs} loading={isLoading} />
      <ModalBase
        title={"zone"}
        icon={"fas fa-pen"}
        show={modal}
        onCloseModal={closeModal}
        content={<AdditNaCoSh url={url} type="nacosh" tob={tob} onSubmitForm={handleSubmit} onCancelForm={cancelForm} />}
      />
    </>
  );
};

export default ListZone;
