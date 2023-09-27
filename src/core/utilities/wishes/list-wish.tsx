import { dateFormatter, User } from "asv-hlps";
import { BtnAction, BtnToggle, ModalBase, ReactTableColumnType, Toastify, TskTable } from "asv-hlps-react";
import DisplayPopover from "asv-hlps-react/lib/cjs/reacts/displays/display-popover";
import { BtnType } from "asv-hlps-react/lib/cjs/reacts/type";
import classNames from "classnames";
import { useEffect, useMemo, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";

import authService from "../../../auth/services/authService";
import httpService from "../../../services/httpService";
import AdditStrNbrSelect from "../../../shared/forms/addit-str-nbr-select";
import hlpCrud from "../../../shared/helpers/hlpCrud";
import useWishPills from "./useWishPills";

const ListWish = () => {
  const [tobs, setTobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { status, btns, onBtn } = useWishPills();
  const [modal, setModal] = useState(false);
  const [drop, setDrop] = useState(null);

  const auth = authService.authUser() as User;
  // --------------------
  const fetchDatas = async () => {
    // setLoading(true);
    const { data: tobs } = await httpService.getByParam(status, "wishes/status");
    setLoading(false);
    setTobs(tobs);
  };
  useEffect(() => {
    fetchDatas();
    return () => {};
  }, [status]);
  // --------------------

  const drops: BtnType[] = [
    { id: 1, label: "accepter" },
    { id: 2, label: "refuser" },
  ];

  const onDrop = (val) => {
    setDrop(val);
    switch (val.id) {
      case 1:
      case 2:
        setModal(true);
        break;
    }
  };

  const getIsAcceptedStatus = (tob) => {
    if (tob.isAccepted) {
      if (tob.reply) {
        return (
          <>
            <DisplayPopover title={"Plus d'info sur votre suggestion"} content={tob.reply}>
              <i className=" fa fa-2x fa-comments text-success mx-2" />
            </DisplayPopover>
            <Button className="btn btn-success btn-sm text-uppercase">Acceptée</Button>
          </>
        );
      } else {
        return <Button className="btn btn-success btn-sm text-uppercase">Acceptée</Button>;
      }
    }
  };

  const getIsRejectedStatus = (tob) => {
    if (tob.isRejected) {
      return (
        <>
          <DisplayPopover title={"Motif du rejet"} content={tob.rejectedReason}>
            <i className=" fa fa-2x fa-comments text-danger mx-2" />
          </DisplayPopover>
          <Button className=" btn-info btn-sm ">Rejetée</Button>
        </>
      );
    }
  };

  const columns: ReactTableColumnType[] = useMemo(
    () => [
      {
        // header: "",
        accessorKey: "message",

        cell: ({ row }) => {
          const tob = row.original;
          return (
            <blockquote
              className={classNames(
                "blockquote overflow-scoll flex-1",
                !tob.isAccepted && !tob.isRejected ? "blockquote mb-0 shadow border-danger" : "blockquote mb-0 shadow border-success"
              )}>
              <Row>
                <Col sm={8}>
                  <div className="mb-1">{tob.message}</div>
                  <footer className="blockquote-footer text-black">
                    {`#${tob.id}`} {dateFormatter(tob.createdAt)}
                    {auth.username !== tob.author.username && <cite title="Source Title">{tob.author.fullname}</cite>}
                  </footer>
                </Col>
                <Col sm={4}>
                  <div>
                    {getIsAcceptedStatus(tob)}
                    {getIsRejectedStatus(tob)}

                    {!tob.isAccepted && !tob.isRejected && authService.getAuth({ roles: ["sadm"] }) && (
                      <BtnAction dropMenu={{ drops, label: "attente" }} onDrop={(id) => onDrop({ id, tob })} />
                    )}
                    {!tob.isAccepted && !tob.isRejected && !authService.getAuth({ roles: ["sadm"] }) && (
                      <Button className="btn-sm">attente</Button>
                    )}

                    {authService.getAuth({ roles: ["sadm"] }) &&
                      (tob.isAccepted || tob.isRejected ? (
                        <span className="mx-2">
                          <BtnToggle check={tob.isDone} onToggle={undefined} theme="thumbs" />
                        </span>
                      ) : (
                        <Button className="btn-sm mx-1 not-allowed btn-danger">ToDo</Button>
                      ))}
                  </div>
                </Col>
              </Row>
            </blockquote>
          );
        },
      },
    ],
    []
  );

  const handleWish = async ({ str }) => {
    setModal(false);
    const wish = drop.tob;
    wish.isDone = true;
    drop.id === 1 ? (wish.isAccepted = true) : (wish.isRejected = true);
    drop.id === 1 ? (wish.reply = str) : (wish.rejectedReason = str);
    const nTobs = hlpCrud.updateTobOnList(wish, tobs);
    try {
      await httpService.create(wish, "wishes/new");
      setTobs(nTobs);
      Toastify.success();
    } catch (error) {
      Toastify.error();
    }
    setDrop(null);
  };

  const handleClose = async () => {
    setModal(false);
    if (drop.id === 1) {
      const wish = drop.tob;
      wish.isAccepted = true;
      wish.isDone = true;
      const nTobs = hlpCrud.updateTobOnList(wish, tobs);
      try {
        await httpService.create(wish, "wishes/new");
        setTobs(nTobs);
        Toastify.success();
      } catch (error) {
        Toastify.error();
      }
    }

    setDrop(null);
  };

  return (
    <>
      <TskTable
        lBtns={{
          btns: btns,
          onBtn: onBtn,
        }}
        tableClass="table table-sm table-borderless"
        loading={loading}
        columns={columns}
        data={tobs}
      />
      <ModalBase
        onCloseModal={handleClose}
        icon="fas fa-pen"
        show={modal}
        title={drop && drop.id == 1 ? "Voulez-vous ajouter une Réponse" : "raison du refus"}
        content={<AdditStrNbrSelect type="textarea" label={"text"} onSubmitForm={handleWish} />}
      />
    </>
  );
};

export default ListWish;
