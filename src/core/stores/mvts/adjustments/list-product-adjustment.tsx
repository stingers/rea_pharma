import { currencyFormatter, currencyFormatterCfa, dateFormatter, ProductInOut, ProductMvt } from "asv-hlps";
import { BtnDownloads, ColEditDel, colToolTip, ModalBase, ReactTableColumnType, TskTable } from "asv-hlps-react";

import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { Button, ButtonGroup, Col, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

import { PdfProductTables } from "../../../../pdfs/products/PdfProductTables";
import { ProductDefinition } from "../../../../pdfs/products/ProductDefinition";
import httpService from "../../../../services/httpService";
import pdfService from "../../../../services/pdfService";
import DisplayAsyncSelect from "../../../../shared/displays/display-async-select";
import DisplayTrTotal from "../../../../shared/displays/display-tr-total-amount";
import hlpCrud from "../../../../shared/helpers/hlpCrud";
import { Toastify } from "../../../../shared/helpers/Toastify";
import LinkProductCard from "../../products/link-card-product";
import MvtWidget from "../mvt-widget";
import AdditProductAdjustment from "./addit-product-adjustment";

const ListProductAdjustment = () => {
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
      const { data } = await httpService.getByParam(mvtId, "productadjustments/mvtadjut");
      setMvt(data.mvt);
      setTobs(data.adjusts);
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
          return <LinkProductCard product={row.original.product} />;
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
        header: () => colToolTip("q.n", "quantité nouvelle"),
        accessorKey: "qtity",
      },
      {
        header: () => colToolTip("diff", "Montant total"),
        accessorKey: "diff",

        cell: ({ row }) => {
          const tob: ProductInOut = row.original;
          const diff = +tob.qtity - +tob.initialStock;
          return diff > 0 ? "+" + diff : diff;
        },
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
          return currencyFormatter(Math.floor(+tob.qtity * +tob.product.stores[0].pghtPrice || 0));
        },
      },

      { ...ColEditDel({ handleDelete, handleEdit }) },
    ],
    []
  );
  // --------------------
  const handleRefresh = () => {
    fetchTobs();
  };

  const createAdjusts = async ({ lines: ins }) => {
    // --------------------
    setModal(false);
    const obj = { ins, mvtId: mvt.id };
    try {
      const { data } = await httpService.create(obj, "productadjustments");
      handleRefresh();
      setProduct(null);
      Toastify.success();
    } catch (error) {
      console.log(error);
    }
  };
  const onFinish = () => {
    navigate("/dash/stores/productmvts/list/adjustment");
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
  const getTotalPriceEstimed = useMemo(() => {
    if (tobs) {
      return (
        tobs.reduce((prev, curr: ProductInOut) => {
          return prev + +curr?.qtity * +curr?.product?.stores[0]?.pghtPrice;
        }, 0) || 0
      );
    }
    return 0;
  }, [tobs]);
  // --------------------
  return (
    <>
      <Row>
        <Col>
          <h3 className="text-info ">{`Mouvement d'adjustement du ${dateFormatter(mvt?.createdAt, "dmy", "/")}`}</h3>
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
      <TskTable
        pushTrs={<DisplayTrTotal colSpan={8} label={"motnant estimé"} total={Math.floor(+getTotalPriceEstimed)} cfa />}
        loading={loading}
        columns={columns}
        data={tobs}
        noHeader
      />
      <ModalBase
        size="lg"
        icon="fas fa-pen"
        title={product?.designation}
        content={<AdditProductAdjustment tob={product} onCancelForm={() => setModal(false)} onSubmit={createAdjusts} />}
        show={modal}
        onCloseModal={() => setModal(false)}
      />
    </>
  );
};

export default ListProductAdjustment;
