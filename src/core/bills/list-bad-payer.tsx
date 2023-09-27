import { currencyFormatter, currencyFormatterCfa, reduceSum } from "asv-hlps";
import { ReactTableColumnType, TskTable } from "asv-hlps-react";

const ListBadPayer = ({ tobs }) => {
  /* const totalDueAmount = tobs.reduce((prev, curr) => {
    return prev + +curr.dueAmount;
  }, 0); */

  const totalDueAmount = reduceSum(tobs, "dueAmount");
  const totalOfBills = reduceSum(tobs, "nbr");

  /* const totalOfBills = tobs.reduce((prev, curr) => {
    return prev + +curr.nbr;
  }, 0); */
  const amountCol = () => {
    return (
      <table className="table table-responsive table-sm m-0">
        <tbody>
          <tr className="text-uppercase text-center">
            <td>
              nombre de factures : <span className="fw-bold text-danger">{totalOfBills}</span>{" "}
            </td>
            <td>
              montant total : <span className="fw-bold text-danger">{currencyFormatterCfa(totalDueAmount)}</span>
            </td>
          </tr>
        </tbody>
      </table>
    );
  };

  const columns: ReactTableColumnType[] = [
    {
      header: "pharmacie",
      accessorKey: "steName" || "username",
      // accessorKey: "fullname",
      cell: ({ row }) => {
        const bad = row.original;
        return (
          <>
            {/* <LinkUserCard user={bad} userProp={bad.steName} /> */}
            <span className="mx-1 fw-bold ">{bad.steName}</span>
            <span className="mx-1 ">({bad.fullname})</span>
            <span className="ms-1 fw-bold">
              <i className="fas fa-phone"></i>
              {bad.phoneP && <span className="ms-1"> {bad.phoneP}</span>}
              {bad.phoneS && <span className="ms-1"> {"| " + bad.phoneS}</span>}
            </span>
          </>
        );
      },
    },
    { header: "nbr", accessorKey: "nbr" },
    { header: "montant", accessorKey: "dueAmount", cell: ({ row }) => currencyFormatter(+row.original.dueAmount), sort: true },
  ];
  return <TskTable tableClass="table-striped table-sm" columns={columns} data={tobs} loading={false} preaddons={amountCol()} />;
};

export default ListBadPayer;
