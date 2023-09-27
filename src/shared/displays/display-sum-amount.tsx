import { currencyFormatter, currencyFormatterCfa } from "asv-hlps";

type TobType = {
  label: string;
  tobs: any[];
  sumProperty?: string;
  cfa?: boolean;
};

const DisplaySumAmount = ({ label, tobs, sumProperty = "amount", cfa }: TobType) => {
  const sumAmount = (): number => {
    return tobs.reduce((prev, curr) => prev + +curr[sumProperty], 0);
  };
  return (
    <table className="table mt-n2 table-sm fw-bold text-center text-uppercase text-black">
      <thead>
        <tr>
          <th>{label} </th>
          <th>
            <span>{cfa ? currencyFormatterCfa(sumAmount()) : currencyFormatter(sumAmount())}</span>
          </th>
        </tr>
      </thead>
    </table>
  );
};

export default DisplaySumAmount;
