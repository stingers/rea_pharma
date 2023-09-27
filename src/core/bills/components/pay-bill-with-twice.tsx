import { Bill, currencyFormatterCfa } from "asv-hlps";
import { Card } from "react-bootstrap";

import httpService from "../../../services/httpService";
import BtnYesNo from "../../../shared/btns/BtnYesNo";

type TobType = {
  bill: Bill;
  twice;
  onNo;
};

const PayBillWithTwice = ({ bill, twice, onNo }: TobType) => {
  const handleYes = async () => {
    const { data } = await httpService.postBody({ billId: twice.id, billTwiceId: twice.id }, "bills/payByBackBills");
  };

  const handleNo = () => {};

  return (
    <Card>
      <Card.Header className="p-2">
        <h4 className="header-title text-uppercase">
          solder par facture correspondante <span className="fw-bold float-end">{currencyFormatterCfa(+bill.dueAmount)}</span>
        </h4>
      </Card.Header>
      <Card.Body>
        <div>
          Voulez-vous utiliser cette facture retour <b>{twice?.ref}</b> de même valeur <b>{twice?.totalAmount}</b>
          pour solder la facture <b>{twice?.ref}</b>
        </div>
        <div className="float-end">
          {/* <BtnYesNo onYes={handleYes} onNo={handleNo} /> */}
          <BtnYesNo onYes={handleYes} onNo={onNo} />
        </div>
      </Card.Body>
    </Card>
  );
};

export default PayBillWithTwice;
