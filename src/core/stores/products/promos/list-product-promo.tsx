import { dateFormatter } from "asv-hlps";
import { BtnType, ColEditDel, ColToggle, colToolTip, ModalBase, ReactTableColumnType, TskTable } from "asv-hlps-react";
import { useMemo, useState } from "react";

import httpService from "../../../../services/httpService";
import useCrud from "../../../../shared/hooks/useCrud";
import LinkCardProduct from "../link-card-product";
import ListProductPromoAgLa from "./list-product-promo-ag-la";

const ListProductPromo = ({ url }) => {
  // const { param } = useParams();
  // console.log(param);

  // const getParam = status ? status : "all";
  // const { status: getStatus } = useParams();
  const [status, setStatus] = useState("current");
  const [btnOne, setBtnOne] = useState({ variant: "btn-primary" });
  const [btnTwo, setBtnTwo] = useState({ variant: "btn-light" });
  const [btnTree, setBtnTree] = useState({ variant: "btn-light" });

  const [filtersBy, setFiltersBy] = useState([]);
  const [filtersModal, setFiltersModal] = useState(false);
  const [agla, setAgla] = useState(null);

  /* const { tob, tobs, isLoading, handleDelete, handleSelectedDates, handleToggle, handleEdit } = useTobCrud({
    httpService,
    url: `${url}/status`,
    params: { name: { status: status }, withDates: true },
  }); */
  const { tob, tobs, isLoading, handleDelete, handleSelectedDates, handleToggle, handleEdit } = useCrud({
    httpService,
    url: `${url}/status`,
    postParam: { status },
    postProp: "status",
    withDates: true,
  });

  // ------ start:  ------
  const btns: BtnType[] = [
    { id: 1, label: "en cours", btnClass: btnOne.variant },
    { id: 2, label: "terminés", btnClass: btnTwo.variant },
    { id: 3, label: "tout", btnClass: btnTree.variant },
  ];
  const onBtn = (id) => {
    switch (id) {
      case 1:
        setBtnOne({ variant: "btn-primary" });
        setBtnTwo({ variant: "btn-light" });
        setBtnTree({ variant: "btn-light" });
        setStatus("current");
        break;
      case 2:
        setBtnOne({ variant: "btn-light" });
        setBtnTwo({ variant: "btn-primary" });
        setBtnTree({ variant: "btn-light" });
        setStatus("outdate");
        break;
      case 3:
        setBtnOne({ variant: "btn-light" });
        setBtnTwo({ variant: "btn-light" });
        setBtnTree({ variant: "btn-primary" });
        setStatus("all");
        break;
    }
  };

  const showPromoBy = (data) => {
    setAgla(data);
    // console.log();
    const nTobs = [...tobs];
    let filters: any[] = [];
    switch (data.ste) {
      case "labo":
        filters = nTobs.filter((x) => x.store.product.labo.ste.name === data.tob.store.product.labo.ste.name);
        break;
      case "agcy":
        filters = nTobs.filter((x) => x.store.product.agcy.ste.name === data.tob.store.product.agcy.ste.name);
        break;
    }
    setFiltersBy(filters);
    setFiltersModal(true);
  };

  // --------------------
  const columns: ReactTableColumnType[] = useMemo(
    () => [
      { header: "ref", accessorKey: "store.product.ref" },
      // { header: "designation", accessorKey: "store.product.designation" },
      {
        header: "designation",
        accessorFn: (row) => row.store.product.designation,
        cell: ({ row }) => {
          return <LinkCardProduct product={row.original.store?.product} />;
        },
      },
      { header: "debut", accessorKey: "startDate", cell: ({ row }) => <span>{dateFormatter(row.original.startDate, "dmy", "/")}</span> },
      { header: "fin", accessorKey: "endDate", cell: ({ row }) => <span>{dateFormatter(row.original.endDate, "dmy", "/")}</span> },
      {
        header: () => colToolTip("Q.R", "quantite en promo"),
        accessorKey: "qtityFree",
      },
      {
        header: () => colToolTip("Q.A", "quantité achetée"),
        accessorKey: "qtityPromo",
      },
      {
        header: () => colToolTip("Labo", "laboratoire"),
        cell: ({ row }) => {
          const tob = row.original;
          return (
            <span className="cursor-pointer fw-bold" onClick={() => showPromoBy({ tob, ste: "labo" })}>
              {tob.store.product.labo.ste.name}
            </span>
          );
        },
        accessorKey: "store.product.labo.ste.name",
      },
      {
        header: () => colToolTip("agence", "agence"),
        cell: ({ row }) => {
          const tob = row.original;
          return (
            <span className="cursor-pointer fw-bold" onClick={() => showPromoBy({ tob, ste: "agcy" })}>
              {tob.store.product.agcy.ste.name}
            </span>
          );
        },
        accessorKey: "store.product.agcy.ste.name",
      },
      {
        ...ColToggle({
          header: () => colToolTip(<i className="fas fa-check-double"></i>, "active"),
          accessorKey: "isActive",
          handleToggle,
        }),
      },

      { ...ColEditDel({ handleDelete, handleEdit }) },
    ],
    [handleDelete, status]
  );

  return (
    <>
      <TskTable
        lBtns={{ btns: btns, onBtn }}
        // headerPills={pills}

        // tob={tob}
        // onAdd={onAdd}
        onSelectedDate={handleSelectedDates}
        data={tobs}
        // isLoading={isLoading}
        headTitle={" promos"}
        columns={columns}
      />
      <ModalBase
        title={`promos  ${
          agla?.ste === "agcy"
            ? "de l' agence " + agla?.tob?.store?.product?.agcy?.ste?.name
            : "du labo " + agla?.tob?.store?.product?.labo?.ste?.name
        }`}
        size="xl"
        show={filtersModal}
        onCloseModal={() => setFiltersModal(false)}
        // content={<ListProductPromoAgLa tobs={filtersBy} handleToggle={handleToggle} handleEdit={handleEdit} handleDelete={handleDelete} />}
        content={<ListProductPromoAgLa tobs={filtersBy} handleToggle={undefined} handleEdit={undefined} handleDelete={undefined} />}
        // backdrop={"static"}
      />
    </>
  );
};

export default ListProductPromo;
