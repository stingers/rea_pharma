import { dateFormatter } from "asv-hlps";
import { ReactTableColumnType, Toastify, TskTable } from "asv-hlps-react";
import DisplayPopover from "asv-hlps-react/lib/cjs/reacts/displays/display-popover";
import { ModalBase } from "asv-hlps-react/lib/cjs/reacts/minton/modals";
import { BtnType } from "asv-hlps-react/lib/cjs/reacts/type";
import { useEffect, useMemo, useState } from "react";
import { Button, ListGroup, ListGroupItem } from "react-bootstrap";
import { useLocation } from "react-router-dom";

import { PHD } from "../../../auth/services/auth-menu";
import authService from "../../../auth/services/authService";
import httpService from "../../../services/httpService";
import BtnClick from "../../../shared/btns/BtnClick";
import hlpCrud from "../../../shared/helpers/hlpCrud";
import AdditLeave from "./addit-leave";
import MngLeave from "./mng-leave";

type TobProps = {
  userId?: number;
};

const ListLeave = ({ userId = null }: TobProps) => {
  /* const {
    state: { user },
  } = useLocation(); */
  const [btnOne, setBtnOne] = useState({ variant: "btn-primary" });
  const [btnTwo, setBtnTwo] = useState({ variant: "btn-light" });
  const [status, setStatus] = useState("noTreat");
  const [tobs, setTobs] = useState([]);
  const [tob, setTob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dates, setDates] = useState(null);
  const [modal, setModal] = useState(false);
  const [mngModal, setMngModal] = useState(false);
  const location = useLocation();
  const [user, setuser] = useState(location?.state?.user || null);
  /* start: queries -------------------------------------- */

  /* end: queries ---------------------------------------- */
  // --------------------
  const fetchTobs = async () => {
    // setLoading(true);
    const { data: tobs } = await httpService.postBody({ userId: user?.id, status, dates }, "leaves/status");

    setLoading(false);
    setTobs(tobs);
  };

  useEffect(() => {
    fetchTobs();
    return () => {};
  }, [dates, status]);
  // --------------------
  // --------------------
  const onSelectedDates = (dates) => {
    setDates(dates);
    fetchTobs();
  };

  const validator = (tob: any) => {
    return (
      <>
        <ListGroup>
          {tob.mngs.map((mng) => (
            <ListGroupItem>
              {mng.motifReject!! && <p className="fw-bold">{mng.motifReject}</p>}
              <small>{`par ${mng.treatMan.fullname}`}</small>
            </ListGroupItem>
          ))}
        </ListGroup>
      </>
    );
    // return tob.
  };

  const handleLeave = (tob) => {
    setTob(tob);
    setMngModal(true);
  };

  // const leaveStatus = (tob: Leave) => {
  const leaveStatus = (tob: any) => {
    return (
      <>
        {/* {tob.isAccepted && (
          <Button size={"sm"} variant={"success"} className="fs-6 text-uppercase">
            acceptée
          </Button>
        )}
        {tob.isRejected && (
          // <DisplayPopover title={"motif du rejet"} content={tob.motifReject}>
          <Button size={"sm"} variant={"danger"} className="fs-6 text-uppercase">
            rejetée
          </Button>
          // </DisplayPopover>
        )} */}
        {!tob.isAccepted && !tob.isRejected && authService.getAuth({ roles: PHD }) && authService.authUser().id !== tob.author.id ? (
          <BtnClick onClick={handleLeave} tob={tob}>
            <Button className=" btn-xs btn-warning text-uppercase">en attente</Button>
          </BtnClick>
        ) : tob.isAccepted ? (
          <Button variant={"success"} className="btn-xs text-uppercase">
            acceptée
          </Button>
        ) : tob.isRejected ? (
          // <DisplayPopover title={"motif du rejet"} content={tob.motifReject}>
          <Button variant={"danger"} className="btn-xs text-uppercase">
            rejetée
          </Button>
        ) : (
          // </DisplayPopover>
          <Button className=" btn-xs btn-warning text-uppercase">en attente</Button>
        )}
        {/* <Button
          className={classNames(
            "btn btn-sm text-uppercase ",
            !tob.isAccepted || !tob.isRejected ? "btn-warning" : tob.isAccepted ? "btn-success" : "btn-danger"
          )}>
          {!tob.isAccepted || !tob.isRejected ? "en attente" : tob.isAccepted ? "acceptée" : "rejetée"}
        </Button> */}
      </>
    );
  };

  const columns: ReactTableColumnType[] = useMemo(
    () => [
      {
        header: "type",
        accessorKey: "name",
      },
      {
        header: "periode",
        accessorKey: "period",

        cell: ({ row }) => {
          const tob = row.original;
          return <span>{`${dateFormatter(tob.fromDate, "dmy", "/")} à ${dateFormatter(tob.toDate, "dmy", "/")}`}</span>;
        },
      },
      {
        header: "demandeur",
        accessorKey: "author.fullname",

        cell: ({ row }) => {
          const tob = row.original;
          return (
            <>
              <span>{tob.author.fullname}</span>
              {/* <span>{tob.motif}</span> */}
              {/* <DisplayPopover content={"bonbon"}> bonbon </DisplayPopover> */}
              {/* <DisplayPopover /> */}
            </>
          );
        },
      },
      {
        header: "status",
        accessorKey: "type",

        cell: ({ row }) => {
          const tob = row.original;
          return (
            <>
              <DisplayPopover title={`demande de ${tob.name}`} content={tob.motif}>
                <span className="mx-2">motif</span>
              </DisplayPopover>
              {leaveStatus(tob)}
              {tob?.mngs?.length > 0 && (
                <DisplayPopover title={tob.author.fullname} content={validator(tob)}>
                  <span className="mx-2">
                    <i className="fas fa-user-plus"></i>
                  </span>
                </DisplayPopover>
              )}
            </>
          );
        },
      },
    ],
    []
  );

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

  const onAdditLeave = async (values) => {
    setModal(false);
    try {
      const { nTobs } = await hlpCrud.additTobPes(values, tobs, "leaves");
      setTobs(nTobs);
      setTob(null);
      Toastify.success();
    } catch (error) {
      Toastify.error();
    }
  };

  const onMngLeave = async (values) => {
    setMngModal(false);
    values.leaveId = tob.id;
    if (values.validLeave === "isAccepted") {
      values.isAccepted = true;
    }
    if (values.validLeave === "isRejected") {
      values.isRejected = true;
    }
    try {
      const { data } = await httpService.postBody(values, "leavemngments");
      const nTobs = hlpCrud.updateTobOnList(data, tobs);
      setTobs(nTobs);
      Toastify.success();
      console.log(data);
    } catch (error) {
      Toastify.error();
    }
  };

  const btns: BtnType[] = [
    { id: 1, label: "en attente", btnClass: btnOne.variant },
    { id: 2, label: "traité", btnClass: btnTwo.variant },
  ];

  return (
    <>
      <TskTable
        lBtns={{
          btns: btns,
          onBtn: onBtn,
        }}
        // onAdd={onAdd}
        onAdd={() => setModal(true)}
        columns={columns}
        data={tobs}
        loading={loading}
        headTitle={"congés"}
        onSelectedDate={onSelectedDates}
      />
      <ModalBase
        onCloseModal={() => setModal(false)}
        show={modal}
        title={"demande de congé"}
        content={<AdditLeave tob={tob} onSubmitForm={onAdditLeave} onCancelForm={() => setModal(false)} />}
        footer={false}
      />
      <ModalBase
        onCloseModal={() => setMngModal(false)}
        show={mngModal}
        title={
          <span>
            <i className="fas fa-pen"></i> Gestion des demandes de congés
          </span>
        }
        content={<MngLeave tob={tob} onSubmitForm={onMngLeave} onCancelForm={() => setMngModal(false)} />}
        footer={false}
      />
    </>
  );
};

export default ListLeave;
