import { useQueryClient } from "@tanstack/react-query";
import { dateFormatter, ProductMvt } from "asv-hlps";
import { BtnDownloads, ColDel, colToolTip, ModalBase, ModalConfirm, ReactTableColumnType, TskTable, useQueryPost } from "asv-hlps-react";
import LinkTob from "asv-hlps-react/lib/cjs/reacts/links/link-tob";
import { InOutMotive } from "asv-hlps/lib/cjs/models/shared/EInOutMotive";
import classNames from "classnames";
import { useMemo, useState } from "react";
import { Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

import { ADM } from "../../../auth/services/auth-menu";
import authService from "../../../auth/services/authService";
import httpService from "../../../services/httpService";
import hlpCrud from "../../../shared/helpers/hlpCrud";
import { Toastify } from "../../../shared/helpers/Toastify";
import AdditProductMvtIn from "./addits-mvts/addit-product-mvt-in";
import hlpMvt from "./hlpMvt";
import ListProductIn0fMonth from "./ins/list-product-in-of-month";
import ListProductOutOfMonth from "./outs/list-product-out-of-month";
import AddValidedTransfert from "./transferts/add-valided-transfert";

const ListProductMvt = () => {
  const { mvt } = useParams();
  // const [tobs, setTobs] = useState<ProductMvt[]>([]);
  const [filtered, setFiltereds] = useState<ProductMvt[]>([]);
  const [loading, setLoading] = useState(true);
  const [dates, setDates] = useState(null);
  const [modal, setModal] = useState(false);
  const [modalTransfert, setModalTransfert] = useState(false);
  const [modalConfirm, setModalConfirm] = useState(false);
  const [modalPdtsOfMonth, setModalPdtsOfMonth] = useState(false);
  const [tob, setTob] = useState<ProductMvt>(null);
  const navigate = useNavigate();

  const queryClient = useQueryClient();
  // --------------------
  const {
    data: tobs,
    error,
    isLoading,
  } = useQueryPost({
    keys: ["productmvts", mvt, dates],
    httpService,
    url: "productmvts/mvt",
    postParam: { mvt, dates },
  });

  // --------------------
  /* const fetchTobs = async () => {
    const { data: tobs } = await httpService.postBody<ProductMvt[]>({ mvt: mvt, dates: dates }, "productmvts/mvt");
    setLoading(false);
    setTobs(tobs);
  };
  useEffect(() => {
    fetchTobs();
    return () => {};
  }, [mvt, dates]); */
  // --------------------
  const onSelectedDates = (dates) => {
    setDates(dates);
    // fetchTobs();
  };

  const onSubmit = async (data: ProductMvt) => {
    data.motive = mvt;
    data.dollarRate = data.dollarRate ? data.dollarRate : null;
    data.costs = data.costs ? data.costs : null;
    const { data: newMvt } = await httpService.create(data, "productmvts");
    if (newMvt) {
      navigate(`/dash/stores/productmvts/ins/${newMvt.id}`);
    }
    setModal(false);
  };

  const getMvtName = (mvt: string) => {
    switch (mvt) {
      case "ins":
        return "entrées";
      case "outs":
        return "sorties";
      case "inventory":
        return "inventaires";
      case "transfert":
        return "transferts";
      case "adjustment":
        return "ajustements";
      case "buys":
        return "achats";
    }
  };

  const onAddMvt = async (prop) => {
    switch (mvt) {
      case "ins":
        return setModal(true);
      case "outs":
        const { data: out } = await httpService.get("productmvts/outcurrent");
        if (out) {
          navigate(`/dash/stores/productmvts/outs/${out.id}`);
        }
        break;
      case "inventory":
        const { data: inventory } = await httpService.get("productmvts/lastinv");
        if (!inventory) {
          setModalConfirm(true);
        } else {
          navigate(`/dash/stores/productmvts/inventory/${inventory.id}`);
        }
        break;
      case "adjustment":
        const { data: adjustment } = await httpService.get("productmvts/adjustcurrent");
        if (adjustment) {
          navigate(`/dash/stores/productmvts/adjustments/${adjustment.id}`);
        }
        break;
      case "transfert":
        const { data: transfert } = await httpService.get("productmvts/tsfnew");
        if (transfert) {
          sessionStorage.setItem("mvtTransfert", JSON.stringify(transfert));
          navigate(`/dash/stores/mngdepots`);
        }
        break;
    }
  };

  const goToMvtList = (mvt) => {
    switch (mvt) {
      case InOutMotive.IN:
        return "/dash/stores/productmvts/ins";
      case InOutMotive.OUT:
        return "/dash/stores/productmvts/outs";
      case InOutMotive.TRANSFERT:
        return "/dash/stores/productmvts/transferts";
      case InOutMotive.BUY:
        return "/dash/buys";
      case InOutMotive.INVENTORY:
        return "/dash/stores/productmvts/inventory";
      case InOutMotive.ADJUSTMENT:
        return "/dash/stores/productmvts/adjustments";
    }
  };

  const colStatus = (tob: ProductMvt) => {
    return (
      <Button className={classNames("btn btn-xs text-uppercase fs-8", tob.billPaidStatus === "nopaid" ? " btn-danger" : "btn-success")}>
        {tob.billPaidStatus === "nopaid" ? "impayée" : "payée"}
      </Button>
    );
  };

  const onWaitingTransfert = (tob) => {
    setTob(tob);
    setModalTransfert(true);
  };

  const onValidedTransfert = async (obj) => {
    setModalTransfert(false);
    /* console.log("------ valided transfert ------");
    console.log(obj);
    console.log("------ valided transfert ------");
    const oldTobs = lodash.cloneDeep(tobs); */
    try {
      tob.isDone = true;
      const nTobs = hlpCrud.updateTobOnList(tob, tobs);
      // setTobs(nTobs);
      const { status } = await hlpMvt.validedTransfert(tob.id, obj.id);
      if (status === 200) {
        queryClient.invalidateQueries(["productmvts", mvt, dates]);
        Toastify.success();
      }
    } catch (error) {
      // setTobs(oldTobs);
      Toastify.error();
    }
  };

  /* const onValidedTransfert = async (obj) => {
    console.log("------ valided transfert ------");
    console.log(obj);
    console.log("------ valided transfert ------");
    setModalTransfert(false);
    const oldTobs = lodash.cloneDeep(tobs);
    try {
      tob.isDone = true;
      const nTobs = hlpCrud.updateTobOnList(tob, tobs);
      setTobs(nTobs);
      const { status } = await hlpMvt.validedTransfert(tob.id, obj.id);
      if (status === 200) {
        Toastify.success();
      }
    } catch (error) {
      setTobs(oldTobs);
      Toastify.error();
    }
  }; */

  const handleDelete = async (tob) => {
    const nTobs = tobs.filter((x) => x.id !== tob.id);

    // setTobs(nTobs);
    // queryClient.invalidateQueries(["productmvts", mvt, dates]);

    const err = await hlpCrud.persistDelete(tob, `productmvts/del`, tobs);

    if (err) {
      // setTobs(tobs);
      Toastify.error();
    } else {
      queryClient.invalidateQueries(["productmvts", mvt, dates]);

      Toastify.success();
    }
  };

  const handleEdit = (tob) => {
    setTob(tob);
    setModal(true);
    // console.log(prop);
  };

  const onGenTsfPdf = async ({ action, tob }) => {
    const { data } = await httpService.getByParam(tob.id, "producttransferts/mvttrf");
    if (data) {
      hlpMvt.genPdfTransfert(action, data.mvt, data.trfs);
    }
  };

  const columnsIns: ReactTableColumnType[] = useMemo(
    () => [
      {
        header: "date",
        accessorKey: "createdAt",

        cell: ({ row }) => dateFormatter(row.original.createdAt, "dmy", "/"),
      },
      {
        header: () => colToolTip("ref mvt", "reférence du mouvement"),
        accessorKey: "ref",

        cell: ({ row }) => (
          <>
            <LinkTob title={"bobo"} tob={row.original} link={`${goToMvtList(mvt)}/${row.original.id}`}>
              {row.original.ref}
            </LinkTob>
          </>
        ),
      },
      {
        header: "fournisseur",
        accessorKey: "pvd.name",
        style: { width: "10%" },

        cell: ({ row }) => (
          <>
            <LinkTob title={"bobo"} tob={row.original} link={`/dash/stores/productmvts/ins/${row.original.id}`} /* state={{ id: 2 }} */>
              {row.original?.pvd?.name}
            </LinkTob>
          </>
        ),
      },
      {
        header: "N° de facture",
        accessorKey: "billNumber",
      },
      {
        header: "status",
        accessorKey: "billPaidStatus",

        cell: ({ row }) => colStatus(row.original),
      },
      {
        header: "auteur",
        accessorKey: "author.fullname",
      },
      { ...ColDel({ handleDelete }) },
    ],
    [mvt, handleDelete]
  );

  const columns: ReactTableColumnType[] = useMemo(
    () => [
      {
        header: "date",
        accessorKey: "createdAt",

        cell: ({ row }) => dateFormatter(row.original.createdAt, "dmy", "/"),
      },
      {
        header: () => colToolTip("ref mvt", "Reférence du mouvement"),
        accessorKey: "ref",

        cell: ({ row }) => {
          const tob = row.original;
          return (
            <>
              <LinkTob title={"bobo"} tob={tob} link={`${goToMvtList(mvt)}/${tob.id}`} state={{ dates: dates }}>
                {tob.ref}
              </LinkTob>
              {tob.motive === "transfert" && tob.isDone && <Button className="ms-2  btn-success btn-xs  text-uppercase">Validé</Button>}
              {tob.motive === "transfert" && !tob.isDone && (
                <Button className="ms-2  btn-danger btn-xs text-uppercase" onClick={() => onWaitingTransfert(tob)}>
                  en attente
                </Button>
              )}
              {tob.motive === "transfert" && !tob.isDone && <BtnDownloads tob={tob} onGenPdf={onGenTsfPdf} />}
            </>
          );
        },
      },

      {
        header: "auteur",
        accessorKey: "author.fullname",
      },
      { ...ColDel({ auth: authService.getAuth({ roles: ADM }), handleDelete }) },
    ],
    [mvt, handleDelete]
  );

  // --------------------
  const handleApprove = async (props) => {
    setModalConfirm(false);
    const objInv: ProductMvt = {};
    objInv.motive = InOutMotive.INVENTORY;
    const { data: mvt } = await httpService.create(objInv, "productmvts");
    if (mvt) {
      navigate(`/dash/stores/productmvts/inventory/${mvt.id}`);
    }
  };

  const getRows = (rows) => {
    const fRows = rows.map((row) => row.original);
    setFiltereds(fRows);
  };

  const onBtn = (prop) => {
    setModalPdtsOfMonth(true);
  };

  const getAuthAdd = () => {
    if (["adjustment"].includes(mvt) && authService.getAuth({ roles: ["rcm"] })) {
      return false;
    } /* else if (authService.getAuth({ roles: PHD })) {
      return true;
    } */
    return true;
  };

  const getPdtOfMonth = () => {
    switch (mvt) {
      case InOutMotive.IN:
        return <ListProductIn0fMonth />;
      case InOutMotive.OUT:
        return <ListProductOutOfMonth />;
    }
  };

  return (
    <>
      <TskTable
        headTitle={getMvtName(mvt)}
        columns={mvt === "ins" ? columnsIns : columns}
        data={tobs}
        loading={isLoading}
        onSelectedDate={onSelectedDates}
        onAdd={onAddMvt}
        authAdd={getAuthAdd()}
        lBtns={{ btns: [{ id: 1, label: `les produits ${getMvtName(mvt)} du mois` }], onBtn: onBtn }}
        getRows={getRows}
      />
      <ModalBase
        content={<AdditProductMvtIn tob={tob} onCancelForm={() => setModal(false)} onSubmit={onSubmit} />}
        title={getMvtName(mvt).replace(/s$/, "")}
        show={modal}
        onCloseModal={() => setModal(false)}
        icon={"fa fa-pen"}
      />
      <ModalBase
        content={getPdtOfMonth()}
        title={`liste des ${getMvtName(mvt)} du mois`}
        show={modalPdtsOfMonth}
        onCloseModal={() => setModalPdtsOfMonth(false)}
        size={"xl"}
      />
      <ModalBase
        content={<AddValidedTransfert onCancelForm={() => setModalTransfert(false)} onSubmitForm={onValidedTransfert} tob={tob} />}
        title={`validation du tranfert N° ${tob?.ref}`}
        show={modalTransfert}
        onCloseModal={() => setModalTransfert(false)}
        icon={"fa fa-pen"}
      />
      <ModalConfirm
        show={modalConfirm}
        title={`<b>Veuillez lire attentivement et confirmer votre action</b>`}
        onCloseModal={() => setModalConfirm(false)}
        onApprove={handleApprove}
        content={`Vous êtes sur point de créer un inventaire: <b>Un historique de votre base sera sauvegarder puis les quantités remises à zero</b> <br> Veuillez confirmer votre action`}
      />
    </>
  );
};

export default ListProductMvt;
