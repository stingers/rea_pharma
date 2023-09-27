import { ColEditDel, ModalBase, ReactTableColumnType, TskTable } from "asv-hlps-react";
import useCrud from "asv-hlps-react/lib/cjs/reacts/hooks/uses/useCrud";
import { useMemo } from "react";
import AdditFeed from "./addit-feed";

import { dateFormatter } from "asv-hlps";
import httpService from "../../../services/httpService";

const ListFeed = () => {
  const { tob, onAdd, modal, tobs, isLoading, handleDelete, handleSelectedDates, handleEdit, closeModal, handleSubmit } = useCrud({
    httpService,
    url: "feeds",
    urlOther: "feeds/new",
    withDates: true,
  });

  const columns: ReactTableColumnType[] = useMemo(
    () => [
      {
        header: "date",
        accessorKey: "feedDate",

        cell: ({ row }) => dateFormatter(row.original.feedDate),
      },
      {
        header: "intitulé",
        accessorKey: "description",
      },
      {
        header: "mode",
        accessorKey: "method.name",
      },
      {
        header: "montant",
        accessorKey: "amount",
      },
      {
        header: "N°CHÈQUE/VIR.",
        accessorKey: "checkNumber",
      },
      {
        header: "banque emettrice.",
        accessorKey: "bank.name",
      },
      {
        header: "N°DE COMPTE.",
        accessorKey: "account.name",
      },

      { ...ColEditDel({ handleDelete, handleEdit }) },
    ],
    []
  );

  return (
    <>
      <TskTable
        headTitle={"alimentation"}
        onAdd={onAdd}
        columns={columns}
        data={tobs}
        loading={isLoading}
        onSelectedDate={handleSelectedDates}
      />

      <ModalBase
        show={modal}
        title={"approvisionnement"}
        icon={"fas fa-pen"}
        onCloseModal={closeModal}
        content={<AdditFeed tob={tob} onCancelForm={closeModal} onSubmitForm={handleSubmit} />}
        footer={false}
      />
    </>
  );
};

export default ListFeed;
