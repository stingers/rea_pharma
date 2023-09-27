import { arrayMultiChecked, Bill, currencyFormatter, currencyFormatterCfa, getTotalDueAmountOnListBill } from "asv-hlps";
import { Card } from "react-bootstrap";

import httpService from "../../../services/httpService";
import BtnYesNo from "../../../shared/btns/BtnYesNo";
import Checked from "../../../shared/components/checked";

type TobType = {
  bill: Bill;
  billBacks: Bill[];
  onNo;
  onYes;
};

const PayBillWithBack = ({ bill, billBacks, onNo, onYes }: TobType) => {
  let totalAmountBack;
  let checks: any[] = [];

  if (billBacks.length) {
    totalAmountBack = currencyFormatterCfa(Math.abs(getTotalDueAmountOnListBill(billBacks)));
    // totalAmountBack = Math.abs(getTotalDueAmountOnListBill(billBacks)).toLocaleString();
    // --------------------
  }
  const handleYes = async () => {
    const ids = checks.length ? checks.map((x) => (x = x.id)) : [];

    try {
      const { data } = await httpService.postBody({ billId: bill.id, billBackIds: ids }, "bills/payByBackBills");
      onYes(data);
    } catch (error) {}
  };

  const onChecked = (e: any, bill: Bill) => {
    const evt: boolean = e.target.checked;
    checks = arrayMultiChecked(checks, evt, bill);
  };

  return (
    <Card>
      <Card.Header className="p-2">
        <h4 className="header-title text-uppercase fs-6">
          solder par facture(s) retour(s) <span className="fw-bold float-end">{currencyFormatterCfa(+bill.dueAmount)}</span>
        </h4>
      </Card.Header>
      <Card.Body>
        <div>
          <p className="mb-0 text-center">
            Voulez-vous utiliser le credit de <span className="fw-bold"> {totalAmountBack} </span>
          </p>
          <p className="mb-0 text-center">de ce client sur la ou les factures n°</p>
          <table className="table table-sm text-black mt-1">
            <tbody>
              {billBacks.map((bill) => (
                <tr key={bill.id}>
                  <td>{bill.ref}</td>
                  <td>{currencyFormatter(+bill.dueAmount)}</td>

                  <td>
                    {" "}
                    <Checked tob={bill} onChecked={onChecked} />{" "}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="float-end">
          {/* <BtnYesNo onYes={handleYes} onNo={handleNo} /> */}
          <BtnYesNo onYes={handleYes} onNo={onNo} />
        </div>
      </Card.Body>
    </Card>
  );
};

export default PayBillWithBack;
