import { currencyFormatter, currencyFormatterCfa } from "asv-hlps/lib/cjs/utils";

type TobType = {
  label;
  cfa?: boolean;
  total;
  colSpan?: number;
};

const DisplayTrTotal = ({ label, cfa, total, colSpan }: TobType) => {
  return (
    <tr>
      <td colSpan={colSpan} className={"text-start fw-bold text-uppercase"}>
        {label}
      </td>
      <td className={"text-right fw-bold"}>{cfa ? currencyFormatterCfa(total) : currencyFormatter(total)}</td>
    </tr>
  );
};

export default DisplayTrTotal;
