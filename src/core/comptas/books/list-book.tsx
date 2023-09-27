import { colToolTip, ReactTableColumnType, TskTable } from "asv-hlps-react";
import { currencyFormatter, dateFormatter } from "asv-hlps/lib/cjs/utils";
import { useEffect, useState } from "react";

import excelService from "../../../services/excelService";
import httpService from "../../../services/httpService";
import { HlpEntry } from "../helpers/hlpEntry";
import hlpPdfEntry from "../helpers/hlpPdfEntry";

const ListBook = ({ tob, getDates }) => {
  const [tobs, setTobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dates, setDates] = useState(getDates);
  // --------------------
  // --------------------
  const fetchTobs = async () => {
    // setLoading(true);
    const { data: tobs } = await httpService.postBody({ designation: tob?.designation.trim(), dates: dates }, "entrylines/books");
    setLoading(false);
    setTobs(tobs);
  };
  useEffect(() => {
    fetchTobs();
    return () => {};
  }, [dates]);
  // --------------------
  const onSelectedDates = (dates) => {
    setDates(dates);
    fetchTobs();
  };

  const genPdf = ({ action }) => {
    hlpPdfEntry.genListBigBook(action, tobs, dates);
  };
  const genExcel = () => {
    excelService.exportAsExcelFileByTableId("big-book", "grand_livre");
  };

  const addtrs = (
    <tr>
      <td colSpan={3}>Total</td>
      <td>{currencyFormatter(HlpEntry.totalAmountDebit(tobs))}</td>
      <td>{currencyFormatter(HlpEntry.totalAmountCredit(tobs))}</td>
      <td>{currencyFormatter(HlpEntry.totalAmountSoldDebit(tobs))}</td>
      <td>{currencyFormatter(+HlpEntry.totalAmountSoldCredit(tobs))}</td>
    </tr>
  );

  /*  const preddons = (
    <table className="table table-bordered table-sm ">
      <tbody>
        <tr>
          <td colSpan={3}>Total</td>
          <td>{currencyFormatter(HlpEntry.totalAmountDebit(tobs))}</td>
          <td>{currencyFormatter(HlpEntry.totalAmountCredit(tobs))}</td>
          <td>{currencyFormatter(HlpEntry.totalAmountSoldDebit(tobs))}</td>
          <td>{currencyFormatter(+HlpEntry.totalAmountSoldCredit(tobs))}</td>
        </tr>
      </tbody>
    </table>
  ); */

  const columns: ReactTableColumnType[] = [
    {
      header: "date",
      accessorKey: "createdAt",

      cell: ({ row }) => dateFormatter(row.original.createdAt),
    },
    {
      header: () => colToolTip("cpts", "comptes"),
      accessorKey: "account",
    },
    {
      header: "designation",
      accessorKey: "designation",
    },
    {
      header: () => colToolTip("m.débit", "montant débit"),
      accessorKey: "amountDebit",

      cell: ({ row }) => {
        const amountDebit = row.original.amountDebit;
        return +amountDebit !== 0 ? currencyFormatter(+amountDebit) : "";
      },
    },
    {
      header: () => colToolTip("m.credit", "montant credit"),
      accessorKey: "amountCredit",

      cell: ({ row }) => {
        const amountCredit = row.original.amountCredit;
        return +amountCredit !== 0 ? currencyFormatter(+amountCredit) : "";
      },
    },
    {
      header: "solde",
      accessorKey: "solde",

      cell: ({ row }) => {
        const sold = +HlpEntry.amountSold(row.original);
        return sold !== 0 ? currencyFormatter(sold) : "";
      },
    },
    {
      header: "ref",
      accessorKey: "entry.ref",
    },
    {
      header: "pièce",
      accessorKey: "entry.proof",
    },
    /* {
      header: "solde credit",
      accessorKey: "soldecredit",
      
      cell: ({ row }) => {
        const sold = +HlpEntry.amountSoldCredit(row.original);
        return sold !== 0 ? currencyFormatter(sold) : "";
      },
      
    }, */
  ];
  return (
    <>
      <TskTable
        loading={loading}
        columns={columns}
        data={tobs}
        onSelectedDate={onSelectedDates}
        headTitle={"grand livre "}
        pullTrs={addtrs}
        pushTrs={addtrs}
        tableClass={"table-bordered"}
        onGenPdf={genPdf}
        onGenExcel={genExcel}
        tableId={"big-book"}
      />
    </>
  );
};

export default ListBook;
