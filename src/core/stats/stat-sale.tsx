import { PHD } from "../../auth/services/auth-menu";
import authService from "../../auth/services/authService";
import ListStatSale from "./list-stat-sale";
import StatProductBy from "./stat-product-by";

const StatSale = () => {
  return (
    <>
      {authService.getAuth({ client: { roles: ["ceo"], steGrps: ["ag", "la", "fr"] } }) && <StatProductBy />}
      {authService.getAuth({ roles: [...PHD], client: { steGrps: ["ph"] } }) && <ListStatSale />};
    </>
  );
};
export default StatSale;
