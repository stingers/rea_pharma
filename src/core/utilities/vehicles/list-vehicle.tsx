import { dateFormatter } from "asv-hlps";
import { ColEditDel, ModalBase, ReactTableColumnType, TskTable, useQueryCrud } from "asv-hlps-react";
import { useMemo } from "react";

import httpService from "../../../services/httpService";
import BtnToggle from "../../../shared/btns/BtnToggle";
import AdditVehicle from "./addit-vehicle";

const ListVehicle = ({ url }) => {
  const { cancelForm, tob, onAdd, modal, tobs, isLoading, handleDelete, handleToggle, handleEdit, closeModal, handleSubmit } = useQueryCrud(
    {
      httpService,
      url: "vehicles",
      keys: ["vehicles"],
    }
  );

  const columns: ReactTableColumnType[] = useMemo(
    () => [
      { header: "nom", accessorKey: "name" },
      { header: "immatriculation", accessorKey: "registration" },
      {
        header: "date immatriculation",
        accessorKey: "registrationDate",
        cell: ({ row }) => dateFormatter(new Date(row.original.registrationDate), "dmy", "/"),
        style: { width: "20%", textAlign: "center" },
      },
      {
        header: () => <i className="fas fa-check-double"></i>,
        accessorKey: "isActive",
        cell: ({ row }) => <BtnToggle check={row.original.isActive} onToggle={() => handleToggle(row.original, "isActive")}></BtnToggle>,
        style: { width: "5%", textAlign: "center" },
      },
      { ...ColEditDel({ handleDelete, handleEdit }) },
    ],
    [handleDelete]
  );

  return (
    <>
      <TskTable headTitle={"véhicules"} onAdd={onAdd} columns={columns} data={tobs || []} loading={isLoading} />
      <ModalBase
        title={"véhicule"}
        icon={"fas fa-pen"}
        show={modal}
        size="lg"
        onCloseModal={closeModal}
        content={<AdditVehicle url={url} tob={tob} onSubmitForm={handleSubmit} onCancelForm={cancelForm} />}
      />
    </>
  );
};

export default ListVehicle;
