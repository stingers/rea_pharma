import { currencyFormatterCfa, displayDateRangeFr } from "asv-hlps";
import { ReactTableColumnType, TskTable } from "asv-hlps-react";
import { useEffect, useMemo, useState } from "react";
import { Card, Col, ListGroup, Row } from "react-bootstrap";

import { CpaDefinition } from "../../pdfs/CpaDefinition";
import { PdfTables } from "../../pdfs/PdfTables";
import httpService from "../../services/httpService";
import pdfService from "../../services/pdfService";
import CashWidget from "./cash-widget";
import { HlpCash } from "./helpers/hlpCash";
import totalIncomesPipe from "./helpers/pipes/total-incomes-pipe";

const ListBilan = () => {
  const currentDate = new Date();
  // const [dates, setDates] = useState({ fromDate: currentDate, toDate: currentDate });
  const [dates, setDates] = useState({ fromDate: currentDate, toDate: currentDate });
  const [spents, setSpents] = useState([]);
  const [filteredSpents, setFilteredSpents] = useState([]);
  const [feeds, setFeeds] = useState([]);
  const [filteredFeeds, setFilteredFeeds] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [filteredIncomes, setFilteredIncomes] = useState([]);

  const fetchTobs = async () => {
    const { data: tobs } = await httpService.postBody({ dates }, "cashs");
    // ------ spents ------
    setSpents(tobs.spents);
    // ------ feeds ------
    setFeeds(tobs.feeds);
    // ------ incomes ------
    setIncomes(tobs.payments);
  };

  useEffect(() => {
    fetchTobs();
    return () => {};
  }, [dates]);

  const onSelectedDates = (selectedDates) => {
    setDates(selectedDates);
    fetchTobs();
  };

  const columnSpents: ReactTableColumnType[] = useMemo(
    () => [
      {
        header: "description",
        accessorKey: "description",
      },
      {
        header: "montant",
        accessorKey: "amount",
        cell: ({ row }) => currencyFormatterCfa(+row.original.amount),
      },
    ],
    []
  );

  const spentAddons = useMemo(() => {
    return (
      <ListGroup>
        <ListGroup.Item className="d-flex justify-content-between align-items-center text-primary text-uppercase">
          Montant total
          <span className="fw-bold">{currencyFormatterCfa(HlpCash.getTotalSpents(filteredSpents))}</span>
        </ListGroup.Item>
      </ListGroup>
    );
  }, [filteredSpents]);

  const incomeAddons = useMemo(() => {
    return (
      <ListGroup>
        <ListGroup.Item className="d-flex justify-content-between align-items-center text-primary text-uppercase my-0 ">
          espèces
          <span className="fw-bold">{currencyFormatterCfa(HlpCash.getTotalIncomesCashs(filteredIncomes))}</span>
        </ListGroup.Item>
        <ListGroup.Item className="d-flex justify-content-between align-items-center text-primary text-uppercase my-0">
          cheques/virements
          <span className="fw-bold">{currencyFormatterCfa(totalIncomesPipe.trans(filteredIncomes, "chequeVirement"))}</span>
        </ListGroup.Item>
        <ListGroup.Item className="d-flex justify-content-between align-items-center text-primary text-uppercase my-0">
          Montant total
          <span className="fw-bold">{currencyFormatterCfa(HlpCash.getTotalIncomes(filteredIncomes))}</span>
        </ListGroup.Item>
      </ListGroup>
    );
  }, [filteredIncomes]);

  const columnIncomes: ReactTableColumnType[] = useMemo(
    () => [
      {
        header: "clients",
        // accessorKey: "bill.client.username",
        accessorFn: (row) => row.bill.client.username,
      },
      {
        header: "mode de paiement",
        accessorKey: "method.name",
      },
      {
        header: "montant",
        accessorKey: "paidAmount",
        cell: ({ row }) => currencyFormatterCfa(+row.original.paidAmount),
      },
    ],
    []
  );

  const onGenSpentPdf = (action) => {
    pdfService.generatePdf(
      // action, DocDefinition.generic('Les recettes', PdfTables.bilanIncomesTable(this.incomes))
      action,
      CpaDefinition.spending(
        "Les depenses du " + displayDateRangeFr(dates.fromDate, dates.toDate),
        PdfTables.bilanSpendingTable(filteredSpents),
        filteredSpents
      )
    );
  };

  const onGenIncomesPdf = (action) => {
    pdfService.generatePdf(
      // action, DocDefinition.generic('Les recettes', PdfTables.bilanIncomesTable(this.incomes))
      action,
      CpaDefinition.incomes(
        "Les recettes du " + displayDateRangeFr(dates.fromDate, dates.toDate),
        PdfTables.bilanIncomesTable(filteredIncomes),
        filteredIncomes
      )
    );
  };

  return (
    <>
      <CashWidget spents={spents} feeds={feeds} incomes={incomes} onSelectedDates={onSelectedDates} />
      <Row>
        <Col md={6}>
          <Card>
            <Card.Body>
              <TskTable
                // getRows={getRows}
                // globalFilter={getFilt}
                // filtereds={getFilt}
                tableMaxHeight={400}
                columns={columnSpents}
                data={spents}
                loading={false}
                headTitle={"Dépenses"}
                addons={spentAddons}
                getRows={(rows) => setFilteredSpents(rows.map((row) => row.original))}
                onGenPdf={onGenSpentPdf}
                // tableClass="fs-6 fw-bold"
              />
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Body>
              <TskTable
                tableMaxHeight={400}
                columns={columnIncomes}
                data={incomes}
                loading={false}
                headTitle={"Recettes"}
                addons={incomeAddons}
                getRows={(rows) => setFilteredIncomes(rows.map((row) => row.original))}
                // tableClass="fs-5 fw-bold"
                onGenPdf={onGenIncomesPdf}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default ListBilan;
