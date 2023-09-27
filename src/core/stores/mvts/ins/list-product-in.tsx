import { currencyFormatter, dateFormatter, ProductIn, ProductMvt } from "asv-hlps";
import { BtnDownloads, ColEditDel, colToolTip, ModalBase, ReactTableColumnType } from "asv-hlps-react";
import { useEffect, useState } from "react";
import { Button, ButtonGroup, Col, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

import { PdfProductTables } from "../../../../pdfs/products/PdfProductTables";
import { ProductDefinition } from "../../../../pdfs/products/ProductDefinition";
import httpService from "../../../../services/httpService";
import pdfService from "../../../../services/pdfService";
import hlpCrud from "../../../../shared/helpers/hlpCrud";
import LinkCardProduct from "../../products/link-card-product";
import MvtWidget from "../mvt-widget";
import AdditProductIn from "./addit-product-in";
import InputProductIn from "./input-list-product-in";

const ListProductIn = () => {
  const { mvtId } = useParams();
  const navigate = useNavigate();
  const [tobs, setTobs] = useState<ProductIn[]>([]);
  const [mvt, setMvt] = useState<ProductMvt>({});
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  // const [dates, setDates] = useState(null);
  // --------------------
  const fetchTobs = async () => {
    // setLoading(true);
    try {
      const { data } = await httpService.getByParam(mvtId, "productins/mvtin");
      setTobs(data.pdtIns);
      setMvt(data.mvt);
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
      header: "date",
      accessorKey: "createdAt",

      cell: ({ row }) => dateFormatter(row.original.createdAt),
    },
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
      header: () => colToolTip("qtity", "quantité ajoutée"),
      accessorKey: "qtityIn",
    },
    {
      header: () => colToolTip("qtity.r", "quantité restante"),
      accessorKey: "qtity",
    },
    {
      header: () => colToolTip("p.f", "prix fournisseur"),
      accessorKey: "pvdPrice",
    },
    {
      header: () => colToolTip("fab.", "date de fabrication"),
      accessorKey: "manufDate",

      cell: ({ row }) => dateFormatter(row.original.manufDate),
    },
    {
      header: () => colToolTip("exp", "date d' expiration"),
      accessorKey: "expirationDate",

      cell: ({ row }) => dateFormatter(row.original.expirationDate),
    },
    {
      header: "Montant",
      accessorKey: "montant",

      cell: ({ row }) => {
        const tob: ProductIn = row.original;
        return currencyFormatter(tob.qtityIn * tob.pvdPrice);
      },
    },
    {
      header: "depot",
      accessorKey: "depot.name",
    },
    { ...ColEditDel({ handleDelete, handleEdit }) },
  ];
  // --------------------

  const onAdd = () => {
    setModal(true);
  };
  const onCreate = async (obj) => {
    setModal(false);
    const { data } = await httpService.create({ mvtId: mvtId, ins: obj.lines }, "productins/new");
    const newIns = [...tobs, ...data];
    setTobs(newIns);
  };

  const onFinish = () => {
    navigate("/dash/stores/productmvts/list/ins");
  };
  const genPdf = ({ action }) => {
    pdfService.generatePdf(action, ProductDefinition.mvtIn(mvt, PdfProductTables.productInTable(tobs)));
  };
  // --------------------
  return (
    <>
      <Row>
        <Col>
          <h3 className="text-info ">{`Mouvement d'entrée du ${dateFormatter(mvt?.createdAt, "dmy", "/")}`}</h3>
        </Col>
        <Col>
          <ButtonGroup className="float-end">
            <BtnDownloads tob={undefined} onGenPdf={genPdf} icon />
            <Button className="btn btn-sm btn-success" onClick={onAdd}>
              + ADD
            </Button>
            <Button className="btn btn-sm btn-info text-uppercase ms-2" onClick={onFinish}>
              quitter
            </Button>
          </ButtonGroup>
        </Col>
      </Row>

      <MvtWidget mvt={mvt} tobs={tobs} />

      <InputProductIn tobs={tobs} loading={loading} handleDelete={handleDelete} handleEdit={handleEdit} noHeader />

      <ModalBase
        size="xl"
        icon="fas fa-pen"
        title={mvt?.pvd?.name}
        content={<AdditProductIn tob={undefined} onCancelForm={() => setModal(false)} onSubmit={onCreate} />}
        show={modal}
        onCloseModal={() => setModal(false)}
      />
      {/*  */}
    </>
  );
};

export default ListProductIn;
