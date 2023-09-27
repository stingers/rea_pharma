import { arrayMultiChecked, currencyFormatterCfa } from "asv-hlps";
import { ReactTableColumnType, TskTable, colToolTip } from "asv-hlps-react";

import { useMemo, useState } from "react";

import buyService from "./buyService";

const DraftBuyByPvd = ({ tob }) => {
  const [tobs, setTobs] = useState(tob);
  const [loading, setLoading] = useState(true);
  const [dates, setDates] = useState(null);
  const [dropId, setDropId] = useState(1);
  const [checks, setChecks] = useState<any[]>([]);
  const [isChecked, setIsChecked] = useState(false);

  const onChecked = (e, sp) => {
    e.preventDefault();
    const evt = e.currentTarget.checked;
    const nChecks = arrayMultiChecked(checks, evt, sp);
    setChecks(nChecks);
    const checked = checks.length ? true : false;
    setIsChecked(checked);
  };

  // --------------------
  const onSelectedDates = (dates) => {
    setDates(dates);
  };

  const drops = [
    { id: 1, label: "3 derniers mois" },
    { id: 2, label: "6 derniers Mois" },
    { id: 3, label: "9 derniers Mois" },
  ];

  const getLabel = (drops, dropId) => {
    if (!dropId) {
      return drops[0].label;
    }
    return drops[dropId - 1].label;
  };
  const onDrop = async (prop) => {
    setDropId(+prop);
    switch (prop) {
      case 1:
        const { data: threeMonth } = await buyService.getReapproByMonthAndPvd(3, tobs[0].pvdId);
        setTobs(threeMonth);
        break;
      case 2:
        const { data: sixMonth } = await buyService.getReapproByMonthAndPvd(6, tobs[0].pvdId);
        setTobs(sixMonth);
        break;
      case 3:
        const { data: nineMonth } = await buyService.getReapproByMonthAndPvd(9, tobs[0].pvdId);
        setTobs(nineMonth);
        break;
      default:
        const { data } = await buyService.getReapproByMonthAndPvd(9, tobs[0].pvdId);
        setTobs(data);
        break;
    }
  };

  // --------------------
  const columns: ReactTableColumnType[] = useMemo(
    () => [
      {
        header: () => <i className="fas fa-cog"></i>,
        accessorKey: "checks",
        cell: ({ row }) => {
          const bp = row.original;
          return <input type="checkbox" name="bp" onChange={(event) => onChecked(event, bp)} />;
        },
      },
      {
        header: "ref",
        accessorKey: "ref",
        /* cell: ({ row }) => {
        return <LinkProductCard tob={row.original} />;
      }, */
      },
      {
        header: "designation",
        accessorKey: "designation",

        /* cell: ({ row }) => {
        return <LinkProductAddit product={row.original} />;
      }, */
      },
      {
        header: "fournisseur",
        accessorKey: "pvdName",
        style: { width: "20%" },
        //
      },
      {
        header: "pght",
        accessorKey: "pvdPrice",
      },
      {
        header: "stock",
        accessorKey: "stockTotal",
      },
      {
        header: () => colToolTip("Q.V", "Quantité vendues"),
        accessorKey: "saleds.sumQtityDlvr",
        cell: ({ row }) => {
          const tob = row.original;
          const total = tob.saleds.sumQtityDlvr;
          return <span className="text-black fw-bold">{total > 0 ? total : 0}</span>;
        },
      },
      {
        header: () => colToolTip("Q.UG", "Quantité ug"),
        accessorKey: "saleds.sumQtityFree",
        cell: ({ row }) => {
          const tob = row.original;
          const total = tob.saleds.sumQtityFree;
          return <span>{total > 0 ? total : 0}</span>;
        },
      },
      {
        header: () => colToolTip("Q.A.C", "Quantité à commander proposée"),
        accessorKey: "qac",
        cell: ({ row }) => {
          const tob = row.original;
          const total = tob.saleds.sumQtityDlvr * tob.buyIncreasePercent;
          return <span className="text-black fw-bold">{total > 0 ? total : 1}</span>;
        },
      },
      {
        header: "montant estimé",
        accessorKey: "me",
        cell: ({ row }) => {
          const tob = row.original;
          const total = tob.saleds.sumQtityDlvr * tob.buyIncreasePercent > 0 ? tob.saleds.sumQtityDlvr * tob.buyIncreasePercent : 1;
          return <span className="text-black fw-bold">{currencyFormatterCfa(Math.ceil(total * tob.pvdPrice))}</span>;
        },
      },
    ],
    []
  );
  // --------------------
  return (
    <TskTable
      lDropMenu={{ dropMenu: { drops: drops, label: getLabel(drops, dropId) }, onDrop: onDrop }}
      // tableClass="table-"
      columns={columns}
      data={tobs}
      // tobs={tob}
      // loading={loading}
      headTitle={"produits reappro"}
    />
  );
};

export default DraftBuyByPvd;
