import useReadonlyFetchTobs from "asv-hlps-react/lib/cjs/reacts/hooks/uses/useReadonlyFetchTobs";
import { Col, Row } from "react-bootstrap";
import httpService from "../../services/httpService";
import DisplayChart from "../../shared/charts/DisplayChart";

const MemoUser = () => {
  const { tobs } = useReadonlyFetchTobs(httpService, "users/memos");

  return (
    <Row>
      {/* {loading && <Loader />} */}
      <Col xl={4} lg={6}>
        <DisplayChart title="utilisateurs" tobs={tobs} labelProp="steGrp" dataProp="nbr" height={307} />
      </Col>
      <Col xl={4} lg={6}>
        {/* <SalesChart /> */}
      </Col>
      <Col xl={4}>{/* <MarketingChart /> */}</Col>
    </Row>
  );
};

export default MemoUser;
