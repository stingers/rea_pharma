import { currencyFormatter, currencyFormatterCfa, dateFormatter, displayDateRangeFr } from "asv-hlps";
import { ModalBase, ReactTableColumnType, TskTable, colToolTip } from "asv-hlps-react";

import { useMemo, useState } from "react";
import { Col, Row } from "react-bootstrap";

import authService from "../../auth/services/authService";
import useQueryPostCrud from "../../hooks/uses/useQueryPostCrud";
import { CpaStatDefinition } from "../../pdfs/CpaStatDefinition";
import { PdfProductTables } from "../../pdfs/products/PdfProductTables";
import excelService from "../../services/excelService";
import httpService from "../../services/httpService";
import pdfService from "../../services/pdfService";
import DisplayDate from "../../shared/displays/display-date";
import DisplayWidget, { WidgetType } from "../../shared/displays/display-widget";
import hlpProduct from "../stores/products/helpers/hlpProduct";
import hlpStatSale from "./helpers/hlpStatSale";
import StatListUg from "./stat-list-ug";

type TobProps = {
  userId?: number;
};
const StatProductBy = ({ userId }: TobProps) => {
  // const date: string | Date = new Date().toLocaleDateString();
  const date: string | Date = dateFormatter(new Date(), "ymd", "-");
  // const [tobs, setTobs] = useState([]);
  // const [loading, setLoading] = useState(true);
  const [dates, setDates] = useState({ fromDate: date, toDate: date });
  const [modal, setModal] = useState(false);
  // --------------------
  const user = authService.authUser();
  const id: number = userId ? userId : user.id;
  // --------------------
  const { data: tobs, isLoading } = useQueryPostCrud({
    httpService,
    keys: ["stat-prodduct-by", id, dates],
    url: "statsaleproducts",
    params: { dates, pvdId: id },
  });

  // --------------------
  const onSelectedDates = (dates) => {
    setDates(dates);
    // fetchDatas();
  };
  const handleRefresh = () => {
    // fetchDatas();
  };

  /* const getTrColor = (tobs) => {
    for (const tob of tobs) {
      return hlpStatSale.getColor(tob);
    }
  }; */

  const columns: ReactTableColumnType[] = useMemo(
    () => [
      {
        header: "ref",
        accessorKey: "ref",
        style: { width: "20%" },
      },
      {
        header: "designation",
        accessorKey: "designation",
        cell: ({ row }) => <span style={{ color: hlpStatSale.getColor(row.original) }}>{row.original.designation}</span>,
      },
      {
        header: "prix pght",
        accessorKey: "stores[0].pghtPrice",
      },
      {
        header: "stock",
        accessorKey: "stock",
        cell: ({ row }) => hlpProduct.stock(row.original, "all"),
      },
      {
        header: () => colToolTip("Q.V", "quantité vendue"),
        accessorKey: "stat.qtityDlvr",
        cell: ({ row }) => row.original.stat.qtityDlvr || 0,
      },
      {
        header: () => colToolTip("ug", "quantité ug"),
        accessorKey: "stat.qtityFree",
        cell: ({ row }) => row.original.stat.qtityFree || 0,
      },
      {
        header: () => colToolTip("MV CESSION", "MONTANT VENTES (CESSION)"),
        accessorKey: "stat.saledAmount",
        cell: ({ row }) => currencyFormatter(Math.ceil(row.original.stat.saledAmount || 0)),
      },
      {
        header: () => colToolTip("MV PGHT", "MONTANT VENTES (PGHT)"),

        accessorKey: "pght",
        cell: ({ row }) => {
          const tob = row.original;
          return <span>{currencyFormatter(Math.ceil((tob.stat.qtityDlvr || 0) * tob?.stores[0]?.pghtPrice || 0))}</span>;
        },
      },
      {
        header: "MONTANT DU STOCK",
        accessorKey: "amountStock",
        cell: ({ row }) => {
          const tob = row.original;
          return <span>{currencyFormatter(Math.ceil((tob.stat.qtityDlvr || 0) * tob?.stores[0]?.pghtPrice || 0))}</span>;
        },
      },
    ],
    [dates, onSelectedDates]
  );
  // --------------------
  const onGenPdf = (action: string) => {
    const stat = {
      totalAmount: hlpStatSale.getTotalAmount(tobs),
      nbProducts: tobs.length,
      nbTotalSaled: hlpStatSale.getTotalQtitySaled(tobs),
    };
    pdfService.generatePdf(
      action,
      CpaStatDefinition.generic(
        // "Factures " + formatDateYmdHypenFr(this.fromDate) + " au " + formatDateYmdHypenFr(this.toDate),
        `Stat   ${user.ste.grp.name}  ${user.ste.name}  du ${displayDateRangeFr(dates.fromDate, dates.toDate)}`,
        PdfProductTables.productStatByTable(tobs),
        stat,
        "landscape"
      )
    );
  };
  const onGenExcel = () => {
    excelService.exportAsExcelFileByTableId("statProduct", user.ste.name + "stat");
  };

  const onBtn = (prop) => {
    setModal(true);
  };

  const widgets: WidgetType[] = [
    { title: "nombre de produits", content: tobs?.length },
    { title: "nombre vendu", content: hlpStatSale.getTotalQtitySaled(tobs) },
    { title: "Montant total des ventes", content: currencyFormatterCfa(hlpStatSale.getTotalAmount(tobs)) },
    // { title: "date", content: <BtnDatePickerDropdown onSelectedDate={onSelectedDates} /> },
    { title: "date", content: <DisplayDate dates={dates} /> },
  ];

  // --------------------j
  return (
    <>
      <Row className="py-2 px-2">
        <Col>
          <DisplayWidget widgets={widgets} />
        </Col>
      </Row>

      <TskTable
        lBtns={{
          btns: [
            { id: 1, label: "stat ug" },
            // { id: 2, label: "premption proche" },
          ],
          onBtn: onBtn,
        }}
        pushTrs={
          <tr className="fw-bold">
            <td colSpan={9} className="text-end ">
              Montant total ventes
            </td>
            <td>{currencyFormatterCfa(hlpStatSale.getTotalAmount(tobs))}</td>
          </tr>
        }
        // trClass={"bg-success"}
        theadClass="text-uppercase"
        // tableClass={classNames("table-hover table-sm", `${hlpStatSale.getColor(tobs)}`)}
        // trStyle={{ backgroundColor: getTrColor(tobs) }}
        // loading={isLoading}
        columns={columns}
        data={tobs || []}
        onSelectedDate={onSelectedDates}
        onGenPdf={onGenPdf}
        onGenExcel={onGenExcel}
        tableId={"statProduct"}
        headTitle={user.ste.name}
      />
      <ModalBase size="xl" title={"campagne ug"} show={modal} onCloseModal={() => setModal(false)} content={<StatListUg />} />
    </>
  );
};

export default StatProductBy;
