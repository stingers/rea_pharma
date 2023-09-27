// export const colNa: HeaderTableColumnType[] = [{ ReactTableColumnType }];
// export const colNaCo: HeaderTableColumnType[] = [...colNa, { thLabel: "code", accessorKey: "code" }];

import { ReactTableColumnType } from "asv-hlps-react";

// export const colNaCoSh: HeaderTableColumnType[] = [...colNaCo, { thLabel: "shortname", accessorKey: "shortname" }];

export const colNa: ReactTableColumnType[] = [
  {
    header: "nom",
    accessorKey: "name",
  },
];

export const colNaCo: ReactTableColumnType[] = [
  ...colNa,
  {
    header: "code",
    accessorKey: "code",
  },
];

export const colNaCoSh: ReactTableColumnType[] = [
  ...colNaCo,
  {
    header: "shortname",
    accessorKey: "shortname",
  },
];
