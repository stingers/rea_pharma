import { dateFormatter } from "asv-hlps";
import { BtnType, ColEditDel, ColToggle, ReactTableColumnType } from "asv-hlps-react";
import DisplayTooltip from "asv-hlps-react/lib/cjs/reacts/displays/display-tooltip";
// import useCrud from "asv-hlps-react/lib/cjs/reacts/hooks/uses/useCrud";
import { TskTable } from "asv-hlps-react";
import { useMemo, useState } from "react";

import httpService from "../../../../services/httpService";
import useCrud from "../../../../shared/hooks/useCrud";

type TobType = {
  url: string;
  showPromoBy?: any;
  param;
};

const InputListProductPromo = ({ url, showPromoBy, param }: TobType) => {
  // const { param } = useParams();

  // const getParam = status ? status : "all";
  // const { status: getStatus } = useParams();
  const [status, setStatus] = useState(param ? param : "current");
  const [btnOne, setBtnOne] = useState({ variant: "btn-primary" });
  const [btnTwo, setBtnTwo] = useState({ variant: "btn-light" });
  const [btnTree, setBtnTree] = useState({ variant: "btn-light" });
  /* const { tob, modal, tobs, isLoading, handleDelete, handleSelectedDates, handleToggle, handleEdit, closeModal } = useCrud({
    httpService,
    url: `${url}/status`,

    params: { name: { status: status }, withDates: true },
  }); */
  const { tob, modal, tobs, isLoading, handleDelete, handleSelectedDates, handleToggle, handleEdit, closeModal } = useCrud({
    httpService,
    url: `${url}/status`,
    withDates: true,
    postParam: { status },

    // params: { name: { status: status }, withDates: true },
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

      /* default:
        setBtnOne({ variant: "btn-primary" });
        setBtnTwo({ variant: "btn-light" });
        setBtnTree({ variant: "btn-light" });
        setStatus("current");
        break; */
    }
  };

  /* const showPromoBy = (data) => {
    console.log(data);
    let filters: any[] = [];
    switch (data.ste) {
      case "labo":
        filters = tobs.filter((x) => x.store.product.labo.ste.name === data.tob.store.product.labo.ste.name);
        break;
      case "agcy":
        filters = tobs.filter((x) => x.store.product.agcy.ste.name === data.tob.store.product.agcy.ste.name);
        break;
    }

    return filters;
  }; */
  // 024646002;
  // --------------------
  const columns: ReactTableColumnType[] = useMemo(
    () => [
      { header: "ref", accessorKey: "store.product.ref" },
      { header: "designation", accessorKey: "store.product.designation" },
      { header: "debut", accessorKey: "startDate", cell: ({ row }) => <span>{dateFormatter(row.original.startDate, "dmy", "/")}</span> },
      { header: "fin", accessorKey: "endDate", cell: ({ row }) => <span>{dateFormatter(row.original.endDate, "dmy", "/")}</span> },
      {
        header: () => (
          <DisplayTooltip content={"quantité en promo"}>
            <>Q.P</>
          </DisplayTooltip>
        ),
        accessorKey: "qtityFree",
      },
      {
        header: () => (
          <DisplayTooltip content={"quantité achetée"}>
            <>Q.A</>
          </DisplayTooltip>
        ),
        accessorKey: "qtityPromo",
      },
      {
        header: () => (
          <DisplayTooltip content={"laboratoire"}>
            <span>labo</span>
          </DisplayTooltip>
        ),
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
        header: () => (
          <DisplayTooltip content={"agence"}>
            <span>agence</span>
          </DisplayTooltip>
        ),
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
          header: () => (
            <DisplayTooltip content={"active"}>
              <i className="fas fa-check-double"></i>
            </DisplayTooltip>
          ),
          accessorKey: "isActive",
          handleToggle,
        }),
      },

      /* {
      header: () => (
          <DisplayTooltip  content={"active"}>
          <i className="fas fa-check-double"></i>
        </DisplayTooltip>
      ),
      accessorKey: "isActive",
      cell: ({ row }) => <BtnToggle check={row.original.isActive} onToggle={() => handleToggle(row.original, "isActive")}></BtnToggle>,
    }, */
      { ...ColEditDel({ handleDelete, handleEdit }) },
    ],
    [handleDelete, status]
  );

  return (
    <>
      {/* <DisplayHeader lBtns={{ btns: btns, onBtn }} onSelectedDate={handleSelectedDates} /> */}

      <TskTable
        lBtns={{ btns: btns, onBtn }}
        // lBtns={lbtns}
        // tob={tob}
        // onAdd={onAdd}
        onSelectedDate={handleSelectedDates}
        data={tobs}
        loading={isLoading}
        headTitle={" promos"}
        columns={columns}
      />
    </>
  );
};

export default InputListProductPromo;
