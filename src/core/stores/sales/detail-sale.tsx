import { arrayMultiChecked, currencyFormatter, duplicateObjects, Sale, SaleProduct } from "asv-hlps";
import { BtnDel, colToolTip, ReactTableColumnType } from "asv-hlps-react";
import { BtnType } from "asv-hlps-react/lib/cjs/reacts/type";
import { useMemo, useState } from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import { ADM, PHD } from "../../../auth/services/auth-menu";
import authService from "../../../auth/services/authService";
import httpService from "../../../services/httpService";
import hlpCrud from "../../../shared/helpers/hlpCrud";
import TskTable from "../../../shared/table/tsk-table";
import hlpSale from "./helpers/hlpSale";
import SaleInfoAmount from "./sale-info-amount";

type TobProps = {
  tob: Sale;
  // onReportedSaleBill?: (tob: Sale) => void;
};

const DetailSale = ({ tob: gTob }: TobProps) => {
  // const [sale] = useState<Sale>(gTob);
  const [sale, setSale] = useState<Sale>(gTob);
  const [saleProducts, setSaleProducts] = useState<SaleProduct[]>(sale.saleProducts);
  const [checks, setChecks] = useState<SaleProduct[]>([]);
  const [isChecked, setIsChecked] = useState(false);
  let [backAction, setBackAction] = useState(false);
  const [filtereds, setFiltereds] = useState([]);
  const navigate = useNavigate();
  const duplicates = duplicateObjects(saleProducts, "product.id");

  const onChecked = (e, sp: SaleProduct) => {
    // e.preventDefault();
    // const evt = e.currentTarget.checked;
    const evt = e.target.checked;
    const nChecks = arrayMultiChecked(checks, evt, sp);
    setChecks(nChecks);
    const checked = checks.length ? true : false;
    setIsChecked(checked);
  };

  const onDeleteSaleProduct = (sp) => {
    if (!sale.isDelivering) {
      httpService
        .del(sp.id, "saleproducts")
        .then(() => {
          const nSps = hlpCrud.removeOnList(sp, saleProducts);
          const nSale = { ...sale, saleProducts: nSps };
          setSaleProducts(nSps);
          setSale(nSale);
        })
        .then(async () => {
          await httpService.postId(sp.product.stores[0].id, "productstores/updateStockReserved");
        });
    }
  };

  // ------ play ------
  // useEffect(() => {}, [backAction]);

  // ------ play ------

  const genBack = () => {
    navigate("/dash/sales/genSaleBack", { state: { sale, saleProducts: checks } });
  };

  const addons = (
    <>
      {isChecked && sale.isDelivered && !sale.isBack && (
        <Button onClick={genBack} className="float-start text-uppercase btn-sm">
          generer un retour
        </Button>
      )}
      <SaleInfoAmount sale={sale} />
    </>
  );

  /* const handleReportedSaleBill = async () => {
    sale.isReported = !sale.isReported;
    try {
      const { data } = await httpService.postId(sale.id, "sales/reported");
      onReportedSaleBill(sale);
    } catch (error) {}
  }; */

  const drops: BtnType[] = [
    {
      id: 1,
      label: "générer un retour",
      auth: authService.getAuth({ roles: [...PHD, "rcm"], client: { roles: ["ceo", "aup"] } }) && sale.isDelivered && !sale.isBack,
    },
    {
      id: 2,
      label: "reporter la  facture",
      auth: authService.getAuth({ roles: [...PHD, "rcm"] }) && !sale.isReported,
    },
  ];
  const onDrop = (id) => {
    switch (+id) {
      case 1:
        setBackAction((backAction = !backAction));
        break;
      /* case 2:
        handleReportedSaleBill();

        break; */
    }
  };

  const onGenPdf = (action) => {
    sale.isDelivering ? hlpSale.genPdfInvoice(action, sale) : hlpSale.genPdfDetailSaleForMag(action, sale);
  };

  const columns: ReactTableColumnType[] = useMemo(
    () => [
      {
        id: "trash",
        header: () => <i className="fas fa-trash"></i>,
        accessorKey: "trash",
        cell: ({ row }) => <BtnDel tob={row.original} onDelete={onDeleteSaleProduct} title={row.original.product.designation} />,
      },
      {
        header: () => <i className="fas fa-cog"></i>,
        accessorKey: "checks",
        cell: ({ row }) => {
          const sp: SaleProduct = row.original;
          return <input disabled={sp.hasBack} type="checkbox" name="sp" onChange={(event) => onChecked(event, sp)} />;
        },

        auth: backAction,
      },
      // { header: "designation", accessorKey: "product.designation", sort: true },
      {
        header: "designation",
        accessorKey: "product.designation",
        cell: ({ row }) => {
          const sp: SaleProduct = row.original;
          return (
            <>
              {sp.product.designation} {sp?.lots?.length === 0 && !sale.isProforma && <i className=" text-danger fas fa-heart-broken"></i>}
              {duplicates.includes(sp) && <i className="ms-1 text-danger fas fa-clone"></i>}
            </>
          );
        },
      },
      // { header: "qte", tooltipH: "quantite", accessorKey: "qtityOdr" },
      { header: () => colToolTip("qte", "quantite"), accessorKey: "qtityOdr", sort: true },
      {
        header: () => colToolTip("q.d", "quantite"),
        accessorKey: "qtityDlvr",
        cell: ({ row }) => {
          const sp: SaleProduct = row.original;
          return sale.isDelivering || sale.isBack ? sp.qtityDlvr : sp.qtityOdr;
        },
      },
      { header: () => colToolTip("u.g", "unités gratuites"), accessorKey: "qtityFree" },
      {
        header: () => colToolTip("p.u", "prix unitaire"),
        accessorKey: "unitPrice",
        cell: ({ row }) => currencyFormatter(+row.original.unitPrice),
      },
      {
        header: () => colToolTip("tva", "taxe à valeur ajoutée"),
        accessorKey: "tva",
        cell: ({ row }) => {
          const sp: SaleProduct = row.original;
          return !(sale.isDelivering || sale.isBack)
            ? currencyFormatter((sp.unitPrice * sp.qtityOdr * sp.product.tva) / 100)
            : currencyFormatter((sp.unitPrice * sp.qtityDlvr * sp.product.tva) / 100);
        },
      },
      {
        header: () => colToolTip("m h.t", "montant hors tva"),

        accessorKey: "montantHt",
        cell: ({ row }) => {
          const sp: SaleProduct = row.original;
          return (
            <span>{currencyFormatter(sale.isDelivering || sale.isBack ? sp.unitPrice * sp.qtityDlvr : sp.unitPrice * sp.qtityOdr)}</span>
          );
        },
      },
    ],
    // [backAction, checks]
    []
  );

  return (
    <TskTable
      // isSelectable
      rDropMenu={{ dropMenu: { drops, icon: "fas fa-cogs" }, onDrop, elpDrop: true }}
      headTitle={sale.ref}
      columns={columns}
      loading={false}
      data={saleProducts}
      addons={addons}
      onGenPdf={onGenPdf}
      authRDropMenu={
        (authService.getAuth({ roles: [...PHD, "rcm"] }) || authService.getAuth({ client: { roles: ["ceo", "aup"] } })) &&
        sale.isDelivered &&
        !sale.isBack
      }
      getRows={(rows) => setFiltereds(rows.map((row) => row.original))}
      initialState={{
        columnVisibility: {
          // checks: backAction,
          checks: authService.getAuth({ roles: [...PHD], client: { roles: ["ceo"] } }),
          trash: authService.getAuth({ roles: ADM }),
        },
      }}
    />
  );
};

export default DetailSale;
