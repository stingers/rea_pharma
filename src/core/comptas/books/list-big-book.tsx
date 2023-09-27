import excelService from "../../../services/excelService";
import httpService from "../../../services/httpService";
import LinkTob from "../../../shared/links/link-tob";
import { HlpEntry } from "../helpers/hlpEntry";
import hlpPdfEntry from "../helpers/hlpPdfEntry";
import ListBook from "./list-book";
import { colToolTip, ReactTableColumnType, TskTable } from "asv-hlps-react";
import useReadonlyFetchTobs from "asv-hlps-react/lib/cjs/reacts/hooks/uses/useReadonlyFetchTobs";
import { currencyFormatter, dateFormatter } from "asv-hlps/lib/cjs/utils";
import { useEffect, useMemo, useState } from "react";

const ListBigBook = () => {
  const [tobs, setTobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dates, setDates] = useState(null);
  const [selectedAccounts, setSelectedAccounts] = useState([{ id: "00000000", name: "00000000" }]);
  // --------------------
  const { tobs: options } = useReadonlyFetchTobs(httpService, "entryaccounts");
  const accounts = [{ value: "00000000", label: "00000000" }, ...options];
  // --------------------
  const fetchTobs = async () => {
    // setLoading(true);
    const cpts = selectedAccounts.map((x) => {
      return +x.id;
    });
    const { data: tobs } = await httpService.postBody({ accounts: cpts, dates }, "entrylines/bigbooks");
    setLoading(false);
    setTobs(tobs);
  };
  useEffect(() => {
    fetchTobs();
    return () => {};
  }, [dates, selectedAccounts]);
  // --------------------
  const onSelectedDates = (dates) => {
    setDates(dates);
    fetchTobs();
  };

  const onSelectedAccounts = (accounts) => {
    setSelectedAccounts(accounts);
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

  /* const preddons = (
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

  const columns: ReactTableColumnType[] = useMemo(
    () => [
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

        cell: ({ row }) => (
          <LinkTob
            tob={row.original}
            title={row.original.designation}
            size={"xl"}
            content={<ListBook getDates={dates} tob={row.original} />}>
            {row.original.designation}
          </LinkTob>
        ),
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
    ],
    []
  );
  return (
    <>
      <TskTable
        rSelect={{
          options: accounts,
          formatOptionLabel: (tob) => `${tob.id}`,
          onSelectedOption: onSelectedAccounts,
          isMulti: true,
          className: "ms-2",
          defaultValue: { id: "00000000", name: "00000000" },
        }}
        loading={loading}
        columns={columns}
        data={tobs}
        onSelectedDate={onSelectedDates}
        headTitle={"grand livre "}
        pullTrs={addtrs}
        pushTrs={addtrs}
        tableClass={"table-striped table-sm  text-uppercase"}
        onGenPdf={genPdf}
        onGenExcel={genExcel}
        tableId={"big-book"}
        // preaddons={preddons}
      />
    </>
  );
};

export default ListBigBook;
