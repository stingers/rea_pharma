import { ColEditDel, ModalBase, ReactTableColumnType, TskTable, useTobCrud } from "asv-hlps-react";
import { currencyFormatter, dateFormatter } from "asv-hlps/lib/cjs/utils";
import { useMemo } from "react";
import AdditDeposit from "./addit-deposit";

import httpService from "../../../services/httpService";

const ListDeposit = () => {
  const { handleRefresh, tob, onAdd, modal, tobs, loading, handleDelete, handleSelectedDates, handleEdit, closeModal, handleSubmit } =
    useTobCrud({ httpService, url: "deposits" });

  // --------------------
  const columns: ReactTableColumnType[] = useMemo(
    () => [
      {
        header: "créé le",
        accessorKey: "createdAt",

        cell: ({ row }) => dateFormatter(row.original.createdAt),
      },
      /* {
        header: "intitulé",
        accessorKey: "description",
      }, */
      {
        header: "montant",
        accessorKey: "amount",
        cell: ({ row }) => <span>{currencyFormatter(+row.original.amount)}</span>,
      },
      {
        header: "N° CHÈQUE/VIR.",
        accessorKey: "checkNumber",
      },
      {
        header: "Banque",
        accessorKey: "bank.name",
      },
      {
        header: "client",
        accessorKey: "client.fullname",
        cell: ({ row }) => {
          const deposit = row.original;
          // return deposit?.client?.grp?.code !== "sf" ? deposit.client.ste.name : deposit.client.fullname;
          return `${deposit.client.username} (${deposit?.client?.grp?.code !== "sf" ? deposit.client.ste.name : deposit.client.fullname})`;
        },
      },
      { ...ColEditDel({ handleDelete, handleEdit }) },
    ],
    [handleDelete]
  );

  return (
    <>
      <TskTable
        onAdd={onAdd}
        onSelectedDate={handleSelectedDates}
        headTitle={"depots des clients"}
        loading={loading}
        columns={columns}
        data={tobs}
      />
      <ModalBase
        show={modal}
        title={"depot sur compte"}
        icon={"fas fa-edit"}
        onCloseModal={closeModal}
        content={<AdditDeposit tob={tob} onCancelForm={closeModal} onSubmitForm={handleSubmit} />}
        footer={false}
      />
    </>
  );
};

export default ListDeposit;
