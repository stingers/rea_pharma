import { useQueryClient } from "@tanstack/react-query";
import { ProductInOut, ProductMvt, ProductTransfert, currencyFormatterCfa, dateFormatter } from "asv-hlps";
import { BtnDownloads, ModalBase, ReactTableColumnType, Toastify, TskTable } from "asv-hlps-react";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { Button, ButtonGroup, Col, Row } from "react-bootstrap";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import httpService from "../../../../services/httpService";
import LinkCardProduct from "../../products/link-card-product";
import hlpMvt from "../hlpMvt";
import MvtWidget from "../mvt-widget";
import AddValidedTransfert from "./add-valided-transfert";

type TobProps = {
  dates?: any;
};

const ListProductTransfert = ({ dates }: TobProps) => {
  const { mvtId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [tobs, setTobs] = useState<ProductTransfert[]>([]);
  const [mvt, setMvt] = useState<ProductMvt>({});
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [modalTransfert, setModalTransfert] = useState(false);
  const [product, setProduct] = useState(null);
  const [curDate] = useState(dayjs(new Date()).format("YYYY-MM-DD"));
  // const [dates, setDates] = useState(null);
  const queryClient = useQueryClient();
  // --------------------
  const fetchTobs = async () => {
    try {
      const { data } = await httpService.getByParam(mvtId, "producttransferts/mvttrf");
      setMvt(data.mvt);
      setTobs(data.trfs);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchTobs();
    return () => {};
  }, [mvtId]);

  // --------------------
  const columns: ReactTableColumnType[] = useMemo(
    () => [
      {
        header: "ref",
        accessorFn: (row) => row.pdtIn.product.ref,
      },
      {
        header: "designation",
        accessorFn: (row) => row.pdtIn.designation,
        cell: ({ row }) => {
          return <LinkCardProduct product={row.original.pdtIn.product}>{row.original.pdtIn.product.designation}</LinkCardProduct>;
        },
      },
      {
        header: "lot",
        accessorKey: "lot",
      },
      {
        header: " quantité transférer",
        accessorKey: "qtity",
      },
      {
        header: "depart",
        accessorKey: "pdtIn.depot.name",
      },
      {
        header: "arrivé",
        accessorKey: "endDepot.name",
      },
    ],
    []
  );

  // --------------------

  const onFinish = () => {
    navigate("/dash/stores/productmvts/list/transfert");
  };
  const genPdf = ({ action }) => {
    hlpMvt.genPdfTransfert(action, mvt, tobs);
  };
  // --------------------

  const onProductChange = (product) => {
    if (product) {
      setProduct(product);
      setModal(true);
    }
  };
  // --------------------
  const getTotalPriceEstimed = () => {
    if (tobs) {
      return (
        tobs.reduce((prev, curr: ProductInOut) => {
          return prev + +curr?.qtity * +curr?.product?.stores[0]?.pghtPrice;
        }, 0) || 0
      );
    }
    return 0;
  };
  // --------------------

  // --------------------
  const onWaitingTransfert = () => {
    setModalTransfert(true);
  };
  // const onValidedTransfert = async (obj) => {
  const onValidedTransfert = async (obj) => {
    setModalTransfert(false);
    // const oldTob = lodash.cloneDeep(mvt);

    try {
      mvt.isDone = true;
      setMvt(mvt);
      const { status } = await hlpMvt.validedTransfert(mvt.id, obj.id);
      if (status === 200) {
        queryClient.invalidateQueries(["productmvts", mvt, dates]);
        Toastify.success();
      }
    } catch (error) {
      // setMvt(oldTob);
      Toastify.error();
    }
  };
  // --------------------
  return (
    <>
      <Row>
        <Col>
          <h3 className="text-info ">{`Mouvement de transfert du ${dateFormatter(mvt?.createdAt, "dmy", "/")}`}</h3>
        </Col>
        <Col>
          <ButtonGroup className="float-end">
            <BtnDownloads tob={undefined} onGenPdf={genPdf} icon />
            {mvt.isDone && <Button className="btn btn-sm btn-success text-uppercase">effectué</Button>}
            {!mvt.isDone && tobs.length && (
              <Button className="btn btn-sm btn-danger text-uppercase" onClick={onWaitingTransfert}>
                en attente
              </Button>
            )}
            <Button className="btn btn-sm btn-info text-uppercase ms-2" onClick={onFinish}>
              quitter
            </Button>
          </ButtonGroup>
        </Col>
      </Row>
      <MvtWidget tobs={tobs} mvt={mvt} />
      {/* {curDate === dayjs(mvt?.createdAt).format("YYYY-MM-DD") && ( */}
      {/* <Row>
        <Col className="my-2">
          <DisplayAsyncSelect isClearable onChange={onProductChange} httpService={httpService} url="products" labelProp="designation" />
        </Col>
      </Row> */}
      {/* )} */}
      <TskTable
        pushTrs={
          <tr>
            <td colSpan={6} className={"text-right fw-bold"}>
              Montant estimé
            </td>
            <td className={"text-right fw-bold"}>{currencyFormatterCfa(+getTotalPriceEstimed() || 0)}</td>
          </tr>
        }
        loading={loading}
        columns={columns}
        data={tobs}
        noHeader
      />
      <ModalBase
        title={`validation du tranfert N° ${mvt?.ref}`}
        show={modalTransfert}
        onCloseModal={() => setModalTransfert(false)}
        icon={"fa fa-pen"}
        content={<AddValidedTransfert onCancelForm={() => setModalTransfert(false)} onSubmitForm={onValidedTransfert} tob={mvt} />}
      />
    </>
  );
};

export default ListProductTransfert;
