import { useQueryClient } from "@tanstack/react-query";
import { deepClone, HlpEntry, Product, StockPipe } from "asv-hlps";
import {
  BtnToggle,
  ColEditDel,
  colToolTip,
  DropMenuType,
  ModalBase,
  ReactTableColumnType,
  Toastify,
  TskTable,
  useQueryDel,
  useQueryGet,
} from "asv-hlps-react";
import lodash from "lodash";
import { useEffect, useMemo, useState } from "react";

import { PHD } from "../../../../auth/services/auth-menu";
import authService from "../../../../auth/services/authService";
import { CpaDefinition } from "../../../../pdfs/CpaDefinition";
import { PdfProductTables } from "../../../../pdfs/products/PdfProductTables";
import excelService from "../../../../services/excelService";
import httpService from "../../../../services/httpService";
import pdfService from "../../../../services/pdfService";
import hlpCrud from "../../../../shared/helpers/hlpCrud";
import AdditProduct from "../addit-product";
import LinkCardProduct from "../link-card-product";

const ListProduct = () => {
  /* start: queries -------------------------------------- */

  const queryClient = useQueryClient();
  const { data: products, isLoading } = useQueryGet({
    httpService,
    url: "products",
    // url: "products/limit",
    keys: ["products"],
  });
  const delProduct = useQueryDel(httpService, ["products"], "products");
  /* const addProduct = useQueryCreate(httpService, ["products"], "products");
  const editProduct = useQueryCreate(httpService, ["products"], "products/edit"); */
  /* const addProduct = useQueryCreate(["products"], "products/new");
  const editProduct = useQueryUpdate(["products"], "products/edit"); */

  /* end: queries ---------------------------------------- */

  const [pdfPdts, setPdfPdts] = useState([]);
  const [modal, setModal] = useState(false);
  const [tob, setTob] = useState(null);
  // --------------------
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const publicPrice = (tob) => {
    HlpEntry.amountSold(tob);
    return tob.stores[0].publicPrice
      ? tob.stores[0].publicPrice
      : tob?.stores[0].pvdPrice * tob.stores[0].pght * tob.stores[0].fees * tob.stores[0].profitPhcie;
  };
  // --------------------
  useEffect(() => {
    const pdts: any[] = deepClone(formatProductsForInventories((products as Product[]) || []));
    for (const pdt of pdts) {
      for (let index = 0; index < 2; index++) {
        pdt.lots.push("");
      }
    }
    setPdfPdts(pdts);
  }, []);

  // --------------------
  const formatProductsForInventories = (products: Product[]) => {
    let invs: any[] = [];
    for (const pdt of products) {
      const inv: any = { designation: pdt.designation };
      let lots: any[] = [];
      for (const pdtIn of pdt.ins) {
        const lot = pdtIn.lot;
        lots.push(lot);
      }
      lots = [...new Set(lots)]; //remove duplicates

      inv.lots = lots;
      invs.push(inv);
    }
    return invs;
  };

  const onGenPdfLoc = (action: string) => {
    pdfService.generatePdf(
      action,
      CpaDefinition.generic("Liste des produits emplacement", PdfProductTables.productLocTable(products as Product[]))
    );
  };

  const onGenPdfInventaire = (action: string, products: Product[]) => {
    const pdfProducts = formatProductsForInventories(products);

    pdfService.generatePdf(
      // action, CpaDefinition.generic('Fiche d\' inventaire produits', PdfProductTables.productInventoryWithLotTable(pdfProducts), 'landscape'));
      action,
      CpaDefinition.generic("Fiche d' inventaire produits", PdfProductTables.productInventoryWithLotTable(pdfPdts), "landscape")
    );
  };

  const onGenPdfInventaireAll = (action: string) => {
    httpService.get("products/inventoryall").then(({ data }) => {
      pdfService.generatePdf(
        action,
        CpaDefinition.generic("Fiche d' inventaire produits", PdfProductTables.productInventoryTable(data), "landscape")
      );
    });
  };
  // ------ handles ------
  const handleIsActive = async (tob) => {
    const nTob: Product = lodash.cloneDeep(tob);
    nTob.stores[0].isActive = !nTob.stores[0].isActive;
    // --------------------
    const oldTobs: any[] = queryClient.getQueryData(["products"]);
    queryClient.setQueriesData(["products"], (tobs: any[]) => hlpCrud.updateTobOnList(nTob, tobs));
    try {
      await httpService.postId(tob.stores[0].id, "productstores/isActive");
      Toastify.success();
    } catch (error) {
      queryClient.setQueryData<any[]>(["products"], (tobs: any[]) => (tobs = oldTobs));
      Toastify.error();
    }
  };

  const handleIsAvailable = async (tob: Product) => {
    const nTob: Product = lodash.cloneDeep(tob);
    nTob.stores[0].isAvailable = !nTob.stores[0].isAvailable;
    // --------------------
    const oldTobs: any[] = queryClient.getQueryData(["products"]);
    queryClient.setQueriesData(["products"], (tobs: any[]) => hlpCrud.updateTobOnList(nTob, tobs));
    try {
      await httpService.postId(tob.stores[0].id, "productstores/isAvailable");
      Toastify.success();
    } catch (error) {
      queryClient.setQueryData<any[]>(["products"], (tobs: any[]) => (tobs = oldTobs));
      Toastify.error();
    }
  };

  const handleIsPublished = async (tob: Product) => {
    const nTob: Product = lodash.cloneDeep(tob);
    nTob.stores[0].isPublished = !nTob.stores[0].isPublished;
    // --------------------
    const oldTobs: any[] = queryClient.getQueryData(["products"]);
    queryClient.setQueriesData(["products"], (tobs: any[]) => hlpCrud.updateTobOnList(nTob, tobs));
    try {
      await httpService.postId(tob.stores[0].id, "productstores/isPublished");
      Toastify.success();
    } catch (error) {
      queryClient.setQueryData<any[]>(["products"], (tobs: any[]) => (tobs = oldTobs));
      Toastify.error();
    }
  };

  const handleDelete = (tob) => {
    delProduct.mutate(tob);
  };

  const handleEdit = (tob) => {
    setModal(true);
    setTob(tob);
  };

  const handleSubmit = async (tobValues) => {
    if (tobValues) {
      setModal(false);
      setTob(null);
    }

    // tobValues.id ? editProduct.mutate(tobValues) : addProduct.mutate(tobValues);
    /* try {
      const { data } = tobValues.id
        ? await httpService.putBody(tobValues.id, tobValues, "products/edit")
        : await httpService.postBody(tobValues, "products");
      if (data) {
        queryClient.invalidateQueries(["products"]);
        Toastify.success();
      }
    } catch (error) {} */
  };
  // --------------------

  const cancelForm = () => {
    setModal(false);
    setTob(null);
  };

  // --------------------

  const columns: ReactTableColumnType[] = useMemo(
    () => [
      {
        header: "ref",
        accessorKey: "ref",
        style: { width: "4%", textAlign: "center" },
        // className: ({ row }) => getColor(row.original),
        // style: { backgroundColor: "red" },
      },
      // { header: "ref", accessorKey: "ref",  style: { width: "4%", textAlign: "center" } },
      {
        header: "designation",
        accessorKey: "designation",
        cell: ({ row }) => {
          return <LinkCardProduct product={row.original}> {row.original.designation}</LinkCardProduct>;
        },

        style: { width: "10%", textAlign: "center" },
      },
      {
        header: () => colToolTip("pght", "prix pght"),
        accessorKey: "pght",
        cell: ({ row }) => <span>{row.original.stores[0].pghtPrice}</span>,
        meta: { style: { width: "7%", textAlign: "center" } },
      },
      {
        header: () => colToolTip("pc", "prix de cession"),
        accessorKey: "pc",
        cell: ({ row }) => <span>{row.original.stores[0].salePrice}</span>,
        style: { width: "7%", textAlign: "center" },
      },

      {
        header: () => colToolTip("pp", "prix public"),
        accessorKey: "pp",
        cell: ({ row }) => <span>{publicPrice(row.original)}</span>,
        style: { width: "7%", textAlign: "center" },
      },
      {
        header: () => colToolTip("s.m", "stock magasin"),
        accessorKey: "store",
        cell: ({ row }) => <span>{StockPipe.transform(row.original, "store")}</span>,
        style: { width: "7%", textAlign: "center" },
      },
      {
        header: () => colToolTip("s.t", "stock total"),
        accessorKey: "all",
        cell: ({ row }) => {
          const tob: Product = row.original;

          return <span>{StockPipe.transform(tob, "all")}</span>;
        },
        style: { width: "7%", textAlign: "center" },
      },
      { header: "cat", accessorFn: (row) => row.cat.name },
      { header: "format", accessorFn: (row) => row.sof.name },
      { header: "qtc", accessorKey: "qtityPerPackaging", style: { width: "7%", textAlign: "center" } },
      { header: "agence", accessorFn: (row) => row.agcy?.ste?.name },
      // { header: "fornisseur", accessorKey: "pvd.ste.name" },
      { header: "fornisseur", accessorFn: (row) => row.pvd?.ste?.name },
      {
        header: () => colToolTip(<i className="fas fa-check-double"></i>, "active"),
        accessorKey: "stores[0].isActive",

        // accessorFn: (row) => row.stores[0].isActive,
        cell: ({ row }) => <BtnToggle check={row.original.stores[0].isActive} onToggle={() => handleIsActive(row.original)}></BtnToggle>,
      },
      {
        header: () => colToolTip(<i className="fas fa-thumbs-up"></i>, "disponibilité"),
        accessorKey: "stores[0].isAvailable",
        // accessorFn: (row) => row.stores[0].isAvailable,
        cell: ({ row }) => (
          <BtnToggle theme="thumbs" check={row.original.stores[0].isAvailable} onToggle={() => handleIsAvailable(row.original)}></BtnToggle>
        ),
      },
      /*  {
        ...ColToggle({
          header: () => colToolTip(<i className="fas fa-bullhorn"></i>, "publié"),
          accessorKey: "stores[0].isPublished",
          handleToggle: handleIsPublished,
          theme: "bullhorn",
        }),
      }, */

      {
        header: () => colToolTip(<i className="fas fa-bullhorn"></i>, "publié"),
        accessorKey: "stores[0].isPublished",
        cell: ({ row }) => (
          <BtnToggle
            theme="bullhorn"
            check={row.original.stores[0].isPublished}
            onToggle={() => handleIsPublished(row.original)}></BtnToggle>
        ),
      },
      { ...ColEditDel({ handleDelete, handleEdit }) },
    ],
    [handleDelete]
  );

  const onDrop = (id) => {
    switch (id) {
      case 1:
        pdfService.generatePdf(
          "print",
          // CpaDefinition.generic("Liste des produits", PdfProductTables.productWithAllColsTable(this.filteredProducts), "landscape")
          CpaDefinition.generic("Liste des produits", PdfProductTables.productWithAllColsTable(products as Product[]), "landscape")
        );
        break;
      case 2:
        onGenPdfLoc("open");
        break;
      case 3:
        onGenPdfInventaire("print", products as Product[]);
        break;
      case 4:
        onGenPdfInventaireAll("print");
        break;
    }
  };

  const dropMenu: DropMenuType = {
    drops: [
      { id: 1, label: "tous" },
      { id: 2, label: "loc" },
      { id: 3, label: "fiche inventaire" },
      { id: 4, label: "fiche inventaire complète" },
    ],
    label: "actions",
  };

  const onGenPdf = (action: string) => {
    pdfService.generatePdf(
      // action, DocDefinition.generic('Liste des produits', PdfProductTables.productTable(this.filteredProducts)));
      action,
      CpaDefinition.generic("Liste des produits", PdfProductTables.productTable(products), "landscape")
    );
  };

  const onGenExcel = (event: any) => {
    excelService.exportAsExcelFileByTableId("products", "products");
  };

  return (
    <>
      <TskTable
        tableId="products"
        headTitle={"produits"}
        lDropMenu={{ dropMenu, onDrop, auth: authService.getAuth({ roles: PHD }) }}
        onAdd={() => setModal(true)}
        onGenExcel={onGenExcel}
        onGenPdf={onGenPdf}
        columns={columns}
        data={products}
        loading={isLoading}
      />
      <ModalBase
        title={tob ? "Modifier" : "Ajout"}
        icon={"fas fa-pen"}
        size="lg"
        show={modal}
        onCloseModal={() => {
          setModal(false);
          setTob(null);
        }}
        content={<AdditProduct tob={tob} onSubmitForm={handleSubmit} onCancelForm={cancelForm} />}
      />
    </>
  );
};

export default ListProduct;
