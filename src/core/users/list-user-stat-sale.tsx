import { ReactTableColumnType, TskTable, useQueryPost } from "asv-hlps-react";
import { colToolTip } from "asv-hlps-react/lib/cjs/reacts/tables/col-react-table";
import { currencyFormatter, currencyFormatterCfa } from "asv-hlps/lib/cjs/utils";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import { DocDefinition } from "../../pdfs/DocDefinition";
import { PdfTables } from "../../pdfs/PdfTables";
import httpService from "../../services/httpService";
import pdfService from "../../services/pdfService";

const ListUserStatSale = () => {
  const { code: grpCode } = useParams();
  const [filtereds, setFiltereds] = useState([]);
  const [dates, setDates] = useState(null);
  const { data: tobs, isLoading } = useQueryPost({
    httpService,
    url: "statclients",
    postParam: { grpCode, dates },
    keys: ["statclients", grpCode, dates],
  });

  const onSelectedDates = (dates) => {
    setDates(dates);
  };

  const onGenPdf = (action: string) => {
    pdfService.generatePdf(action, DocDefinition.generic("produits", PdfTables.productTable(filtereds)));
  };
  // --------------------
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
        header: () => colToolTip("N.A", "nombre d'achats"),
        accessorKey: "nbSale",
      },
      {
        header: () => colToolTip("N.P", "nombre de produits"),
        accessorKey: "nbProduct",
      },

      {
        header: () => colToolTip("Q.T", "quantité totale"),
        accessorKey: "qtityTotal",
        cell: ({ row }) => currencyFormatter(+row.original.sumQtityOdr + +row.original.sumQtityFree),
      },
      {
        header: () => colToolTip("Q.C", "quantité commandée"),
        accessorKey: "sumQtityOdr",
        cell: ({ row }) => currencyFormatter(row.original.sumQtityOdr),
      },
      {
        header: () => colToolTip("Q.l", "quantité livée"),
        accessorKey: "sumQtityDlvr",
        cell: ({ row }) => currencyFormatter(row.original.sumQtityDlvr),
      },
      {
        header: () => colToolTip("ug", "unités gratuites"),
        accessorKey: "sumQtityFree",
        cell: ({ row }) => currencyFormatter(row.original.sumQtityFree),
      },
      {
        header: "montant",
        accessorKey: "sumAmountQtityDlvr",
        cell: ({ row }) => <span className="fw-bold">{currencyFormatter(parseInt(row.original.sumAmountQtityDlvr))}</span>,
      },
    ],
    []
  );
  // --------------------
  return (
    <TskTable
      onGenPdf={onGenPdf}
      // loading={isLoading}
      columns={columns}
      data={tobs || []}
      onSelectedDate={onSelectedDates}
      headTitle={"stats ventes"}
      getRows={(rows) => setFiltereds(rows.map((row) => row.original))}
    />
  );
};

export default ListUserStatSale;
