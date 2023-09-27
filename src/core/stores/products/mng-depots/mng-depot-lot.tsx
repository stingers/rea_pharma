import { dateFormatter } from "asv-hlps";
import { colToolTip, ModalBase, ModalConfirm, ReactTableColumnType, Toastify, TskTable } from "asv-hlps-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import httpService from "../../../../services/httpService";
import AdditProductTransfert from "../../mvts/transferts/addit-product-transfert";

const MngDepotLot = ({ tob }) => {
  const [pdtIn, setPdtIn] = useState(null);
  const [tobs, setTobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [mvt, setMvt] = useState(JSON.parse(sessionStorage.getItem("mvtTransfert")) || null);
  const navigate = useNavigate();

  // --------------------
  const fetchDatas = async () => {
    const { data: tobs } = await httpService.postBody({ id: tob.id, depot: tob.depot }, "productins/lotindepots");
    setLoading(false);
    setTobs(tobs);
  };

  useEffect(() => {
    fetchDatas();
    return () => {};
  }, []);
  // --------------------
  const onTransfert = async (tob) => {
    setPdtIn(tob);
    setModal(true);
    if (!mvt) {
      const { data } = await httpService.get("productmvts/tsfnew");
      sessionStorage.setItem("mvtTransfert", JSON.stringify(data));
      setMvt(JSON.parse(sessionStorage.getItem("mvtTransfert")));
    }
  };

  const handleTransfert = async (tsf) => {
    setModal(false);
    // ------ update pdtIn ------
    const index = tobs.findIndex((x) => x.id === pdtIn.id);
    const nTobs = [...tobs];
    nTobs[index].qtity = nTobs[index].qtity - tsf.qtity;
    setTobs(nTobs);
    // --------------------
    try {
      const transfert = { pdtInId: pdtIn.id, qtityTransfered: tsf.qtity, endDepotName: tsf.depot.name, mvtId: mvt.id };
      const { data } = await httpService.postBody(transfert, "producttransferts");
      Toastify.success();
      setConfirmModal(true);
    } catch (error) {
      setTobs(tobs);
      Toastify.error();
    }
  };
  // ------ continue or finish ------
  const onContinue = () => {
    setConfirmModal(false);
  };
  const onFinish = () => {
    setConfirmModal(false);
    setModal(false);
    sessionStorage.removeItem("mvtTransfert");
    navigate("/dash/stores/productmvts/list/transfert");
  };
  // --------------------
  const columns: ReactTableColumnType[] = useMemo(
    () => [
      {
        header: "lot",
        accessorKey: "lot",
      },
      {
        header: "Qte",
        accessorKey: "qtity",
      },
      {
        header: () => colToolTip("date fab", "date de fabrication"),
        accessorKey: "manufDate",

        cell: ({ row }) => dateFormatter(row.original.manufDate),
        /* cell: ,
      auth: ; */
      },
      {
        header: () => colToolTip("date exp", "date de peremption"),
        accessorKey: "expirationDate",

        cell: ({ row }) => dateFormatter(row.original.expirationDate),
        /* cell: ,
      auth: ; */
      },
      {
        header: () => colToolTip(<i className="fas fa-cog"></i>, "transfert"),
        accessorKey: "transfert",
        cell: ({ row }) => (
          <span onClick={() => onTransfert(row.original)}>
            <i className="fas fa-arrow-right text-info cursor-pointer"></i>
          </span>
        ),
        /* cell: ,
      auth: ; */
      },
    ],
    []
  );

  return (
    <>
      <TskTable loading={loading} columns={columns} data={tobs} noHeader />;
      <ModalBase
        className={"bg-light"}
        title={tob.designation}
        icon="fas fa-pen"
        show={modal}
        onCloseModal={() => setModal(false)}
        content={<AdditProductTransfert tob={tob} onCancelForm={undefined} onSubmitForm={handleTransfert} />}
      />
      <ModalConfirm
        approveLabel={"continue"}
        cancelLabel={"cloturer les transferts"}
        content={<b>Voulez-vous ajouter d'autres transfert sur la liste</b>}
        // content={<span className="fw-bold">"Voulez-vous ajouter d'autres transfert sur la liste"</span>}

        show={confirmModal}
        onCloseModal={() => setConfirmModal(false)}
        approveVariant={"success"}
        cancelVariant={"info"}
        onApprove={onContinue}
        onCancel={onFinish}
      />
    </>
  );
};

export default MngDepotLot;
