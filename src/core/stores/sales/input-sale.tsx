import { currencyFormatterCfa, dateFormatter } from "asv-hlps";
import { BtnDel } from "asv-hlps-react";
import DisplayPopover from "asv-hlps-react/lib/cjs/reacts/displays/display-popover";
import DisplayTooltip from "asv-hlps-react/lib/cjs/reacts/displays/display-tooltip";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { PHD, TLM_COM } from "../../../auth/services/auth-menu";
import authService from "../../../auth/services/authService";
import BtnSaleStatus from "./btn-sale-status";
import pipeSale from "./helpers/pipeSale";
import SaleTreatProcess from "./sale-treat-process";

import "./input-sale.css";

dayjs.extend(relativeTime);

const InputSale = ({ index, sale, handleDelete, missingLot, onSalePaid, onProcess, onClick }) => {
  return (
    // <tr className="shadow-2 mb-1 border border-1 border-danger border-top-0 border-end-0   border-bottom-0 ">
    <tr>
      <th scope="row">{index + 1} </th>
      {authService.getAuth({ roles: PHD }) && (
        <>
          <td>
            <BtnDel tob={sale} onDelete={(sale) => handleDelete(sale)} title={`suppression de la commande N° ${sale.ref} `} />
          </td>
          <td>
            <a
              onClick={onClick}
              /* onClick={() => {
                setClockModal(true);
                setSale(sale);
              }} */
            >
              <i className="fas fa-clock"></i>
            </a>
          </td>
        </>
      )}
      {/* <!-- ref --> */}
      <td>
        <>
          {sale.client.ste.grp.code.toLowerCase() === "ph" && <span className=" me-1 text-danger fw-bold fs-4 ">|</span>}
          <BtnSaleStatus sale={sale} />
          {missingLot(sale) && (
            <DisplayTooltip content={"Lot(s) manquant(s)"}>
              <span className="text-danger">
                <i className="fa fa-heartbeat"></i>
              </span>
            </DisplayTooltip>
          )}
        </>
      </td>
      {/* <!-- total qtityFree --> */}
      <td>
        {pipeSale.totalSale(sale, "qtityFree") > 0 && (
          <DisplayPopover content={pipeSale.totalSale(sale, "qtityFree")}>
            <i className="fa fa-birthday-cake text-success"></i>
          </DisplayPopover>
        )}
      </td>
      {/* <!-- username --> */}
      {authService.getAuth({
        tag: "sdc_username",
        roles: [...PHD, "mag", "mcc", ...TLM_COM, "rcm"],
        client: { roles: ["ceo"] },
      }) && (
        <td>
          {sale.client?.username}
          {onSalePaid(sale) && (
            <DisplayTooltip content={"Commande payée"}>
              <span className="mx-2">
                <i className="fas fa-money-bill text-success"></i>
              </span>
            </DisplayTooltip>
          )}
        </td>
      )}
      {/* <!-- ste name --> */}
      {authService.getAuth({
        tag: "sdc_ste_name",
        roles: [...PHD, "mag", "mcc", ...TLM_COM, "rcm", "cha"],
      }) && <td>{sale.client?.ste.name}</td>}
      {/* <!-- time --> */}
      {authService.getAuth({ roles: [...PHD, "mag", "mcc", ...TLM_COM, "rcm"] }) && (
        // <td>{dateFormatter(sale.saleDate, "dmy-hm", "/")}</td>
        // <td>{dayjs(sale.saleDate).locale("fr").fromNow(true)}</td>
        <td>{dateFormatter(sale.saleDate, "ago")}</td>
      )}
      {/* <!-- total amount --> */}
      {authService.getAuth({ tag: "sdc_totalAmount", roles: [...PHD, "rcm", "com"] }) && (
        <td>{currencyFormatterCfa(pipeSale.totalSale(sale, "amountAllIncluded"))}</td>
      )}
      {/* <!-- print --> */}
      {/* <td>
      {(pipeSale.treat(sale, "picking") || pipeSale.treat(sale, "delivering")) &&
        // !authService.getAuth({ tag: "sale_print", roles: ["cha", "mag"] }) &&
        authService.getAuth({ tag: "sale_print", roles: ["cha", "mag"] }) && (
          // <td>
          <PrintSale sale={sale} />
          // </td>
        )}
    </td> */}
      {/* <!-- sale treatement buttons --> */}
      {/* <td className="d-flex justify-content-between"> */}
      <td>
        <SaleTreatProcess sale={sale} onProcess={onProcess} />
      </td>
    </tr>
  );
};

export default InputSale;
