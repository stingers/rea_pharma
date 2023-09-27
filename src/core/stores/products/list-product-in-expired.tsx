import { currencyFormatter, dateFormatter, getColorAccordingToDate, ProductIn } from "asv-hlps";
import { colToolTip, ModalConfirm, ReactTableColumnType, TskTable } from "asv-hlps-react";
import lodash from "lodash";
import { useEffect, useMemo, useState } from "react";
import { Button } from "react-bootstrap";
import { useParams } from "react-router-dom";

import { DocDefinition } from "../../../pdfs/DocDefinition";
import { PdfProductTables } from "../../../pdfs/products/PdfProductTables";
import excelService from "../../../services/excelService";
import httpService from "../../../services/httpService";
import pdfService from "../../../services/pdfService";
import BtnClick from "../../../shared/btns/BtnClick";
import { Toastify } from "../../../shared/helpers/Toastify";
import LinkCardProduct from "./link-card-product";

const ListProductInExpired = () => {
  const param = useParams();
  const [tobs, setTobs] = useState([]);
  const [tob, setTob] = useState(null);
  const [pdtOuts, setPdtOuts] = useState<ProductIn[]>([]);
  const [filteredTobs, setFilteredTobs] = useState([]);
  const [agcys, setAgcys] = useState([]);
  const [labos, setLabos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState({
    id: 0,
    name: "tous",
    type: null,
  });

  const [modal, setModal] = useState(false);

  // --------------------
  const fetchTobs = async () => {
    setLoading(true);
    const { data } = await httpService.get("productins/expiration");
    setLoading(false);
    setTobs(data.pdtsOut);
    setFilteredTobs(data.pdtsOut);
    setAgcys(data.agcys);
    setLabos(data.labos);
  };

  useEffect(() => {
    fetchTobs();
    return () => {};
  }, []);

  // --------------------
  const groupedOptions = [
    {
      id: 0,
      name: "tous",
    },
    {
      label: "agences",
      options: agcys,
    },
    {
      label: "laboratoires",
      options: labos,
    },
  ];

  const agcyLaboText = () => {
    if (!selectedOption) {
      return "";
    }
    let index;
    index = agcys.findIndex((x) => x.id === selectedOption?.id);
    if (index !== -1) {
      const agcy = agcys[index];
      return "Agence: " + agcy.name;
    } else {
      index = labos.findIndex((x) => x.id === selectedOption?.id);
      if (index !== -1) {
        const labo = labos[index];
        return "Labo: " + labo.name;
      }
      return "";
    }
  };

  const onGenExcel = () => {
    excelService.exportAsExcelFileByTableId("expired", "proche_peremption");
  };

  const onGenPdf = (action: string) => {
    pdfService.generatePdf(
      action,
      DocDefinition.generic("Produits à péremption proche \n" + agcyLaboText(), PdfProductTables.productInOutDateTable(filteredTobs))
    );
  };

  const getColor = (pdtIn: ProductIn) => {
    return getColorAccordingToDate(pdtIn.expirationDate, 3, 6, 9);
  };
  // --------------------
  const columns: ReactTableColumnType[] = useMemo(
    () => [
      {
        header: "ref",
        accessorKey: "product.ref",
        cell: ({ row }) => {
          return (
            <span style={{ color: getColor(row.original) }}>
              {row.original.product.ref}
              {/* <LinkProductAddit product={row.original.product} /> */}
            </span>
          );
        },

        /* cell: ({ row }) => {
          return (
            <span style={{ color: getColor(row.original) }}>
              <LinkCardProduct product={row.original.product} />
            </span>
          );
        }, */

        // className: ({ row }) => getColor(row.original),
        // style: { backgroundColor: "red" },
      },
      {
        header: "designation",
        accessorKey: "product.designation",
        // style: { backgroundColor: "red" },

        cell: ({ row }) => {
          return (
            <span style={{ color: getColor(row.original) }}>
              <LinkCardProduct product={row.original.product}>{row.original.product.designation}</LinkCardProduct>
            </span>
          );
        },
      },
      {
        header: "agence",
        accessorKey: "product.agcy.ste.name",
      },
      {
        header: "labo",
        accessorKey: "product.labo.ste.name",
      },
      {
        header: "lot",
        accessorKey: "lot",
      },
      {
        header: () => colToolTip("fab", "date de fabrication"),
        accessorKey: "manufDate",

        cell: ({ row }) => dateFormatter(row.original.manufDate),
      },
      {
        header: () => colToolTip("exp", "date d'expiration"),
        accessorKey: "expirationDate",

        cell: ({ row }) => dateFormatter(row.original.expirationDate),
      },
      {
        header: () => colToolTip("qtite.", "Quantité proche péremption"),
        accessorKey: "qtity",
      },
      {
        header: () => colToolTip("pght", "Prix pght"),
        accessorKey: "product.stores[0].pghtPrice",
      },
      {
        header: () => colToolTip("montant", "Montant pght estimé"),
        accessorKey: "montant",
        cell: ({ row }) => (
          <div className="text-end">{currencyFormatter(Math.ceil(+row.original.product.stores[0].pghtPrice * +row.original.qtity))}</div>
        ),
      },
      {
        header: () => colToolTip(<i className="fas fa-cog"></i>, "sortir du stock"),
        accessorKey: "outs",
        cell: ({ row }) => (
          <BtnClick onClick={onProductOut} tob={row.original}>
            <Button className="btn btn-xs btn-info">
              <i className="fas fa-arrow-right"></i>{" "}
            </Button>
          </BtnClick>
        ),
      },
    ],
    []
  );
  // --------------------

  const onSelectedOption = (opt) => {
    setSelectedOption(opt);
    let filterTobs = [];
    if (opt.id === 0) {
      filterTobs = tobs;
      setFilteredTobs(filterTobs);
    } else {
      filterTobs = tobs.filter((x) => x.product?.agcy?.id === opt.id || x.product?.labo?.id === opt.id);
      setFilteredTobs(filterTobs);
    }
  };

  const onProductOut = (prop) => {
    setPdtOuts([prop]);
    setModal(true);
  };

  const onApproveOut = async () => {
    setModal(false);
    // ------ gen outs ------
    let outs = [];
    pdtOuts.map((pdtOut) => {
      return outs.push(genOut(pdtOut));
    });
    // ------ remove from list ------
    const oldFilteredTobs = lodash.cloneDeep(filteredTobs);
    const oldTobs = lodash.cloneDeep(tobs);
    let nTobs = [];
    let nFiltered = [];
    for (const out of pdtOuts) {
      nTobs = tobs.filter((x) => x.id !== out.id);
      nFiltered = filteredTobs.filter((x) => x.id !== out.id);

      /* const index = filteredTobs.indexOf(out);
      filteredTobs.splice(index, 1);
      setFilteredTobs(filteredTobs); */
    }
    setFilteredTobs(nFiltered);
    setTobs(nTobs);

    // return;
    try {
      const { data } = await httpService.create(outs, "productouts");
      Toastify.success();
    } catch (error) {
      setFilteredTobs(oldFilteredTobs);
      setTobs(oldTobs);
      Toastify.error();
    }
  };

  return (
    <>
      <TskTable
        headTitle={`Gestions des périmés ${selectedOption.type ? selectedOption.type : ""}`}
        onGenExcel={onGenExcel}
        columns={columns}
        data={filteredTobs}
        loading={loading}
        tableId={"expired"}
        onGenPdf={onGenPdf}
        rSelect={{ options: groupedOptions, onSelectedOption: onSelectedOption, defaultValue: selectedOption }}
        // isSelectable
        //
      />
      <ModalConfirm
        content={
          <span>
            Etes-vous sûr de vouloir sortir
            <b className="fw-bold"> {pdtOuts?.length === 1 ? pdtOuts[0]?.product.designation : "les produits sélectionnés "}</b> du stock ?
          </span>
        }
        show={modal}
        onCloseModal={() => setModal(false)}
        onApprove={onApproveOut}
      />
    </>
  );
};

const genOut = (out: ProductIn, reason: number = 2, mvtId: number = null, comment: string = " ") => {
  return {
    pdtId: out.product.id,
    pdtDesignation: out.product.designation,
    mvtId: mvtId,
    qtity: +out.qtity,
    reason: reason,
    comment: comment,
    inId: out.id,
    fromExpired: true,
  };
};

export default ListProductInExpired;
