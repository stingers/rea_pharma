import useReadonlyFetchTobs from "asv-hlps-react/lib/cjs/reacts/hooks/uses/useReadonlyFetchTobs";
import { useCallback } from "react";
import { Card } from "react-bootstrap";

import httpService from "../../services/httpService";
import DisplayPgTitle from "../../shared/displays/DisplayPgTitle";

const ListZut = () => {
  const { tobs } = useReadonlyFetchTobs(httpService, "zut/sumproductsInvHistory");

  return (
    <>
      <DisplayPgTitle pgTitle={"Zut"} />
      <Card>
        <Card.Body>hdjfh</Card.Body>
      </Card>
    </>
  );
};

export default ListZut;
