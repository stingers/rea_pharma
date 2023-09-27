import { dateFormatter, Sale } from "asv-hlps";
import { useQueryGet } from "asv-hlps-react";
import React from "react";
import { ListGroup, ListGroupItem } from "react-bootstrap";

import { PHD } from "../../auth/services/auth-menu";
import authService from "../../auth/services/authService";
import httpService from "../../services/httpService";
import DisplayBlockquote from "../../shared/displays/display-blockquote";

const MemoBill = () => {
  const { data: salesReported } = useQueryGet({
    httpService,
    keys: ["sales_reported"],
    url: "sales/isReported",
  });
  // const [salesReported, setSalesReported] = useState<Sale[]>([]);

  /* const fetchTobs = async () => {
    const { data: tobs } = await httpService.get("sales/isReported");
    setSalesReported(tobs);
  }; */

  const saleTable = (sales: Sale[]) => {
    return (
      <ListGroup as="ol" className="list-group-numbered">
        {React.Children.toArray(
          (salesReported || []).map((sale) => (
            <ListGroupItem as={"li"}>
              {sale.ref}
              <span className="float-end">{dateFormatter(sale.saleDate, "dmy", "/")}</span>
              {/* <span>{dateFormatter(sale.saleDate, "dmy","dmy", "/")}</span> */}
            </ListGroupItem>
          ))
        )}
      </ListGroup>
    );
  };

  /* useEffect(() => {
    fetchTobs();
  }, []); */

  return (
    <>
      {authService.getAuth({ roles: PHD }) && (
        <DisplayBlockquote spinner={false} withModal={{ title: "liste des commandes reportées", content: saleTable(salesReported) }}>
          <span>
            Commandes dont la facturation est reportée<span className="text-danger float-end">{salesReported?.length}</span>
          </span>
        </DisplayBlockquote>
      )}
    </>
  );
};

export default MemoBill;
