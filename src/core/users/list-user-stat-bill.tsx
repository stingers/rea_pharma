import { formatAmountToString, sumAmount } from "asv-hlps";
import { colToolTip, ReactTableColumnType, TskTable, useQueryPost } from "asv-hlps-react";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import { HlpPdf } from "../../pdfs/hlpPdf";
import httpService from "../../services/httpService";
import pdfService from "../../services/pdfService";
import { BillDefinition } from "../bills/pdfs/BillDefinition";
import { PdfBillTables } from "../bills/pdfs/PdfBillTables";

const ListUserStatBill = () => {
  const { code: grpCode } = useParams();
  const [dates, setDates] = useState(null);
  const [filtereds, setFiltereds] = useState([]);
  // const [totalAmount, setTotalAmount] = useState(0);
  // const [totalNopaid, setTotalNopaid] = useState(0);
  // const [totalPaid, setTotalPaid] = useState(0);
  const { data: tobs, isLoading } = useQueryPost({
    httpService,
    url: "statclients/statbills",
    postParam: { grpCode, dates },
    keys: ["statbills", grpCode, dates],
  });

  // console.log(dates);

  const totalAmount = sumAmount(filtereds, "totalAmount");

  const totalNopaid = sumAmount(filtereds, "totalNopaid");

  const totalPaid = sumAmount(filtereds, "totalPaid");
  const onSelectedDates = (dates) => {
    setDates(dates);
  };

  const onGenExcel = () => {};
  const onGenPdf = () => {
    pdfService.generatePdf(
      "print",
      // action,
      BillDefinition.statBill(
        HlpPdf.displayPdfDate("Stats factures", dates?.fromDate || new Date(), dates?.toDate || new Date()),
        PdfBillTables.statlistBillTable(tobs),
        {
          totalAmount: totalAmount,
          totalNopaid: totalNopaid,
          totalPaid: totalPaid,
        }
      )
    );
  };

  const columns: ReactTableColumnType[] = useMemo(
    () => [
      {
        header: "id",
        accessorKey: "username",
      },
      {
        header: "société",
        accessorKey: "steName",
      },
      {
        header: () => colToolTip("montant dû", "montant total dû"),
        accessorKey: "totalAmount",
        cell: ({ row }) => <span>{formatAmountToString(row.original.totalAmount, { math: "ceil" })}</span>,
      },
      {
        header: "impayées",
        accessorKey: "totalNopaid",
        cell: ({ row }) => <span className="text-danger">{formatAmountToString(row.original.totalNopaid, { math: "ceil" })}</span>,
      },
      {
        header: "payées",
        accessorKey: "totalPaid",
        cell: ({ row }) => <span className="text-success">{formatAmountToString(row.original.totalPaid, { math: "ceil" })}</span>,
      },
    ],
    []
  );
  return (
    <TskTable
      tableId=""
      headTitle={"stats factures"}
      // onGenExcel={onGenExcel}
      onGenPdf={onGenPdf}
      columns={columns}
      data={tobs || []}
      loading={isLoading}
      onSelectedDate={onSelectedDates}
      getRows={(rows) => setFiltereds(rows.map((row) => row.original))}
    />
  );
};

export default ListUserStatBill;
