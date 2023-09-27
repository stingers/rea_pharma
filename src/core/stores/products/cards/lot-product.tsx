import { Product, dateFormatter } from "asv-hlps";
import { ReactTableColumnType, TskTable } from "asv-hlps-react";
import DisplayTooltip from "asv-hlps-react/lib/cjs/reacts/displays/display-tooltip";
import { useMemo } from "react";

import hlpProduct from "../helpers/hlpProduct";

type TobType = {
  product: Product;
};
const LotProduct = ({ product }: TobType) => {
  /* const { onAdd, modal, tob, closeModal, handleSubmit, cancelForm, tobs, loading, handleRefresh, handleDelete, handleToggle, handleEdit } =
    useTobCrud({
      httpService,
      url: "productpromos/product",
      getByParam: product.id,
      urlToogle: "productpromos",
      urlDel: "productpromos/del",
      options: { otherUrl: "productpromos/new" },
    }); */

  const columns: ReactTableColumnType[] = useMemo(
    () => [
      {
        header: "N° du lot",
        accessorKey: "lot",
        // cell: ({ row }) => dateFormatter(row.original.startDate),
      },
      {
        header: () => (
          <DisplayTooltip content={"Date de péremption"}>
            <span>Exp</span>
          </DisplayTooltip>
        ),
        accessorKey: "expirationDate",
        cell: ({ row }) => dateFormatter(row.original.expirationDate),
      },
      {
        header: () => (
          <DisplayTooltip content={"Quantité"}>
            <span>Qtite</span>
          </DisplayTooltip>
        ),
        accessorKey: "qtity",
        // cell: ({ row }) => dateFormatter(row.original.expirationDate),
        //
      },
      {
        header: () => (
          <DisplayTooltip content={"Prix fournisseur"}>
            <span>P.F</span>
          </DisplayTooltip>
        ),
        accessorKey: "pvdPrice",
        // cell: ({ row }) => dateFormatter(row.original.expirationDate),
        //
      },
      {
        header: () => (
          <DisplayTooltip content={"Quantité par carton"}>
            <span>Qte/carton</span>
          </DisplayTooltip>
        ),
        accessorKey: "qtityPerPackaging",
        // cell: ({ row }) => dateFormatter(row.original.expirationDate),
        //
      },
      {
        header: "Répartition",
        accessorKey: "packAndUnit",
        cell: ({ row }) => {
          const io = row.original;
          return hlpProduct.packAndUnit(io?.qtity, +io?.qtityPerPackaging);
        },
      },
      {
        header: "Dépot",
        accessorKey: "depot.name",
      },
      // { ...ColToggle({ header: "active ", accessorKey: "isActive", handleToggle, style: { width: "5%", textAlign: "center" } }) },
      // { ...ColEditDel({ handleDelete, handleEdit }) },
    ],
    []
  );
  return (
    <>
      {/* <ListPromoProduct tob={product} /> */}
      <TskTable columns={columns} data={product.ins} />;
      {/* <TskTable onAdd={onAdd} loading={loading} columns={columns} data={product.ins}  />; */}
      {/* <ModalBase
        className={classNames("bg-light")}
        dialogClassName={"modal-dialog-centered"}
        title={!tob ? "ajout" : "modifier"}
        icon={"fas fa-pen"}
        show={modal}
        onCloseModal={closeModal}
        content={<AdditProductPromo productId={product.id} tob={tob} onSubmitForm={handleSubmit} onCancelForm={cancelForm} />}
      /> */}
    </>
  );
};

export default LotProduct;
