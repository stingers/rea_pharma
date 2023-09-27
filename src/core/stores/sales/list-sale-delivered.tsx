import { Bill, dateFormatter, Sale } from "asv-hlps";
import { ColDel, colToolTip, ReactTableColumnType, Toastify, TskTable, useQueryCrud } from "asv-hlps-react";
import DisplayPopover from "asv-hlps-react/lib/cjs/reacts/displays/display-popover";
import classNames from "classnames";
import { useMemo, useState } from "react";
import { Button } from "react-bootstrap";

import { ADM } from "../../../auth/services/auth-menu";
import authService from "../../../auth/services/authService";
import { CpaDefinition } from "../../../pdfs/CpaDefinition";
import { HlpPdf } from "../../../pdfs/hlpPdf";
import { PdfSaleTables } from "../../../pdfs/sales/PdfSaleTables";
import httpService from "../../../services/httpService";
import pdfService from "../../../services/pdfService";
import hlpCrud from "../../../shared/helpers/hlpCrud";
import LinkUserCard from "../../users/cards/link-user-card";
import BtnSaleStatus from "./btn-sale-status";

interface TobType {
  clientId?: number;
}

const ListSaleDelivered = ({ clientId }: TobType) => {
  // const [tobs, setTobs] = useState([]);
  // const [dates, setDates] = useState(null);
  // const { setHlpDates, hlpDates } = useHlpContext();

  // const [dates, setDates] = useState(hlpDates);
  const [dates, setDates] = useState(null);
  const [filtereds, setFiltereds] = useState([]);

  const { tobs, error, isLoading, handleDelete } = useQueryCrud({
    httpService,
    keys: ["salesdelivered", dates, clientId],
    postParam: { dates, userId: clientId },
    url: "sales/delivered",
    urlDel: "sales",
  });

  // const { setDates };

  const onSelectedDates = (dates) => {
    setDates(dates);
    // setHlpDates(dates);
    // fetchTobs();
  };

  /* useEffect(() => {
    setHlpDates(dates);
  }, []); */

  const onGenPdf = ({ action }) => {
    // console.log(pdf);
    const label = "Liste commandes livrées";
    pdfService.generatePdf(
      action,
      CpaDefinition.generic(HlpPdf.displayPdfDate(label, dates.fromDate, dates.toDate), PdfSaleTables.listSaleDelivered(filtereds)),
      "landscape"
    );
  };

  const colStatus = (bill: Bill) => {
    return (
      <Button className={classNames("btn btn-xs text-uppercase ", !bill ? "btn-warning" : bill.isPaid ? "btn-success" : "btn-danger")}>
        {bill ? bill?.ref : "a facturer"}
      </Button>
    );
  };

  const onReportedSaleBill = async (sale) => {
    sale.isReported = !sale.isReported;
    const oldTobs = tobs;
    const nTobs = hlpCrud.updateTobOnList(sale, tobs);
    // setTobs(nTobs);
    try {
      await httpService.postId(sale.id, "sales/reported");
      Toastify.success();
    } catch (error) {
      // setTobs(oldTobs);
    }
  };

  const columns: ReactTableColumnType[] = useMemo(
    () => [
      { header: "id", accessorKey: "id" },
      { ...ColDel({ handleDelete }) },

      /* {
        header: "Date",
        accessorKey: "createdAt",
        cell: ({ row }) => <span>{dateFormatter(row.original.createdAt, "dmy", "/")} </span>,

        style: { width: "10%", textAlign: "center" },
      }, */

      {
        header: "ref",
        accessorKey: "ref",
        cell: ({ row }) => {
          const sale: Sale = row.original;
          return <BtnSaleStatus sale={sale} />;
        },
      },

      {
        header: "client",
        accessorKey: "client.username",
        cell: ({ row }) => {
          const sale = row.original;
          return (
            <DisplayPopover title={sale.client.username} content={sale.client.ste.name}>
              <LinkUserCard user={row.original.client} userProp={row.original.client.username} />
            </DisplayPopover>
          );
        },
      },

      {
        header: () => colToolTip("créé le", "Date de creation"),
        accessorKey: "saleDate",
        cell: ({ row }) => <span>{dateFormatter(row.original.saleDate, "dmy", "/")} </span>,
      },

      {
        header: () => colToolTip("livrée le", "Date de livraison"),
        accessorKey: "deliveredDate",
        cell: ({ row }) => <span>{dateFormatter(row.original.deliveredDate, "dmy", "/")} </span>,
      },

      {
        header: "statut",
        accessorKey: "status",
        cell: ({ row }) => <span>{colStatus(row.original.bill)} </span>,
        style: { width: "12%", textAlign: "center" },
      },
    ],
    []
  );
  return (
    <TskTable
      onGenPdf={onGenPdf}
      onSelectedDate={onSelectedDates}
      headTitle={"Commandes"}
      columns={columns}
      data={tobs || []}
      loading={false}
      dateFormat={"month"}
      getRows={(rows) => setFiltereds(rows.map((row) => row.original))}
      initialState={{
        columnVisibility: {
          actions: authService.getAuth({ roles: [...ADM] }),
          del: authService.getAuth({ roles: [...ADM] }),
          id: authService.getAuth({ roles: ["sadm"] }),
        },
      }}
    />
  );
};

export default ListSaleDelivered;
