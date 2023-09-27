import DisplayTooltip from "asv-hlps-react/lib/cjs/reacts/displays/display-tooltip";
import { Sale } from "asv-hlps/lib/cjs/models/entities/sales/Sale";
import { inSteGrp } from "asv-hlps/lib/cjs/user";

import hlpSale from "./helpers/hlpSale";

type TobType = {
  sale: Sale;
  action?: string;
};

const PrintSale = ({ action, sale }: TobType) => {
  const onGenInvoice = () => {
    hlpSale.genPdfInvoice(action, sale);
  };
  const onGenLabel = () => {
    hlpSale.genLabel(sale);
  };

  const onGenBillBlPdf = () => {
    hlpSale.genBillBlPdf(sale);
  };

  return (
    <>
      <a className="text-info mx-1 cursor-pointer" onClick={onGenInvoice}>
        <i className="fas fa-file"></i>
      </a>
      {inSteGrp(["ph"], sale.client || sale.bill.client) && sale.isPicking && (
        <DisplayTooltip content={"etiquette"}>
          <a className="text-info mx-1 cursor-pointer" onClick={onGenLabel}>
            <i className="fas fa-tags"></i>
          </a>
        </DisplayTooltip>
      )}
      {!inSteGrp(["ph"], sale.client || sale.bill.client) && (
        <a className="text-info mx-1 cursor-pointer" onClick={onGenBillBlPdf}>
          <span>BL</span>
        </a>
      )}
    </>
  );
};

export default PrintSale;
