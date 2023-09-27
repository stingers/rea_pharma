import { User } from "asv-hlps";
import { BsBadge, ColEditDel, ColToggle, colToolTip, ModalBase, ReactTableColumnType, TskTable, useQueryCrud } from "asv-hlps-react";
import DisplayTooltip from "asv-hlps-react/lib/cjs/reacts/displays/display-tooltip";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import { PHD } from "../../auth/services/auth-menu";
import authService from "../../auth/services/authService";
// import useQueryCrud from "../../shared/hooks/react-query/useQueryCrud";
import { DocDefinition } from "../../pdfs/DocDefinition";
import { PdfTables } from "../../pdfs/PdfTables";
import excelService from "../../services/excelService";
import httpService from "../../services/httpService";
import pdfService from "../../services/pdfService";
import AdditUser from "./addit-user";
import LinkUserCard from "./cards/link-user-card";

const ListUser = ({ url }) => {
  const { code } = useParams();

  const { cancelForm, tob, modal, tobs, isLoading, handleDelete, handleToggle, handleEdit, closeModal, onAdd, handleSubmit } = useQueryCrud(
    {
      httpService,
      url: "users/grp",
      getByParam: code,
      urlToggle: url,
      urlUpdate: "users/registers",
      urlDel: "users",
      urlOther: "users/registers/signup",
      keys: ["users", code],
      queryConfigs: { refetchOnWindowFocus: false },
    }
  );

  const [filtereds, setFiltereds] = useState([]);

  const onGenExcel = () => {
    excelService.exportAsExcelFileByTableId("users", getTitle(code));
  };
  const onGenPdf = (action) => {
    pdfService.generatePdf(action, DocDefinition.generic("users", PdfTables.userTable(filtereds)));
  };

  const columns: ReactTableColumnType[] = useMemo(
    () => [
      {
        header: "id",
        accessorKey: "username",
        cell: ({ row }) => <LinkUserCard user={row.original} userProp={row.original.username} />,
      },
      {
        header: "société",
        // accessorKey: "ste?.name",
        id: "societe",
        accessorFn: (row) => (row?.ste ? row?.ste.name : ""),
        style: { width: "15%" },
      },
      // nif
      {
        header: "nif",
        id: "nif",
        accessorFn: (row) => row?.ste?.nif,
        style: { width: "7%", textAlign: "center" },
      },
      {
        header: () => (code === "sf" ? "personnel" : "responsable"),
        accessorKey: "fullname",
        // accessorFn: (row) => (row.fullname ? row.fullname : ""),
        style: { width: "10%" },
      },
      //phone
      {
        header: "phone",
        accessorKey: "phoneP",
        style: { width: 200 },
      },
      // email
      {
        header: () => <i className="fas fa-mail-bulk"></i>,
        accessorKey: "email",
        cell: ({ row }) => {
          const tob: User = row.original;
          return tob?.email ? colToolTip(<i className="fas fa-envelope text-success"></i>, tob.email) : <i className="fas fa-envelope"></i>;
        },
      },
      // clp
      {
        header: () => <i className="fas fa-shield-alt"></i>,
        accessorKey: "clp",
        cell: ({ row }) => (
          <DisplayTooltip content={row.original.clp}>
            <span className={"test-normal"}>
              <i className="fas fa-eye-slash"></i>
            </span>
          </DisplayTooltip>
          // </span>
        ),
        style: { width: "5%", textAlign: "center" },
      },
      //active
      {
        ...ColToggle({
          header: () => (
            <DisplayTooltip content={"active"}>
              <i className="fas fa-check-double"></i>
            </DisplayTooltip>
          ),
          accessorKey: "isActive",
          handleToggle,
        }),
      },
      //valided
      {
        ...ColToggle({
          header: () => colToolTip(<i className="fas fa-user-check"></i>, "validé"),
          accessorKey: "isValided",
          handleToggle,
        }),
      },
      //status
      {
        ...ColToggle({
          header: () => colToolTip(<i className="fas fa-user-lock"></i>, "status"),
          accessorKey: "disabled",
          handleToggle,
          theme: "userLock",
        }),
      },
      //role
      {
        header: "role",

        id: "role",
        accessorFn: (row) => row?.role?.name,
        cell: ({ row }) => <BsBadge>{row.original?.role?.name}</BsBadge>,
      },

      { ...ColEditDel({ handleDelete, handleEdit, authDel: authService.getAuth({ roles: PHD }) }) },
    ],
    [code, handleToggle]
  );

  const grp = code !== "sf" ? "st" : "sf";
  const getTitle = (code: string) => {
    switch (code) {
      case "cl":
        return "clients";
      case "ph":
        return "pharmacies";
      case "ag":
        return "agences";
      case "fr":
        return "fournisseurs";
      case "la":
        return "laboratoires";
      case "sf":
      case "staff":
        return "personnel";
      default:
        return "clients";
    }
  };

  return (
    <>
      <TskTable
        headTitle={getTitle(code)}
        tableId="users"
        onAdd={onAdd}
        authAdd={authService.getAuth({ roles: PHD })}
        columns={columns}
        data={tobs}
        loading={isLoading}
        onGenPdf={onGenPdf}
        onGenExcel={onGenExcel}
        getRows={(rows) => setFiltereds(rows.map((row) => row.original))}
        initialState={{
          columnVisibility: {
            id: authService.getAuth({ steNames: ["cpa"] }),
            nif: code !== "sf" && authService.getAuth({ steNames: ["cpa", "eqeer"] }),
            isAtive: authService.getAuth({ roles: PHD }),
            clp: authService.getAuth({ roles: PHD, client: { roles: ["ceo", "adm"] } }),
            isValided: authService.getAuth({ roles: PHD }),
            disabled: authService.getAuth({ roles: PHD }),
            role: code === "sf",
            actions: authService.getAuth({ roles: [...PHD] }),
          },
        }}
      />
      <ModalBase
        title={`${getTitle(code).replace(/s$/, "")}`}
        icon={"fas fa-pen"}
        show={modal}
        onCloseModal={closeModal}
        backdrop={"static"}
        keyboard={false}
        size={"lg"}
        // content={<AdditUser code={code} grp={getGrp(code)} tob={tob} onSubmitForm={handleSubmit} onCancelForm={cancelForm} />}
        content={<AdditUser grp={grp} code={code} tob={tob} onSubmitForm={handleSubmit} onCancelForm={cancelForm} />}
      />
    </>
  );
};

export default ListUser;
