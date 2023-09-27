import { ColEditDel, ColToggle, ModalBase, ReactTableColumnType, TskTable, useTobCrud } from "asv-hlps-react";
import { useMemo } from "react";

import { ADM } from "../../../../auth/services/auth-menu";
import authService from "../../../../auth/services/authService";
import httpService from "../../../../services/httpService";
import AdditNaCoSh from "../../../../shared/forms/AdditNaCoSh";
import { colNaCo } from "../../../../shared/helpers/hlpColumn";

const ListFaqCat = ({ url }) => {
  const { cancelForm, tob, onAdd, modal, tobs, loading, handleDelete, handleToggle, handleEdit, closeModal, handleSubmit } = useTobCrud({
    httpService,
    url,
  });
  const columns: ReactTableColumnType[] = useMemo(
    () => [
      ...colNaCo,
      { ...ColToggle({ header: "active", accessorKey: "isActive", handleToggle }) },
      { ...ColToggle({ header: "interne", accessorKey: "intern", handleToggle }) },
      { ...ColToggle({ header: "externe", accessorKey: "extern", handleToggle }) },
      { ...ColEditDel({ handleDelete, handleEdit }) },
    ],
    [handleDelete]
  );

  return (
    <>
      <TskTable
        headTitle={"faq catégoriess"}
        onAdd={onAdd}
        columns={columns}
        data={tobs}
        loading={loading}
        initialState={{
          columnVisibility: {
            actions: authService.getAuth({ roles: [...ADM] }),
            del: authService.getAuth({ roles: [...ADM] }),
          },
        }}
      />
      <ModalBase
        title={"faq catégories"}
        icon={"fas fa-pen"}
        show={modal}
        onCloseModal={closeModal}
        content={<AdditNaCoSh url={url} type="naco" tob={tob} onSubmitForm={handleSubmit} onCancelForm={cancelForm} />}
      />
    </>
  );
};

export default ListFaqCat;
