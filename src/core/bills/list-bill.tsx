import { AmountOnListBillPipe, arrayMultiChecked, Bill, currencyFormatter, currencyFormatterCfa, dateFormatter, isStaffSte } from "asv-hlps";
import { BtnAction, BtnDel, ColEditDel, DropMenuType, ModalBase, ModalConfirm, ReactTableColumnType, Toastify, TskTable } from "asv-hlps-react";
import DisplayPopover from "asv-hlps-react/lib/cjs/reacts/displays/display-popover";
import React, { useEffect, useMemo, useState } from "react";

import { ADM, COMPTA, PHD } from "../../auth/services/auth-menu";
import authService from "../../auth/services/authService";
import excelService from "../../services/excelService";
import httpService from "../../services/httpService";
import TskCheckbox from "../../shared/components/tsk-checkbox";
import hlpCrud from "../../shared/helpers/hlpCrud";
import LinkUserCard from "../users/cards/link-user-card";
import AdditBillLine from "./addit-bill-line";
import BtnBillAction from "./components/btn-bill-action";
import BtnBillStatus from "./components/btn-bill-status";
import GenBill from "./gen-bill";
import hlpBillPdf from "./helpers/hlpBillPdf";
import useBillPills from "./hooks/useBillPills";
import GenBillPaymentReceipt from "./payments/gen-bill-payment-receipt";

type TobType = {
  url: string;
  clientId?: number;
};

const ListBill = ({ url, clientId }: TobType) => {
  const [bills, setBills] = useState([]);
  const [modal, setModal] = useState(false);
  const [modalConfirm, setModalConfirm] = useState(false);
  const [modalAvoir, setModalAvoir] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dates, setDates] = useState(null);
  const [checks, setChecks] = useState<any[]>([]);
  const [isChecked, setIsChecked] = useState(false);
  const [filtereds, setFiltereds] = useState([]);
  const { btns, onBtn, status } = useBillPills();

  const [selectedRows, setSelectedRows] = useState();
  // const filtereds = useFilteredTobs(getRows)

  // const authUser = useContext(AuthContext);

  const fetchTobs = async () => {
    try {
      const { data: tobs } = !clientId
        ? await httpService.postBody({ status, dates }, "bills/status")
        : await httpService.postBody({ status, dates, clientId }, "bills/user");
      setBills(tobs);
      setLoading(false);
    } catch (error) {
      Toastify.error();
    }
  };

  useEffect(() => {
    fetchTobs();
  }, [status, dates, clientId]);

  const onChecked = (e: any, bill: Bill) => {
    const evt: boolean = e.target.checked;
    const nChecks = arrayMultiChecked(checks, evt, bill);
    setChecks(nChecks);
    // const checkLength = checks.length > 0 ? true : false;
    // setIsChecked(checkLength);

    // return (checks = arrayMultiChecked(checks, evt, bill));
  };

  const onPaySuccess = (payment) => {
    const nTobs = hlpCrud.updateTobOnList(payment.bill, bills);
    setBills(nTobs);
    Toastify.success();
  };

  const actions: DropMenuType = {
    icon: "fas fa-filter",
    iconTooltip: "action",
    drops: [
      { id: 1, label: "Generer factures" },
      { id: 2, label: "Creer une facture avoir" },
    ],
  };

  const checksAction: DropMenuType = {
    icon: "fas fa-cog",
    iconTooltip: "action",
    drops: [{ id: 1, label: "Pay without cash effet", auth: status === "nopaid" }],
  };

  const handleAction = (value) => {
    switch (value) {
      case 1:
        setModal(true);
        break;
      case 2:
        setModalAvoir(true);
        break;
    }
  };

  const updateNbPrint = (data) => {
    const nTobs = hlpCrud.updateTobOnList(data, bills);
    setBills(nTobs);
    Toastify.success();
  };

  const totalAmount = currencyFormatterCfa(AmountOnListBillPipe.transform(filtereds, "all"));
  const dueAmount = currencyFormatter(AmountOnListBillPipe.transform(filtereds, "due"));
  const paidAmount = currencyFormatter(AmountOnListBillPipe.transform(filtereds, "paid"));

  const handleDelete = async (bill) => {
    const nTobs = bills.filter((x) => x.id !== bill.id);
    setBills(nTobs);
    const err = await hlpCrud.persistDelete(bill, `${url}/del`, bills);
    if (err) {
      setBills(bills);
    }
  };

  const handleEdit = async (tob) => {};

  const handleSelectedDates = (dates) => {
    setDates(dates);
    fetchTobs();
  };

  const addTable = (
    <table className="table">
      <tbody>
        <tr>
          <td className="fw-bold text-center text-uppercase" colSpan={authService.getAuth({ roles: [...ADM] }) ? 6 : 4}>
            Montant total
          </td>
          <td className="fw-bold">{totalAmount}</td>
          <td className="fw-bold text-danger">{dueAmount}</td>
          <td className="fw-bold text-success">{paidAmount}</td>
        </tr>
      </tbody>
    </table>
  );

  const genExcel = () => {
    excelService.exportAsExcelFileByTableId("bills", "bills");
  };

  const genPdf = (action) => {
    hlpBillPdf.genPdf(action, filtereds, status, dates);
  };

  const genBill = async ({ param }) => {
    try {
      await httpService.postParam(param, "sales/genBillManually");
      fetchTobs();
      Toastify.success();
    } catch (error) {
      console.log(error);
    }
    setModal(false);
  };

  const genBillAvoir = async (values) => {
    setModalAvoir(false);
    try {
      await httpService.postBody(values, "billlines/new");
      fetchTobs();
      Toastify.success();
    } catch (error) {}
  };

  const handleAsyncSearch = async (search) => {
    try {
      const { data } = await httpService.postParam(search, "bills/searchBill");
    } catch (error) {
      console.log(error);
    }
  };

  const onGenEntry = async (bill) => {
    const nTobs = hlpCrud.updateTobOnList(bill, bills);
    setBills(nTobs);
    Toastify.success();
  };

  // ------ checks actions ------
  const onPayWithoutEffetOnCash = async () => {
    setModalConfirm(false);
    const billIds: number[] = checks.map((x) => x.id);
    const { data } = await httpService.postBody({ billIds }, "bills/paymentWithoutEffetOnCash");
    if (data) {
      // const nBills = bills.filter((x) => !checks.includes(x.id));
      const nBills = bills.filter((x) => !billIds.includes(x.id));
      setBills(nBills);
      setChecks([]);
      Toastify.success();
    }
    try {
    } catch (error) {}
  };

  const checkedBillsAction = () => <BtnAction dropMenu={checksAction} elpDrop onDrop={onCheckedBillsAction} />;
  const onCheckedBillsAction = (e) => {
    switch (e) {
      case 1:
        setModalConfirm(true);
        break;
    }
  };

  const extraFilters = (row) =>
    row.ref +
    (row.fromCron ? "@cron" : !row.fromCron ? "@ncron" : "") +
    (row.hasTva ? "@tva" : "") +
    (row.nbPrint > 0 ? "@print" : row.nbPrint === 0 ? "@nprint" : "") +
    (row.isBack ? "@retour" : !row.isBack ? "@nretour" : "") +
    (row.client.ste?.grp?.code.toLocaleLowerCase() ? "@" + row.client.ste.grp.code.toLocaleLowerCase() : "") +
    (row.client.role?.code.toLocaleLowerCase() ? "@" + row.client.role.code.toLocaleLowerCase() : "");
  // (index + 1 ? "@l" + (index + 1) : "");

  // --------------------
  const columns: ReactTableColumnType[] = useMemo(
    () => [
      /* {
        id: "select",
        header: ({ table }) => {
          return (
            <TskCheckbox
              {...{
                checked: table.getIsAllRowsSelected(),
                indeterminate: table.getIsSomeRowsSelected(),
                onChange: table.getToggleAllRowsSelectedHandler(),
              }}
            />
          );
        },
        cell: ({ row }) => (
          <div className="px-1">
            <TskCheckbox
              {...{
                checked: row.getIsSelected(),
                disabled: !row.getCanSelect(),
                indeterminate: row.getIsSomeSelected(),
                onChange: row.getToggleSelectedHandler(),
              }}
            />
          </div>
        ),
      }, */
      {
        header: () => checkedBillsAction(),
        accessorKey: "checks",
        cell: ({ row }) => {
          const bill: Bill = row.original;
          return <input type="checkbox" name="bill.id" onChange={(event) => onChecked(event, bill)} />;
        },
        auth: authService.getAuth({ roles: [...ADM] }),
        enableSorting: false,
      },
      {
        header: () => <i className="fas fa-trash"></i>,
        accessorKey: "undoPay",
        cell: ({ row }) => <BtnDel onDelete={handleDelete} tob={row.original} />,
        auth: authService.getAuth({ roles: ["sadm"] }),
        style: { width: "2%", center: true },
      },
      { header: "id", accessorKey: "id", auth: authService.getAuth({ roles: ["sadm"] }) },
      {
        header: "Date",
        accessorKey: "billDate",

        cell: ({ row }) => dateFormatter(row.original.billDate, "dmy", "/"),
      },
      {
        header: "reference",
        accessorKey: "ref",
        // accessorFn: (row) => row.ref + (row.fromCron ? "@cron" : !row.fromCron ? "@ncron" : ""),
        accessorFn: (row) => extraFilters(row),
        cell: ({ row }) => {
          const bill: Bill = row.original;
          return (
            <>
              <BtnBillAction
                auth={authService.getAuth({ roles: [...PHD, "cai"] })}
                delBillAuth={authService.getAuth({ roles: ADM })}
                bill={bill}
                onDelete={handleDelete}
                onUpdateNbPrint={updateNbPrint}
                onGenEntry={onGenEntry}
              />
            </>
          );
        },
      },
      {
        header: "client",
        accessorFn: (row) => row.client.username,
        cell: ({ row }) => <LinkUserCard user={row.original.client} userProp={row.original.client.username} />,
      },
      {
        header: "montant",
        accessorKey: "totalAmount",
        cell: ({ row }) => <span>{currencyFormatter(+row.original.totalAmount)}</span>,
      },
      {
        header: "solde",
        accessorKey: "dueAmount",
        cell: ({ row }) => {
          const bill: Bill = row.original;
          return (
            <DisplayPopover
              trigger={"click"}
              title={`${bill.ref} ( ${bill.client.username} )`}
              content={
                <table className="table table-striped table-responsive ">
                  <tbody>
                    {React.Children.toArray(
                      (bill.payments || []).map((payment) => (
                        <tr>
                          <td>{dateFormatter(payment.paymentDate, "dmy", "/")}</td>
                          <td>{currencyFormatter(payment.paidAmount)}</td>
                          <td>
                            <GenBillPaymentReceipt payment={payment} />
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              }>
              <span className={+bill.dueAmount === 0 ? "text-success" : "text-danger"}>{currencyFormatter(+row.original.dueAmount)}</span>
            </DisplayPopover>
          );
        },
      },
      {
        header: "status",
        accessorKey: "sold",
        cell: ({ row }) => <BtnBillStatus bill={row.original} onPaySuccess={onPaySuccess} />,
      },
      { ...ColEditDel({ handleDelete, handleEdit, auth: authService.getAuth({ roles: ["sadm"] }) }) },
    ],
    [genPdf]
  );

  return (
    <>
      <TskTable
        getSelectedRows={(rows) => console.log(rows)}
        lBtns={{
          btns: btns,
          onBtn: onBtn,
        }}
        tableId="bills"
        onSelectedDate={handleSelectedDates}
        dateFormat={isStaffSte(["cpa", "eqeer"], authService.authUser().ste.name) ? "day" : "year"}
        loading={loading}
        columns={columns}
        data={bills}
        lDropMenu={{
          dropMenu: actions,
          onDrop: handleAction,
          elpDrop: true,
          auth: authService.getAuth({ roles: [...PHD, "cai", ...COMPTA] }),
        }}
        onAsyncSearch={handleAsyncSearch}
        //
        preaddons={addTable}
        addons={addTable}
        onGenExcel={genExcel}
        onGenPdf={genPdf}
        getRows={(rows) => setFiltereds(rows.map((row) => row.original))}
        initialState={{
          columnVisibility: {
            checks: authService.getAuth({ roles: [...ADM] }),
            id: authService.getAuth({ roles: [...ADM] }),
            undoPay: authService.getAuth({ roles: [...ADM] }),
            actions: authService.getAuth({ roles: [...ADM] }),
            del: authService.getAuth({ roles: [...ADM] }),
          },
        }}
      />
      <ModalBase
        icon="fas fa-pen"
        title={"génération manuelle de facture(s)"}
        content={<GenBill onCancel={() => setModal(false)} onSubmit={genBill} />}
        show={modal}
        onCloseModal={() => setModal(false)}
        footer={false}
      />
      <ModalBase
        size="lg"
        icon="fas fa-pen"
        title={"génération de facture avoir"}
        content={<AdditBillLine onCancel={() => setModalAvoir(false)} onSubmit={genBillAvoir} />}
        show={modalAvoir}
        onCloseModal={() => setModalAvoir(false)}
        footer={false}
      />
      <ModalConfirm
        content={"Vous êtes sur le point des faire des payments qui n'ont pas d'effet sur la caisse. Veuillez confirmer votre action"}
        show={modalConfirm}
        onCloseModal={() => setModalConfirm(false)}
        onApprove={onPayWithoutEffetOnCash}
      />
    </>
  );
};

export default ListBill;
