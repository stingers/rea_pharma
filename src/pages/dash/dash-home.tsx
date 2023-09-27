import DisplayBlockquote from "asv-hlps-react/lib/cjs/reacts/displays/display-blockquote";
import useReadonlyFetchTobs from "asv-hlps-react/lib/cjs/reacts/hooks/uses/useReadonlyFetchTobs";
import { Card, Row } from "react-bootstrap";

import dayjs from "dayjs";
import { ADM, PHD } from "../../auth/services/auth-menu";
import authService from "../../auth/services/authService";
import ListBadPayer from "../../core/bills/list-bad-payer";
import httpService from "../../services/httpService";
import DisplayPgTitle from "../../shared/displays/DisplayPgTitle";

const DashHome = () => {
  const { tob: pdtInexpiredSoon } = useReadonlyFetchTobs(httpService, "productins/nbrexpiresoon", { one: true });
  const { tob: countUgOut } = useReadonlyFetchTobs(httpService, "productpromos/countfinish", { one: true });
  const { tob: countLeave } = useReadonlyFetchTobs(httpService, "leaves/waiting", { one: true });
  const { tobs: countPhWithBillsNopaidGreaterThan4 } = useReadonlyFetchTobs(httpService, "bills/getClientWithBillsNoPaidMoreThan4");

  // ------ play ------

  console.log(dayjs(new Date()).subtract(7, "day"));
  // --------------------
  return (
    <>
      {/* ccc */}
      <DisplayPgTitle pgTitle="DashBoard" />
      <Card className="shadow">
        <Card.Header className="bg-white text-black fw-bold">
          <h3 className="header-title fw-bold ">Info importantes</h3>
        </Card.Header>
        <Card.Body>
          {/* <Dropdown className="float-end" align="end">
            <Dropdown.Toggle as="a" className="arrow-none card-drop">
              <i className="mdi mdi-dots-vertical"></i>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item>Settings</Dropdown.Item>
              <Dropdown.Item>Action</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown> */}

          {/* <h4 className="header-title mb-3">Info importantes</h4> */}
          <Row>
            {/* <DisplayBlockquote link="/dash/stores/expired" state={"stores_products_expired"}> */}
            <DisplayBlockquote auth={authService.getAuth({ roles: PHD })} link="/dash/stores/expired">
              Produits proches péremption de moins de <span className="text-danger"> -3 mois</span>
              <span className="text-danger fw-bold d-inline float-end">{pdtInexpiredSoon?.nbr}</span>
            </DisplayBlockquote>

            <DisplayBlockquote link="/dash/stores/products/promos" auth={authService.getAuth({ roles: PHD })}>
              Campagne de ug terminée
              <span className="text-danger fw-bold d-inline float-end">{countUgOut?.nbr}</span>
            </DisplayBlockquote>

            <DisplayBlockquote auth={authService.getAuth({ roles: PHD })} link="/dash/users/sf/leaves">
              Demande de congés en attente de validation
              <span className="text-danger fw-bold d-inline float-end">{countLeave?.nbr}</span>
            </DisplayBlockquote>

            <DisplayBlockquote
              auth={authService.getAuth({ roles: ADM })}
              withModal={{ size: "lg", content: <ListBadPayer tobs={countPhWithBillsNopaidGreaterThan4} /> }}>
              Les pharmacies ayant plus de <span className="text-danger"> 4 factures impayées</span>
              <span className="text-danger fw-bold d-inline float-end">{countPhWithBillsNopaidGreaterThan4.length}</span>
            </DisplayBlockquote>

            <DisplayBlockquote withModal={{}} auth={authService.getAuth({ roles: PHD })}>
              Les commandes en attente de livraison de <span className="text-danger"> plus 7 jours</span>
              <span className="text-danger fw-bold d-inline float-end">{pdtInexpiredSoon?.nbr}</span>
            </DisplayBlockquote>
          </Row>
        </Card.Body>
      </Card>
      {/* <ProgressBar now={100} className="mb-2" variant={getPeriodDateColor("2024-01-30")} /> */}
    </>
  );
};

export default DashHome;
