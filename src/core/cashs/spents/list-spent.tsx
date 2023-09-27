import { dateFormatter, Spent } from "asv-hlps";
import { BtnDownloads, ColEditDel, ModalBase, ReactTableColumnType, Toastify, TskTable } from "asv-hlps-react";
import { useEffect, useMemo, useState } from "react";

import { DocDefinition } from "../../../pdfs/DocDefinition";
import { PdfTables } from "../../../pdfs/PdfTables";
import excelService from "../../../services/excelService";
import httpService from "../../../services/httpService";
import pdfService from "../../../services/pdfService";
import DisplaySumAmount from "../../../shared/displays/display-sum-amount";
import hlpCrud from "../../../shared/helpers/hlpCrud";
import AdditSpent from "./addit-spent";

const ListSpent = () => {
  /* const { tob, onAdd, modal, tobs, handleSelectedDates, loading, handleDelete, handleEdit, closeModal, handleSubmit } = useTobCrud({
    httpService,
    url: "spents",
    options: { otherUrl: "spents/new" },
    params: { withDates: true },
  }); */
  const [tobs, setTobs] = useState<Spent[]>([]);
  const [tob, setTob] = useState<Spent>(null);
  const [loading, setLoading] = useState(true);
  const [dates, setDates] = useState(null);
  const [modal, setModal] = useState(false);
  // --------------------
  const fetchDatas = async () => {
    setLoading(true);
    const { data: tobs } = await httpService.postBody({ dates }, "spents");
    setLoading(false);
    setTobs(tobs);
  };
  useEffect(() => {
    fetchDatas();
    return () => {};
  }, [dates]);
  // --------------------
  const onSelectedDates = (dates) => {
    setDates(dates);
    fetchDatas();
  };
  const handleRefresh = () => {
    fetchDatas();
  };

  const onAdd = () => {
    setModal(true);
  };
  const closeModal = () => {
    setModal(false);
    setTob(null);
  };

  const handleSubmit = async (values) => {
    setModal(false);
    const { nTobs, nTob, toast } = await hlpCrud.additTobPes(values, tobs, "spents/new", null, "spents/update");
    pdfService.generatePdf("print", DocDefinition.spentReceipt(nTob));
    setTobs(nTobs);
    toast === "success" ? Toastify.success() : Toastify.error();
  };

  const handleDelete = async (tob) => {
    const nTobs = hlpCrud.removeOnList(tob, tobs);
    setTobs(nTobs);
    const err = await hlpCrud.persistDelete(tob, "spents/del", tobs);
    if (err) {
      setTobs(tobs);
      return Toastify.error();
    }
    Toastify.success();
  };

  const handleEdit = (tob) => {
    setTob(tob);
    setModal(true);
  };

  // --------------------
  const genReceiptPdf = ({ action, tob }) => {
    pdfService.generatePdf(action, DocDefinition.spentReceipt(tob));
  };

  const onGenListPdf = ({ action }) => {
    pdfService.generatePdf(action, DocDefinition.generic("Depenses", PdfTables.listSpentTable(tobs)));
  };

  const genExcel = () => {
    excelService.exportAsExcelFileByTableId("cash", "caisse");
  };

  const columns: ReactTableColumnType[] = useMemo(
    () => [
      {
        header: "date",
        accessorKey: "spentDate",

        cell: ({ row }) => dateFormatter(row.original.spentDate, "dmy", "/"),
      },
      {
        header: "ref",
        accessorKey: "ref",
      },
      {
        header: "intitulé",
        accessorKey: "description",
      },
      {
        header: "compta ref",
        accessorFn: (row) => row.entries[0].ref,
      },
      {
        header: "montant",
        accessorKey: "amount",
      },
      {
        header: "a",
        accessorKey: "via",
      },
      {
        header: () => <i className="fas fa-download d-block text-center"></i>,
        accessorKey: "downloads",
        cell: ({ row }) => <BtnDownloads tob={row.original} onGenPdf={genReceiptPdf} />,
      },
      { ...ColEditDel({ handleDelete, handleEdit }) },
    ],
    [handleDelete]
  );

  return (
    <>
      <TskTable
        columns={columns}
        data={tobs}
        loading={loading}
        // onSelectedDate={handleSelectedDates}
        onSelectedDate={onSelectedDates}
        onAdd={onAdd}
        onGenExcel={genExcel}
        onGenPdf={onGenListPdf}
        tableId={"cash"}
        addons={<DisplaySumAmount label={"montant"} tobs={tobs} cfa />}
        preaddons={<DisplaySumAmount label={"montant"} tobs={tobs} cfa />}
        headTitle={"sortie de caisse"}
      />
      <ModalBase
        show={modal}
        title={"sortie de caisse"}
        icon={"fas fa-edit"}
        onCloseModal={closeModal}
        content={<AdditSpent tob={tob} onCancelForm={closeModal} onSubmitForm={handleSubmit} />}
        footer={false}
      />
    </>
  );
};

export default ListSpent;
