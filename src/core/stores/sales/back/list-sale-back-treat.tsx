import { dateFormatter } from "asv-hlps";
import { ColDel, ModalBase, ModalConfirm, ReactTableColumnType, Toastify, TskTable, useQueryCrud } from "asv-hlps-react";
import { Sale } from "asv-hlps/lib/cjs/models/entities/sales/Sale";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import { Badge, Button } from "react-bootstrap";

import { ADM } from "../../../../auth/services/auth-menu";
import authService from "../../../../auth/services/authService";
import httpService from "../../../../services/httpService";
import BtnSaleAction from "../btn-sale-action";
import DetailSale from "../detail-sale";
import useSaleBackPills from "../useSaleBackPills";
import { SaleBack } from "./SaleBack";
import TreatSaleBackForm from "./treat-sale-back-form";

type TobProps = {
  userId?: number;
};

const ListSaleBackTreat = ({ userId }: TobProps) => {
  const [modal, setModal] = useState(false);
  const [dates, setDates] = useState(null);
  const { btns, onBtn, treat } = useSaleBackPills();
  const [sale, setSale] = useState<Sale>(null);
  const [tob, setTob] = useState<SaleBack>(null);

  const [modalSale, setModalSale] = useState(false);
  const [modalConfirm, setModalConfirm] = useState(false);

  const { tobs, isLoading, handleSelectedDates, handleRefresh, handleDelete } = useQueryCrud({
    httpService,
    keys: ["salesback", treat, userId, dates],
    url: "salesback/status",
    urlDel: "sales",
    postParam: { treat, userId, dates },
  });

  const onValidSaleBack = (saleBack) => {
    setTob(saleBack);
    setModal(true);
  };

  const handleTreat = async (obj) => {
    setModal(false);
    if (obj) {
      if (obj.backChoice) {
        tob.isValided = true;
        tob.backChoice = obj.backChoice;
        tob.reason = obj.reason;
        /* if (+obj.backChoice === 2) {
          setModalConfirm(true);
        } */
      } else {
        tob.isRejected = true;
        tob.comment = obj.reason;
      }
      try {
        const { data } = await httpService.postBody(
          { saleBackId: tob.id, backChoice: obj.backChoice, reason: obj.reason },
          "salesback/treat"
        );

        if (+obj.backChoice === 2) {
          setModalConfirm(true);
        }

        // const nTobs = hlpCrud.updateTobOnList(data, tobs)

        Toastify.success();
      } catch (error) {}
    }
  };

  const onDetailSale = async (saleBack) => {
    try {
      const { data } = await httpService.getByParam(saleBack.ref.substring(3), "sales/ref");
      setSale(data);
      setModalSale(true);
    } catch (error) {}
  };

  const onBackProductToStock = async () => {
    try {
      const { data } = await httpService.postBody({ saleBackId: tob.id }, "salesback/backProductsToStock2");
      setModalConfirm(false);
      if (data) {
        Toastify.success();
      }
      return;
    } catch (error) {}
  };

  // --------------------
  const onSelectedDates = (dates) => {
    setDates(dates);
    // fetchDatas();
  };

  const refBody = (tob: Sale) => tob.ref.substring(3);

  console.log("------ tobs ------");
  console.log(tobs);
  console.log("------ tobs ------");

  // --------------------
  const colStatus = (tob: Sale) => {
    return (
      <>
        {!tob.isDelivered && !tob.isValided && !tob.isRejected && (
          <Button onClick={() => onValidSaleBack(tob)} variant={"danger"} className="btn-xs text-uppercase">
            attente
          </Button>
        )}
        {tob.isValided && (
          <Button variant={"success"} className="btn-xs text-uppercase">
            accepté
          </Button>
        )}
        {tob.isRejected && (
          <Button size={"sm"} variant={"danger"} className=" btn-xs text-uppercase">
            rejeté
          </Button>
        )}
      </>
    );
  };

  const columns: ReactTableColumnType[] = useMemo(
    () => [
      { ...ColDel({ handleDelete }) },
      { header: "id", accessorKey: "id" },

      {
        header: "ref commande",
        accessorKey: "ref",
        cell: ({ row }) => {
          const saleBack: Sale = row.original;
          return (
            <>
              {/* saleBack */}
              <BtnSaleAction print={true} sale={saleBack}>
                <Badge bg={saleBack.isValided ? "success" : "danger"} className="p-1">
                  {saleBack.ref.substring(0, 2)}
                </Badge>
                <span> - {saleBack.ref.substring(3)}</span>
              </BtnSaleAction>
              {/* sale */}
              {/* <BtnSaleAction print={true} sale={row.original}>
                
              </BtnSaleAction> */}
            </>
          );
        },
      },
      {
        header: "id client",
        // accessorKey: "client?.username",
        accessorFn: (row) => row.client?.username,
      },
      {
        header: "date de creation",
        accessorKey: "saleDate",
        cell: ({ row }) => dateFormatter(row.original.saleDate, "dmy", "/"),
      },
      {
        header: "date de traitement",
        accessorKey: "treatDate",
        cell: ({ row }) => (row.original.treatDate ? dateFormatter(row.original.treatDate, "dmy", "/") : null),
      },
      {
        header: "auteur",
        accessorKey: "encoder.fullname",
      },
      {
        header: "status",
        accessorKey: "status",
        cell: ({ row }) => colStatus(row.original),
        //
      },
    ],
    [treat, dates, handleDelete]
  );

  return (
    <>
      <TskTable
        lBtns={{
          btns: btns,
          onBtn: onBtn,
        }}
        headTitle={"retours"}
        columns={columns}
        data={tobs || []}
        // loading={isLoading}
        // tableClass={"fs-6  table-sm table-striped fw-bold text-uppercase"}
        onSelectedDate={onSelectedDates}
        // onSelectedDate={handleSelectedDates}
        initialState={{
          columnVisibility: {
            del: authService.getAuth({ roles: [...ADM] }),
            id: authService.getAuth({ roles: ["sadm"] }),
          },
        }}
      />
      <ModalBase
        icon="fas fa-pen"
        content={<TreatSaleBackForm tob={tob} onCancelForm={() => setModal(false)} onSubmitForm={handleTreat} />}
        onCloseModal={() => setModal(false)}
        show={modal}
        title={`commande retour ${tob?.ref}`}
      />
      <ModalBase
        size="lg"
        title={`commande N° ${sale?.ref} du ${dayjs(sale?.saleDate).format("DD/MM/YYYY : HH.mm")}`}
        show={modalSale}
        onCloseModal={() => setModalSale(false)}
        content={<DetailSale tob={sale} />}
      />
      <ModalConfirm
        content={"Voulez-vous mettre le product en stock ?"}
        show={modalConfirm}
        onCloseModal={() => setModalConfirm(false)}
        onApprove={onBackProductToStock}
        approveVariant={"success"}
        cancelLabel={"non"}
        cancelVariant={"danger"}
        onCancel={() => setModalConfirm(false)}
      />
    </>
  );
};

export default ListSaleBackTreat;
