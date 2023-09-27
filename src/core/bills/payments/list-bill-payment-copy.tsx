import { currencyFormatterCfa, dateFormatter, sumAmount } from "asv-hlps";
import { BtnDel, ReactTableColumnType, TskTable, colToolTip, pathName } from "asv-hlps-react";
import useCrud from "asv-hlps-react/lib/cjs/reacts/hooks/uses/useCrud";
// import { useMemo, useState } from "asv-hlps-react/lib/cjs/reacts/react-utils";
import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

import { ADM, CAISSE, COMPTA } from "../../../auth/services/auth-menu";
import authService from "../../../auth/services/authService";
import { DocDefinition } from "../../../pdfs/DocDefinition";
import { PdfTables } from "../../../pdfs/PdfTables";
import httpService from "../../../services/httpService";
import pdfService from "../../../services/pdfService";
// import useCrud from "../../../shared/hooks/useCrud";
import LinkUserCard from "../../users/cards/link-user-card";
import BtnBillAction from "../components/btn-bill-action";
import GenBillPaymentReceipt from "./gen-bill-payment-receipt";

type TobProps = {
  userId?: number;
};

const ListBillPaymentCopy = ({ userId }: TobProps) => {
  const location = useLocation();
  const path = pathName(location);
  const [filtereds, setFiltereds] = useState([]);
  const { tobs, isLoading, handleDelete, handleRefresh, handleSelectedDates } = useCrud({
    httpService,
    url: "bills/payments",
    urlDel: "payments/delete",
    withDates: true,
    postParam: { userId, path },
    // keys: ["payments"],
  });

  const onGenPdf = (action: string) => {
    // if (tobs.length > 0) {
    pdfService.generatePdf(action, DocDefinition.generic("Factures", PdfTables.billPaymentTable(filtereds)));
    // }
  };

  const getDepot = (tob) => {
    if (tob.account && tob.account.bank) {
      return `${tob?.account?.name} ${tob?.account?.bank?.name}`;
    }
    return "";
  };

  const columns: ReactTableColumnType[] = useMemo(
    () => [
      {
        header: () => colToolTip(<i className="fas fa-trash"></i>, "supprimer"),
        accessorKey: "undoPay",
        cell: ({ row }) => <BtnDel onDelete={handleDelete} tob={row.original} />,
        style: { width: "2%" },
      },
      {
        // header: "Date d'émission",
        header: () => colToolTip("date", "Date d'émission"),
        accessorKey: "createdAt",

        cell: ({ row }) => {
          return <span>{dateFormatter(row.original.createdAt, "dmy", "/")}</span>;
        },
      },
      {
        header: "Reférence",
        accessorKey: "ref",

        cell: ({ row }) => {
          const tob = row.original;
          return (
            <>
              <span>{tob.ref}</span>
              {/* <BtnDownloads tob={tob} onGenPdf={genPdf} /> */}
              <GenBillPaymentReceipt payment={tob} />
            </>
          );
        },
      },
      {
        header: "N° facture",
        accessorKey: "bill.ref",

        cell: ({ row }) => (
          <BtnBillAction
            bill={row.original.bill}
            auth={authService.getAuth({ roles: ["adm", "cai"] })}
            genCreditAuth={authService.getAuth({ roles: ["cai"] })}
            delBillAuth={authService.getAuth({ roles: ADM })}
          />
        ),
      },
      {
        header: "client",
        accessorKey: "client.username",
        cell: ({ row }) => <LinkUserCard user={row.original.bill.client} userProp={row.original.bill.client.username} />,
      },
      {
        header: "montant",
        accessorKey: "paidAmount",
        cell: ({ row }) => currencyFormatterCfa(row.original.paidAmount),
      },
      {
        header: "Mode",
        accessorKey: "method.name",
      },
      {
        header: "N° cheq/vrt",
        accessorKey: "checkNumber",
      },
      {
        header: "Banque",
        accessorKey: "bank.name",
      },
      {
        header: "Sur Le compte",
        accessorKey: "compteCpa",
        cell: ({ row }) => getDepot(row.original),
      },
    ],
    [handleDelete]
  );

  /*   */

  /* const genPdf = async (data) => {
    const { data: payment } = await httpService.findById(data.tob.id, "payments");
    pdfService.generatePdf(data.action, DocDefinition.paymentReceipt(payment));
  }; */
  // const handleAsyncSearch = (props) => {};

  const totalAmount = (tobs) => {
    return (
      <tr>
        <td colSpan={authService.getAuth({ roles: ["adm"] }) ? 6 : 5} className="text-end">
          <span className="fw-bold ">Total</span>
        </td>
        <td>
          <span className="fw-bold  fs-10">{currencyFormatterCfa(sumAmount(tobs, "paidAmount"))}</span>
        </td>
      </tr>
    );
  };

  return (
    <>
      <TskTable
        onSelectedDate={handleSelectedDates}
        // loading={isLoading}
        // loading={loading}
        columns={columns}
        data={tobs}
        headTitle={"payments"}
        onGenPdf={onGenPdf}
        // onAsyncSearch={handleAsyncSearch}

        tableId={undefined}
        pullTrs={totalAmount(tobs)}
        pushTrs={
          <tr>
            <td colSpan={authService.getAuth({ roles: ["adm"] }) ? 6 : 5} className="text-end">
              <span className="fw-bold ">Total</span>
            </td>
            <td>
              <span className="fw-bold  fs-10">{currencyFormatterCfa(sumAmount(tobs, "paidAmount"))}</span>
            </td>
          </tr>
        }
        getRows={(rows) => setFiltereds(rows.map((row) => row.original))}
        initialState={{
          columnVisibility: {
            undoPay: authService.getAuth({ roles: ADM }),
            compteCpa: authService.getAuth({ roles: [...ADM, ...CAISSE, ...COMPTA] }),
          },
        }}
      />
    </>
  );
};

export default ListBillPaymentCopy;
