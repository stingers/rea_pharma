import { Entry, EntryLine } from "asv-hlps";
import { ColEditDel, ReactTableColumnType, TskTable, useReadonlyFetchTobs } from "asv-hlps-react";
import { currencyFormatter, dateFormatter } from "asv-hlps/lib/cjs/utils";
import { useEffect, useMemo, useState } from "react";

import { PdfComptaTables } from "../../../pdfs/comptas/PdfComptaTables";
import { CpaDefinition } from "../../../pdfs/CpaDefinition";
import excelService from "../../../services/excelService";
import httpService from "../../../services/httpService";
import pdfService from "../../../services/pdfService";
import BtnBillAction from "../../bills/components/btn-bill-action";
import { HlpEntry } from "../helpers/hlpEntry";
import LinkDetailEntry from "./link-detail-entry";

const all = [{ id: 0, name: "géneral" }];

const ListDetailedEntry = () => {
  const currentDate = new Date();
  const [tobs, setTobs] = useState<EntryLine[]>([]);
  const { tobs: getCats } = useReadonlyFetchTobs(httpService, "entrycats/menu");
  const [selectedCat, setSelectedCat] = useState({ id: 0, name: "géneral" });
  const [dates, setDates] = useState({ fromDate: currentDate, toDate: currentDate });
  const [loading, setLoading] = useState(false);
  const [filtereds, setFiltereds] = useState([]);
  const cats: { label: any; value: string | number }[] = [...all, ...getCats];

  const handleSelectedDates = (dates) => {
    setDates(dates);
    fetchTobs();
  };

  const fetchTobs = async () => {
    const { data: tobs } = await httpService.postBody({ tobId: selectedCat.id, dates }, "entries/cat");
    let getLines: any[] = [];
    for (const tob of tobs) {
      for (const line of tob.lines) {
        // delete tob.lines;
        getLines.push({ ...tob, ...line });
      }
    }

    setTobs(getLines);
  };

  useEffect(() => {
    fetchTobs();
  }, [dates, selectedCat]);

  const dateCol = ({ row }: { row: any }) => {
    return <span>{dateFormatter(row.original.createdAt, "dmy", "/")}</span>;
  };

  const adtrs = () => {
    // const totalDebit = currencyFormatter(+HlpEntry.totalAmountDebitOnListLines(tobs));
    // const totalCredit = currencyFormatter(+HlpEntry.totalAmountCreditOnListLines(tobs));
    return (
      <tr>
        <td colSpan={6}>Total</td>
        <td>{currencyFormatter(+HlpEntry.totalAmountDebitOnListLines(filtereds))}</td>
        <td>{currencyFormatter(+HlpEntry.totalAmountCreditOnListLines(filtereds))}</td>
        {/* <td>{currencyFormatter(+HlpEntry.totalAmountCreditOnListLines(tobs))}</td> */}
      </tr>
    );
  };
  const handleDelete = async (tob) => {};

  const handleEdit = async (tob) => {};

  const selectedOption = (option) => {
    setSelectedCat(option);
  };
  const genExcel = () => {
    excelService.exportAsExcelFileByTableId("entries", "entries");
  };

  const genPdf = ({ action }) => {
    pdfService.generatePdf(
      action,
      CpaDefinition.generic("Journal du " + dates.fromDate + " au " + dates.toDate, PdfComptaTables.dailyTable(tobs))
    );
  };

  const columns: ReactTableColumnType[] = useMemo(
    () => [
      {
        header: "date",
        accessorKey: "createdAt",

        cell: dateCol,
      },
      {
        header: "classeur",
        accessorKey: "cat.name",
      },
      {
        header: "mode",
        accessorKey: "billPayment?.method?.name",
        accessorFn: (row) => row?.billPayment?.method?.name,
      },
      {
        header: "référence",
        accessorKey: "ref",

        cell: ({ row }) => <LinkDetailEntry entry={row.original} />,
      },
      {
        header: "pièce",
        accessorKey: "proof",

        // cell: ({ row }) => <LinkProofEntry entry={row.original} />,
        cell: ({ row }) => {
          const entry: Entry = row.original;
          return !entry.bill ? <span> {entry.proof}</span> : <BtnBillAction bill={entry.bill} onDelete={null} onUpdateNbPrint={null} />;
        },
      },
      {
        header: "debit",
        accessorKey: "debit",

        cell: ({ row }) => {
          const totalDebit = currencyFormatter(+row.original.amountDebit);
          return +totalDebit !== 0 ? totalDebit : "";
        },
      },
      {
        header: "crédit",
        accessorKey: "credit",
        cell: ({ row }) => {
          const totalCredit = currencyFormatter(+row.original.amountCredit);
          return +totalCredit !== 0 ? totalCredit : "";
        },
      },
      { ...ColEditDel({ handleDelete, handleEdit }) },
    ],
    [dates, selectedCat]
  );

  return (
    <TskTable
      /* rSelect={
      options ={getCats},
      onSelectOption={selectedOption}
    } */
      rSelect={{ options: cats, onSelectedOption: selectedOption, className: "ms-2" }}
      tableClass="table-striped table-sm text-uppercase"
      headTitle={"journal"}
      onSelectedDate={handleSelectedDates}
      loading={loading}
      columns={columns}
      data={tobs}
      // onAsyncSearch={handleAsyncSearch}

      pushTrs={adtrs()}
      pullTrs={adtrs()}
      onGenPdf={genPdf}
      tableId={"entries"}
      onGenExcel={genExcel}
      getRows={(rows) => setFiltereds(rows.map((row) => row.original))}
    />
  );
};

export default ListDetailedEntry;
