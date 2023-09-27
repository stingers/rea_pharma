import { currencyFormatterCfa, dateFormatter, ProductInOut, ProductMvt } from "asv-hlps";
import { BtnDownloads, ColEditDel, colToolTip, ModalBase, ReactTableColumnType, TskTable } from "asv-hlps-react";

import dayjs from "dayjs";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Button, ButtonGroup, Col, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

import { PdfProductTables } from "../../../../pdfs/products/PdfProductTables";
import { ProductDefinition } from "../../../../pdfs/products/ProductDefinition";
import httpService from "../../../../services/httpService";
import pdfService from "../../../../services/pdfService";
import DisplayAsyncSelect from "../../../../shared/displays/display-async-select";
import hlpCrud from "../../../../shared/helpers/hlpCrud";
import { Toastify } from "../../../../shared/helpers/Toastify";
import LinkCardProduct from "../../products/link-card-product";
import MvtWidget from "../mvt-widget";
import AdditProductInventory from "./addit-product-inventory";

const ListProductInventory = () => {
  const { mvtId } = useParams();
  const navigate = useNavigate();
  const [tobs, setTobs] = useState<ProductInOut[]>([]);
  const [mvt, setMvt] = useState<ProductMvt>({});
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [product, setProduct] = useState(null);
  const [curDate] = useState(dayjs(new Date()).format("YYYY-MM-DD"));
  // const [dates, setDates] = useState(null);
  // --------------------
  const fetchTobs = async () => {
    try {
      const { data } = await httpService.getByParam(mvtId, "productinventories/mvtinv");
      setMvt(data.mvt);
      setTobs(data.pdtInvs);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchTobs();
    return () => {};
  }, [mvtId]);

  const handleDelete = async (tob) => {
    const nTobs = tobs.filter((x) => x.id !== tob.id);
    setTobs(nTobs);
    const err = await hlpCrud.persistDelete(tob, `url/del`, tobs);
    if (err) {
      setTobs(tobs);
    }
  };

  const handleEdit = () => {};
  // --------------------
  const columns: ReactTableColumnType[] = useMemo(
    () => [
      {
        header: "ref",
        accessorKey: "product.ref",
        cell: ({ row }) => {
          return <LinkCardProduct product={row.original.product} />;
        },
      },
      {
        header: "designation",
        accessorKey: "product.designation",

        /* cell: ({ row }) => {
          return <LinkProductAddit product={row.original.product} />;
        }, */
      },

      {
        header: "lot",
        accessorKey: "lot",
      },
      {
        header: () => colToolTip("q.i", "quantité initial"),
        accessorKey: "initialStock",
      },
      {
        header: () => colToolTip("N.Qtité", "nouvelle quantité"),
        accessorKey: "qtity",
      },
      {
        header: "pght",
        accessorKey: "product.stores[0].pghtPrice",
      },
      {
        header: () => colToolTip("M.T", "Montant total"),
        accessorKey: "productTotalAmount",

        cell: ({ row }) => {
          const tob: ProductInOut = row.original;
          return currencyFormatterCfa(+tob.qtity * +tob.product.stores[0].pghtPrice || 0);
        },
      },

      { ...ColEditDel({ handleDelete, handleEdit }) },
    ],
    []
  );
  // --------------------

  const createInvs = async ({ lines }) => {
    setModal(false);
    const obj = { lots: lines, pdtId: product.id, mvtId: mvt.id };
    try {
      const { data } = await httpService.create(obj, "productinventories");
      setTobs([...tobs, ...data]);
      setProduct(null);
      Toastify.success();
    } catch (error) {
      console.log(error);
    }
  };

  const onFinish = () => {
    navigate("/dash/stores/productmvts/list/inventory");
  };

  const genPdf = ({ action }) => {
    pdfService.generatePdf(action, ProductDefinition.mvtIn(tobs[0]?.mvt, PdfProductTables.productInTable(tobs)));
  };
  // --------------------

  const onProductChange = useCallback((product) => {
    if (product) {
      setProduct(product);
      setModal(true);
    }
  }, []);
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
  return (
    <>
      <Row>
        <Col>
          <h3 className="text-info ">{`Mouvement d'inventaire du ${dateFormatter(mvt?.createdAt, "dmy", "/")}`}</h3>
        </Col>
        <Col>
          <ButtonGroup className="float-end">
            <BtnDownloads tob={undefined} onGenPdf={genPdf} icon />
            {/*  <Button className="btn btn-sm btn-success" onClick={onAdd}>
              + ADD
            </Button> */}
            <Button className="btn btn-sm btn-info text-uppercase ms-2" onClick={onFinish}>
              quitter
            </Button>
          </ButtonGroup>
        </Col>
      </Row>
      <MvtWidget mvt={mvt} tobs={tobs} />
      {/* {curDate === dayjs(mvt?.createdAt).format("YYYY-MM-DD") && ( */}
      <Row>
        <Col className="my-2">
          <DisplayAsyncSelect isClearable onChange={onProductChange} httpService={httpService} url="products" labelProp="designation" />
        </Col>
      </Row>
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
        tableClass="table-bordered"
        loading={loading}
        columns={columns}
        data={tobs}
        noHeader
      />
      <ModalBase
        // footer={false}
        size="lg"
        icon="fas fa-pen"
        title={product?.designation}
        content={<AdditProductInventory tob={product} onCancelForm={() => setModal(false)} onSubmit={createInvs} />}
        show={modal}
        onCloseModal={() => setModal(false)}
      />

      {/*  */}
    </>
  );
};

export default ListProductInventory;
