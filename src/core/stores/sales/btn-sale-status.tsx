import { dateFormatter, Sale } from "asv-hlps";
import DisplayPopover from "asv-hlps-react/lib/cjs/reacts/displays/display-popover";

import { PHD } from "../../../auth/services/auth-menu";
import authService from "../../../auth/services/authService";
import BtnSaleAction from "./btn-sale-action";

type TobProps = {
  sale: Sale;
  onReportedSaleBill?: (sale: Sale) => void;
  menu?: boolean;
  print?: boolean;
};
const BtnSaleStatus = ({ sale, onReportedSaleBill, print = true, menu = false }: TobProps) => {
  return (
    <BtnSaleAction
      print={print}
      sale={sale}
      authReportSale={authService.getAuth({ roles: PHD }) && !sale.bill}
      onReportedSaleBill={onReportedSaleBill}
      menu={menu}
      auth>
      {sale.store.toLowerCase() !== "cpa" && <span className="text-success font-weight-bold mx-1">EQEER</span>}

      <DisplayPopover
        title={`${sale.ref}`}
        // placement={"top"}
        content={
          <table className="table table-striped table-responsive ">
            <tbody className="fs-6">
              {sale.user && (
                <tr>
                  <th className="text-uppercase">user</th>
                  <td>{sale.user.username}</td>
                  <td>{dateFormatter(sale.saleDate, "dmy-hm")}</td>
                </tr>
              )}
              {sale.processingMan && (
                <tr>
                  <th className="text-uppercase">coll</th>
                  <td>{sale.processingMan.username}</td>
                  <td>{dateFormatter(sale.processingDate, "dmy-hm")}</td>
                </tr>
              )}
              {sale.processedMan && (
                <tr>
                  <th className="text-uppercase">Ctrl</th>
                  <td>{sale.processedMan.username}</td>
                  <td>{dateFormatter(sale.processedDate, "dmy-hm")}</td>
                </tr>
              )}
              {sale.deliveredMan && (
                <tr>
                  <th className="text-uppercase">Dlvr</th>
                  <td>{sale.deliveredMan?.username}</td>
                  <td>{dateFormatter(sale.deliveredDate, "dmy-hm")}</td>
                </tr>
              )}
            </tbody>
          </table>
        }>
        {sale.ref}
      </DisplayPopover>
    </BtnSaleAction>
  );
};

export default BtnSaleStatus;
