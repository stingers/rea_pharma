import { currencyFormatter, currencyFormatterCfa, dateFormatter, ProductInOut, ProductMvt } from "asv-hlps";
import { BtnDownloads, ColEditDel, colToolTip, ModalBase, ReactTableColumnType } from "asv-hlps-react";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Button, ButtonGroup, Col, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import AdditProductOut from "./addit-product-out";
import InputListProductOut from "./input-list-product-out";

import { PdfProductTables } from "../../../../pdfs/products/PdfProductTables";
import { ProductDefinition } from "../../../../pdfs/products/ProductDefinition";
import httpService from "../../../../services/httpService";
import pdfService from "../../../../services/pdfService";
import DisplayAsyncSelect from "../../../../shared/displays/display-async-select";
import hlpCrud from "../../../../shared/helpers/hlpCrud";
import { Toastify } from "../../../../shared/helpers/Toastify";
import LinkCardProduct from "../../products/link-card-product";
import MvtWidget from "../mvt-widget";

const ListProductOut = () => {
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
      const { data } = await httpService.getByParam(mvtId, "productouts/mvtout");
      setMvt(data.mvt);
      setTobs(data.pdtOuts);
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
  const columns: ReactTableColumnType[] = [
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
      header: () => colToolTip("q.s", "quantité sortie"),
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
        return currencyFormatter(+tob.qtity * +tob.product.stores[0].pghtPrice || 0);
      },
    },
    {
      header: "raison",
      accessorKey: "reason.name",
    },

    { ...ColEditDel({ handleDelete, handleEdit }) },
  ];
  // --------------------

  const handleRefresh = () => {
    fetchTobs();
  };

  const createOuts = async ({ lines: outs }) => {
    setModal(false);
    for (const out of outs) {
      out.pdtId = product.id;
      out.pdtDesignation = product.designation;
      out.mvtId = mvt.id;
    }
    try {
      const { data } = await httpService.create(outs, "productouts");
      handleRefresh();
      setProduct(null);
      Toastify.success();
    } catch (error) {
      console.log(error);
    }
  };
  const onFinish = () => {
    navigate("/dash/stores/productmvts/list/outs");
  };
  const genPdf = ({ action }) => {
    pdfService.generatePdf(action, ProductDefinition.mvtIn(tobs[0]?.mvt, PdfProductTables.productInTable(tobs)));
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
  return (
    <>
      <Row>
        <Col>
          <h3 className="text-info ">{`Mouvement de sortie du ${dateFormatter(mvt?.createdAt, "dmy", "/")}`}</h3>
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

      {curDate === dayjs(mvt.createdAt).format("YYYY-MM-DD") && (
        <Row>
          <Col className="my-2">
            <DisplayAsyncSelect isClearable onChange={onProductChange} httpService={httpService} url="products" labelProp="designation" />
          </Col>
        </Row>
      )}

      <InputListProductOut tobs={tobs} handleDelete={handleDelete} loading={loading} noHeader={true} />

      <ModalBase
        size="xl"
        icon="fas fa-pen"
        title={product?.designation}
        content={<AdditProductOut tob={product} onCancelForm={() => setModal(false)} onSubmit={createOuts} />}
        show={modal}
        onCloseModal={() => setModal(false)}
      />
    </>
  );
};

export default ListProductOut;
