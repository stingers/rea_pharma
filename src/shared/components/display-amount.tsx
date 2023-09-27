import DisplayTooltip from "asv-hlps-react/lib/cjs/reacts/displays/display-tooltip";

type TobType = {
  totalAmount: number | string | any;
  paidAmount: number | string;
  dueAmount: number | string;
  title?: string;
};

const DisplayAmount = ({ totalAmount, paidAmount, dueAmount, title = "Montant total" }: TobType) => {
  return (
    <table className="table mb-0 text-dark text-uppercase">
      <thead>
        <tr>
          <th>{title} </th>
          <th className="col-2">
            <DisplayTooltip content={"Montant total"}>
              <span>{totalAmount}</span>
            </DisplayTooltip>
          </th>

          <th className="col-2">
            <DisplayTooltip content="Montant payé">
              <span className="text-success">{paidAmount}</span>
            </DisplayTooltip>
          </th>
          <th className="col-2">
            <DisplayTooltip content="Montant du">
              <span className="text-danger">{dueAmount}</span>
            </DisplayTooltip>
          </th>
        </tr>
      </thead>
    </table>
  );
};

export default DisplayAmount;
