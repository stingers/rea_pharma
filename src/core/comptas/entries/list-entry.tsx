import { dateFormatter, Entry } from "asv-hlps";
import { ColEditDel, ModalBase, ReactTableColumnType, TskTable, useQueryDel, useQueryPost, useReadonlyFetchTobs } from "asv-hlps-react";
import { currencyFormatter } from "asv-hlps/lib/cjs/utils";
import { useCallback, useMemo, useState } from "react";

import excelService from "../../../services/excelService";
import httpService from "../../../services/httpService";
import hlpCrud from "../../../shared/helpers/hlpCrud";
import BtnBillAction from "../../bills/components/btn-bill-action";
import { HlpEntry } from "../helpers/hlpEntry";
import hlpPdfEntry from "../helpers/hlpPdfEntry";
import AdditEntry from "./addit-entry";
import LinkDetailEntry from "./link-detail-entry";

const all = [{ id: 0, name: "géneral" }];

const ListEntry = () => {
  const currentDate = new Date();
  // const [tobs, setTobs] = useState<Entry[]>([]);
  const [tob, setTob] = useState<Entry>(null);

  const { tobs: getCats } = useReadonlyFetchTobs(httpService, "entrycats/menu");
  const [selectedCat, setSelectedCat] = useState({ id: 0, name: "géneral" });
  const [dates, setDates] = useState({ fromDate: currentDate, toDate: currentDate });
  const [loading, setLoading] = useState(false);
  const [filtereds, setFiltereds] = useState([]);
  const cats: { id: any; name: string | number }[] = [...all, ...getCats];
  const [modal, setModal] = useState(false);

  /* start: queries -------------------------------------- */
  const { data: tobs } = useQueryPost<Entry[]>({
    httpService,
    keys: ["entriesCat", dates, selectedCat],
    url: "entries/cat",
    postParam: { tobId: selectedCat.id, dates },
  });
  const delTob = useQueryDel(httpService, ["entriesCat", dates, selectedCat], "entries");

  /* end: queries ---------------------------------------- */

  const handleSelectedDates = (dates) => {
    setDates(dates);
    // fetchTobs();
  };

  /* const fetchTobs = async () => {
    const { data: tobs } = await httpService.postBody({ tobId: selectedCat.id, dates }, "entries/cat");
    setTobs(tobs);
  }; */

  /* useEffect(() => {
    fetchTobs();
  }, [dates, selectedCat]); */

  const dateCol = ({ row }: { row: any }) => {
    return <span>{dateFormatter(row.original.createdAt, "dmy", "/")}</span>;
  };

  const amountTrs = (tobs) => {
    return (
      <tr>
        <td colSpan={6}>Total</td>
        <td>{currencyFormatter(+HlpEntry.totalAmountCreditOnListEntry(tobs))}</td>
        <td>{currencyFormatter(+HlpEntry.totalAmountDebitOnListEntry(tobs))}</td>
      </tr>
    );
  };

  const handleDelete = (tob) => {
    delTob.mutate(tob);
  };

  /* const handleDelete = async (tob) => {
    const nTobs = tobs.filter((x) => x.id !== tob.id);
    setTobs(nTobs);
    const err = await hlpCrud.persistDel(tob.id, "entries", tobs);
    if (err) {
      setTobs(tobs);
      return Toastify.error();
    }
    Toastify.success();
  };
 */
  const handleEdit = async (tob) => {
    setTob(tob);
    setModal(true);
  };

  const selectedOption = useCallback(
    (option) => {
      setSelectedCat(option);
    },
    [selectedCat]
  );

  /* const selectedOption = (option) => {
    setSelectedCat(option);
  }; */
  const genExcel = () => {
    excelService.exportAsExcelFileByTableId("entries", "entries");
  };

  const genPdf = ({ action }) => {
    hlpPdfEntry.genListEntries(action, filtereds, dates);
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
        cell: ({ row }) => {
          const entry: Entry = row.original;
          return !entry.bill ? <span> {entry.proof}</span> : <BtnBillAction bill={entry.bill} onDelete={null} onUpdateNbPrint={null} />;
        },
      },
      {
        header: "debit",
        accessorKey: "debit",
        cell: ({ row }) => {
          const lines = row.original.lines;
          return (
            <span className={HlpEntry.diffEntryTotalAmount(lines) ? "text-danger" : ""}>
              {currencyFormatter(HlpEntry.entryTotalAmount(lines, "debit"))}
            </span>
          );
        },
      },
      {
        header: "crédit",
        accessorKey: "credit",

        cell: ({ row }) => currencyFormatter(HlpEntry.entryTotalAmount(row.original.lines, "credit")),
      },
      { ...ColEditDel({ handleDelete, handleEdit }) },
    ],
    [dates, selectedCat, handleDelete]
  );

  const onAdditEntry = () => setModal(true);

  const onCancelForm = () => {
    setTob(null);
    setModal(false);
  };

  const onCloseModal = () => {
    setTob(null);
    setModal(false);
  };

  const onSubmitForm = async (obj) => {
    onCloseModal();
    try {
      const { data } = await httpService.postBody(obj, "entries/new");
      const nTobs = hlpCrud.updateTobOnList(data, tobs, "id");
      // setTobs(nTobs);
    } catch (error) {}
  };

  return (
    <>
      <TskTable
        rSelect={{ options: cats, onSelectedOption: selectedOption, selected: selectedCat, className: "ms-2" }}
        tableClass="table-striped table-sm text-uppercase"
        headTitle={"journal"}
        onSelectedDate={handleSelectedDates}
        loading={loading}
        columns={columns}
        data={tobs || []}
        pushTrs={amountTrs(filtereds)}
        pullTrs={amountTrs(filtereds)}
        onGenPdf={genPdf}
        tableId={"entries"}
        onGenExcel={genExcel}
        onAdd={onAdditEntry}
        getRows={(rows) => setFiltereds(rows.map((row) => row.original))}
      />
      <ModalBase
        size="xl"
        footer={false}
        onCloseModal={onCloseModal}
        show={modal}
        title={undefined}
        content={<AdditEntry tob={tob} onSubmitForm={onSubmitForm} onCancelForm={onCancelForm} />}
      />
    </>
  );
};

export default ListEntry;
