import { Entry } from "asv-hlps";
import { ReactTableColumnType, TskTable } from "asv-hlps-react";
import { HlpEntry } from "../helpers/hlpEntry";

type TobType = {
  entry: Entry;
};

const DetailEntry = ({ entry }: TobType) => {
  const addTrs = (
    <tr className="text-uppercase text-black">
      <td colSpan={3}>
        <span>total</span>
      </td>
      <td className="fw-bold">{HlpEntry.totalAmountDebit(entry.lines)}</td>
      <td className="fw-bold">{HlpEntry.totalAmountCredit(entry.lines)}</td>
    </tr>
  );
  const columns: ReactTableColumnType[] = [
    {
      header: "cpt",
      accessorKey: "accountDebit" || "accountCredit",
      cell: ({ row }) => <span>{row.original.accountDebit ? row.original.accountDebit : row.original.accountCredit}</span>,
    },
    {
      header: "designation",
      accessorKey: "designation",
    },
    {
      header: "debit",
      accessorKey: "amountDebit",
      cell: ({ row }) => <span>{+row.original.amountDebit || null}</span>,
    },
    {
      header: "credit",
      accessorKey: "amountCredit",
      cell: ({ row }) => <span>{+row.original.amountCredit || null}</span>,
    },
  ];
  return <TskTable columns={columns} pushTrs={addTrs} data={entry.lines} loading={false} noHeader />;
};

export default DetailEntry;
