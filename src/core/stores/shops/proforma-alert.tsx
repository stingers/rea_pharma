import { Alert, Col, Row } from "react-bootstrap";

const paths: string[] = ["proformacheckout", "proformacart"];

const ProformaAlert = ({ isProforma, path }) => {
  // const location = useLocation();
  // const path = pathName(location);
  // const getIsProforma = sesStorageGet("isProforma");
  // const paths: string[] = ["checkout", "proformacart"];

  return (
    <>
      {isProforma && paths.includes(path) && (
        <Row>
          <Col>
            <Alert variant="info">
              <div className="text-uppercase fw-bold fs-4 text-center">Commande proforma</div>
            </Alert>
          </Col>
        </Row>
      )}
    </>
  );
};

export default ProformaAlert;
