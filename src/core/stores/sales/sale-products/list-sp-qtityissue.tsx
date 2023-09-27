import { useQueryClient } from "@tanstack/react-query";
import { Product, dateFormatter } from "asv-hlps";
import { ReactTableColumnType, Toastify, TskTable, useQueryPost } from "asv-hlps-react";
import DisplayTooltip from "asv-hlps-react/lib/cjs/reacts/displays/display-tooltip";
// import { ReactTableColumnType, TskTable } from "asv-hlps-react";
import { BtnType } from "asv-hlps-react/lib/cjs/reacts/type";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import httpService from "../../../../services/httpService";
import LinkCardProduct from "../../products/link-card-product";
import BtnSaleStatus from "../btn-sale-status";
import BtnSpQtityIssue from "./btn-sp-qtityissue";

const ListSpQtityissue = ({ url }) => {
  const queryClient = useQueryClient();
  const { status: getStatus } = useParams();
  const [btnOne, setBtnOne] = useState({ variant: "btn-primary" });
  const [btnTwo, setBtnTwo] = useState({ variant: "btn-light" });
  // const [tobs, setTobs] = useState([]);
  // const [loading, setLoading] = useState(true);
  const [dates, setDates] = useState(null);
  const [status, setStatus] = useState(getStatus);
  // --------------------
  const { data: tobs, isLoading } = useQueryPost({
    keys: ["spqtityissues", status, dates],
    httpService,
    url: "spqtityissues/status",
    postParam: { status, dates },
  });
  // const del = useQueryCrudDel(httpService, ["spqtityissues", status, dates], "spqtityissues");

  // --------------------
  /* const fetchDatas = async () => {
    // setLoading(true);
    const { data: tobs } = await httpService.postBody({ status, dates }, "spqtityissues/status");
    setLoading(false);
    setTobs(tobs);
  };
  useEffect(() => {
    fetchDatas();
    return () => {};
  }, [status, dates]); */
  // --------------------
  const handleSelectedDates = (dates) => {
    setDates(dates);
    // fetchDatas();
  };
  const handleRefresh = () => {
    // fetchDatas();
  };

  const onTreatSuccess = (tob) => {
    queryClient.invalidateQueries(["spqtityissues", status, dates]);
    Toastify.success();
  };

  const columns: ReactTableColumnType[] = useMemo(
    () => [
      {
        header: "date",
        accessorKey: "createdAt",

        cell: ({ row }) => dateFormatter(row.original.createdAt),
      },
      {
        header: "N° Commande",
        accessorKey: "saleProduct.sale.ref",
        cell: ({ row }) => <BtnSaleStatus print={false} sale={row?.original?.saleProduct?.sale} />,

        // cell: ({ row }) => dateFormatter(row.original.createdAt),
      },
      {
        header: "Designation",
        accessorKey: "saleProduct.product.designation",
        cell: ({ row }) => {
          const product: Product = row?.original?.saleProduct?.product;
          return <LinkCardProduct product={product}>{product?.designation}</LinkCardProduct>;
        },

        // cell: ({ row }) => dateFormatter(row.original.createdAt),
      },
      {
        header: () => (
          <DisplayTooltip content={"quantité commandée"}>
            <span>Q.CDEE</span>
          </DisplayTooltip>
        ),
        accessorKey: "saleProduct.qtityOdr",

        // cell: ({ row }) => dateFormatter(row.original.createdAt),
      },
      {
        header: () => (
          <DisplayTooltip content={"quantité trouvée"}>
            <span>Q.Tr</span>
          </DisplayTooltip>
        ),
        accessorKey: "saleProduct.qtityFund",

        // cell: ({ row }) => dateFormatter(row.original.createdAt),
      },
      {
        header: "Etat",
        accessorKey: "action",
        cell: ({ row }) => <BtnSpQtityIssue tob={row.original} onSuccess={onTreatSuccess} />,
      },
    ],
    [status, dates, onTreatSuccess]
    // []
  );
  // ------ start:  ------
  const btns: BtnType[] = [
    { id: 1, label: "en attente", btnClass: btnOne.variant },
    { id: 2, label: "traité", btnClass: btnTwo.variant },
  ];
  const onBtn = (id) => {
    switch (id) {
      case 1:
        setBtnOne({ variant: "btn-primary" });
        setBtnTwo({ variant: "btn-light" });
        setStatus("noTreat");
        break;
      case 2:
        setBtnTwo({ variant: "btn-primary" });
        setBtnOne({ variant: "btn-light" });
        setStatus("treat");
        break;

      default:
        break;
    }
  };
  // ------ end  ---------

  return (
    <TskTable
      lBtns={{
        btns: btns,
        onBtn: onBtn,
      }}
      columns={columns}
      data={tobs || []}
      // loading={isLoading}
      onSelectedDate={handleSelectedDates}
    />
  );
};

export default ListSpQtityissue;
