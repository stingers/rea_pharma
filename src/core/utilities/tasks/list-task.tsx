import { dateFormatter } from "asv-hlps";
import { ColEditDel, ColToggle, ModalBase, ReactTableColumnType, TskTable, useQueryCrud } from "asv-hlps-react";
import DisplayTooltip from "asv-hlps-react/lib/cjs/reacts/displays/display-tooltip";
import { useMemo } from "react";
import { Badge } from "react-bootstrap";

import { ADM, SADM } from "../../../auth/services/auth-menu";
import authService from "../../../auth/services/authService";
import httpService from "../../../services/httpService";
import AdditTask from "./addit-task";
import { Task } from "./Task";

const ListTask = () => {
  const { cancelForm, tob, onAdd, modal, tobs, isLoading, handleDelete, handleToggle, handleEdit, closeModal, handleSubmit } = useQueryCrud(
    {
      httpService,
      url: "tasks",
      keys: ["tasks"],
    }
  );

  const getPriority = (task) => {
    switch (task.priority) {
      case "high":
        return "danger";
      case "medium":
        return "warning";
      case "low":
        return "info";
    }
  };

  const columns: ReactTableColumnType[] = useMemo(
    () => [
      {
        header: "id",
        accessorKey: "id",

        cell: ({ row }) => {
          const tob: Task = row.original;
          return <span>{"#TSK" + tob.id.toString().padStart(3, "0")} </span>;
        },
      },
      {
        header: "titre",
        accessorKey: "title",
        cell: ({ row }) => <span className={row.original.isDone ? "text-decoration-line-through" : ""}>{row.original.title}</span>,
      },
      { header: "date de fin ", accessorKey: "endDate", cell: ({ row }) => <span>{dateFormatter(row.original.endDate, "dmy", "/")}</span> },
      { header: "assigné ", accessorKey: "assignTo.fullname" },
      {
        header: "priority ",
        accessorKey: "priority",
        cell: ({ row }) => <Badge className={`text-uppercase p-1 fs-6 bg-${getPriority(row.original)}`}>{row.original.priority}</Badge>,
      },
      {
        ...ColToggle({
          header: () => (
            <DisplayTooltip content={"done"}>
              <i className="fas fa-check-double"></i>
            </DisplayTooltip>
          ),
          accessorKey: "isDone",
          handleToggle,
        }),
      },

      { ...ColEditDel({ handleDelete, handleEdit }) },
    ],
    [handleDelete]
  );

  return (
    <>
      <TskTable
        // tableClass="table-striped table-sm"
        onAdd={onAdd}
        headTitle={"task"}
        loading={isLoading}
        columns={columns}
        data={tobs}
        initialState={{
          columnVisibility: {
            isDone: authService.getAuth({ roles: SADM }),
            actions: authService.getAuth({ roles: [...ADM] }),
            del: authService.getAuth({ roles: [...ADM] }),
          },
        }}
      />
      <ModalBase
        title={"task"}
        icon="fas fa-pen"
        show={modal}
        onCloseModal={closeModal}
        content={<AdditTask tob={tob} onSubmitForm={handleSubmit} onCancelForm={cancelForm} />}
      />
    </>
  );
};

export default ListTask;
