import { colToolTip, ReactTableColumnType, TskTable } from "asv-hlps-react";
import useReadonlyFetchTobs from "asv-hlps-react/lib/cjs/reacts/hooks/uses/useReadonlyFetchTobs";
import { currencyFormatter } from "asv-hlps/lib/cjs/utils";
import { useEffect, useMemo, useState } from "react";

import excelService from "../../../services/excelService";
import httpService from "../../../services/httpService";
import { HlpEntry } from "../helpers/hlpEntry";
import hlpPdfEntry from "../helpers/hlpPdfEntry";

const ListBalance = ({ url }) => {
  const [tobs, setTobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dates, setDates] = useState(null);
  const [filtereds, setFiltereds] = useState([]);
  const [selectedAccounts, setSelectedAccounts] = useState([{ id: "00000000", name: "00000000" }]);
  // --------------------
  const { tobs: options } = useReadonlyFetchTobs(httpService, "entryaccounts");
  const accounts = [{ id: "00000000", name: "00000000" }, ...options];
  // --------------------
  const fetchTobs = async () => {
    const cpts = selectedAccounts.map((x) => {
      return +x.id;
    });
    const { data } = await httpService.postBody({ accounts: cpts, dates }, "entrylines/balances");
    setLoading(false);
    setTobs(data);
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

  const onSelectedAccounts = async (accounts) => {
    setSelectedAccounts(accounts);
    fetchTobs();
  };

  const genPdf = ({ action }) => {
    hlpPdfEntry.genListBalance(action, tobs, dates);
  };
  const genExcel = () => {
    excelService.exportAsExcelFileByTableId("balances", "balances");
  };

  const addtrs = (
    <tr>
      <td colSpan={3}>Total</td>
      <td>{currencyFormatter(HlpEntry.totalAmountDebit(filtereds))}</td>
      <td>{currencyFormatter(HlpEntry.totalAmountCredit(filtereds))}</td>
      <td>{currencyFormatter(HlpEntry.totalAmountSoldDebit(filtereds))}</td>
      <td>{currencyFormatter(+HlpEntry.totalAmountSoldCredit(filtereds))}</td>
    </tr>
  );

  const preddons = (
    <table className="table table-bordered table-sm ">
      <tbody>
        <tr>
          <td colSpan={3}>Total</td>
          <td>{currencyFormatter(HlpEntry.totalAmountDebit(filtereds))}</td>
          <td>{currencyFormatter(HlpEntry.totalAmountCredit(filtereds))}</td>
          <td>{currencyFormatter(HlpEntry.totalAmountSoldDebit(filtereds))}</td>
          <td>{currencyFormatter(+HlpEntry.totalAmountSoldCredit(filtereds))}</td>
        </tr>
      </tbody>
    </table>
  );

  const columns: ReactTableColumnType[] = useMemo(
    () => [
      {
        header: () => colToolTip("cpts", "comptes"),
        accessorKey: "account",
      },
      {
        header: "designation",
        accessorKey: "designation",
      },
      {
        header: "montant debit",
        accessorKey: "amountDebit",
        cell: ({ row }) => {
          const amountDebit = row.original.amountDebit;
          return +amountDebit !== 0 ? currencyFormatter(+amountDebit) : "";
        },
      },
      {
        header: "montant credit",
        accessorKey: "amountCredit",
        cell: ({ row }) => {
          const amountCredit = row.original.amountCredit;
          return +amountCredit !== 0 ? currencyFormatter(+amountCredit) : "";
        },
      },
      {
        header: "solde debit",
        accessorKey: "soldeDebit",
        cell: ({ row }) => {
          const sold = +HlpEntry.amountSoldDebit(row.original);
          return sold !== 0 ? currencyFormatter(sold) : "";
        },
      },
      {
        header: "solde credit",
        accessorKey: "soldecredit",

        cell: ({ row }) => {
          const sold = +HlpEntry.amountSoldCredit(row.original);
          return sold !== 0 ? currencyFormatter(sold) : "";
        },
      },
    ],
    [selectedAccounts, dates]
  );
  return (
    <>
      <TskTable
        rSelect={{
          options: accounts,
          formatOptionLabel: (opt) => `${opt.id}`,
          onSelectedOption: onSelectedAccounts,
          isMulti: true,
          className: "ms-2",
          defaultValue: { id: "00000000", name: "00000000" },
        }}
        loading={loading}
        columns={columns}
        data={tobs}
        onSelectedDate={onSelectedDates}
        headTitle={"balances "}
        pullTrs={addtrs}
        pushTrs={addtrs}
        // tableClass={"table-striped table-sm text-uppercase"}
        preaddons={preddons}
        onGenPdf={genPdf}
        onGenExcel={genExcel}
        tableId={"balances"}
        getRows={(rows) => setFiltereds(rows.map((row) => row.original))}
      />
    </>
  );
};

export default ListBalance;
