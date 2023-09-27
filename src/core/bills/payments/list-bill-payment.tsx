import { currencyFormatterCfa, dateFormatter, sumAmount } from "asv-hlps";
import { BtnDel, ReactTableColumnType, TskTable, colToolTip, pathName, useQueryDel, useQueryPost } from "asv-hlps-react";
import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

import { ADM, CAISSE, COMPTA } from "../../../auth/services/auth-menu";
import authService from "../../../auth/services/authService";
import { DocDefinition } from "../../../pdfs/DocDefinition";
import { PdfTables } from "../../../pdfs/PdfTables";
import httpService from "../../../services/httpService";
import pdfService from "../../../services/pdfService";
import LinkUserCard from "../../users/cards/link-user-card";
import BtnBillAction from "../components/btn-bill-action";
import GenBillPaymentReceipt from "./gen-bill-payment-receipt";

type TobProps = {
  userId?: any;
};

const ListBillPayment = ({ userId }: TobProps) => {
  const location = useLocation();
  const [dates, setDates] = useState(null);
  const path = pathName(location);
  const [filtereds, setFiltereds] = useState([]);
  const [tobasyncs, setTobasyncs] = useState([]);
  const { data: tobs, isLoading } = useQueryPost({
    httpService,
    url: "bills/payments",
    postParam: { dates, userId, path },
    keys: ["payments", dates, userId],
  });
  const delTob = useQueryDel(httpService, ["payments", dates, userId], "payments/delete");

  const onGenPdf = (action: string) => {
    if (filtereds.length > 0) {
      pdfService.generatePdf(action, DocDefinition.generic("Factures", PdfTables.billPaymentTable(filtereds)));
    }
  };

  const getDepot = (tob) => {
    if (tob.account && tob.account.bank) {
      return `${tob?.account?.name} ${tob?.account?.bank?.name}`;
    }
    return "";
  };
  const onSelectedDates = (values) => {
    setDates(values);
  };

  const handleDelete = (tob) => {
    delTob.mutate(tob);
  };

  const onAsyncSearch = async (search) => {
    const { data } = await httpService.postParam(search, "bills/searchPayment");
    /* if (data) {
      tobs = data;
    } */
  };

  const extraFilters = (tob) => tob?.ref + tob?.bill?.ref + tob?.bill?.client?.username + tob?.bill?.client?.ste?.name;

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
        // accessorKey: "ref",
        accessorFn: (row) => extraFilters(row),

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
        id: "client",
        // accessorKey: "client?.username",
        accessorFn: (row) => `${row?.client?.username}`,
        // accessorFn: (row) => (row?.client ? row?.client?.username : ""),
        cell: ({ row }) => <LinkUserCard user={row.original.bill.client} userProp={row.original.bill.client.username} />,
      },
      {
        header: "montant",
        accessorKey: "paidAmount",
        cell: ({ row }) => currencyFormatterCfa(row.original.paidAmount),
      },
      {
        header: "Mode",
        id: "method",
        // accessorKey: "method?.name",
        accessorFn: (row) => row?.method?.name,
      },
      {
        header: "N° cheq/vrt",
        accessorKey: "checkNumber",
      },
      {
        header: "Banque",
        id: "bank",
        // accessorKey: "bank?.name",
        accessorFn: (row) => row?.bank?.name,
      },
      {
        header: "Sur Le compte",
        accessorKey: "compteCpa",
        cell: ({ row }) => getDepot(row.original),
      },
    ],
    []
  );

  const totalAmount = (tobs) => {
    return (
      <tr>
        <td colSpan={authService.getAuth({ roles: [...ADM] }) ? 6 : 5} className="text-end">
          <span className="fw-bold ">Total</span>
        </td>
        <td>
          <span className="fw-bold  fs-10">{currencyFormatterCfa(sumAmount(tobs, "paidAmount"))}</span>
        </td>
        <td colSpan={authService.getAuth({ roles: [...ADM] }) ? 4 : 3} className="text-end"></td>
      </tr>
    );
  };

  return (
    <>
      <TskTable
        onSelectedDate={onSelectedDates}
        // loading={isLoading}
        columns={columns}
        data={tobs || []}
        headTitle={"payments"}
        onGenPdf={onGenPdf}
        onAsyncSearch={onAsyncSearch}
        tableId={undefined}
        pullTrs={totalAmount(filtereds)}
        pushTrs={totalAmount(filtereds)}
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

export default ListBillPayment;
