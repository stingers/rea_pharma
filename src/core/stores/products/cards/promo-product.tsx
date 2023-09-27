import { Product, dateFormatter } from "asv-hlps";
import { ColEditDel, ColToggle, ModalBase, ReactTableColumnType, TskTable } from "asv-hlps-react";
import DisplayTooltip from "asv-hlps-react/lib/cjs/reacts/displays/display-tooltip";
import useTobCrud from "asv-hlps-react/lib/cjs/reacts/hooks/uses/useTobCrud";
import classNames from "classnames";
import { useMemo } from "react";

import httpService from "../../../../services/httpService";
import AdditProductPromo from "../promos/addit-product-promo";

type TobType = {
  product: Product;
};
const PromoProduct = ({ product }: TobType) => {
  const { onAdd, modal, tob, closeModal, handleSubmit, cancelForm, tobs, loading, handleRefresh, handleDelete, handleToggle, handleEdit } =
    useTobCrud({
      httpService,
      url: "productpromos/product",
      getByParam: product.id,
      urlToogle: "productpromos",
      urlDel: "productpromos/del",
      options: { otherUrl: "productpromos/new" },
    });

  const columns: ReactTableColumnType[] = useMemo(
    () => [
      {
        header: "Début",
        accessorKey: "startDate",
        cell: ({ row }) => dateFormatter(row.original.startDate),
      },
      {
        header: "Fin",
        accessorKey: "endDate",
        cell: ({ row }) => dateFormatter(row.original.endDate),
      },
      {
        header: () => (
          <DisplayTooltip content={"quanité achetée"}>
            <span>Q.A</span>
          </DisplayTooltip>
        ),
        accessorKey: "qtityPromo",
      },
      {
        header: () => (
          <DisplayTooltip content={"quanité promo"}>
            <span>Q.P</span>
          </DisplayTooltip>
        ),
        accessorKey: "qtityFree",
      },
      { ...ColToggle({ header: "active ", accessorKey: "isActive", handleToggle, style: { width: "5%", textAlign: "center" } }) },
      { ...ColEditDel({ handleDelete, handleEdit }) },
    ],
    [handleDelete]
  );
  return (
    <>
      {/* <ListPromoProduct tob={product} /> */}
      <TskTable onAdd={onAdd} loading={loading} columns={columns} data={tobs} />;
      <ModalBase
        className={classNames("bg-light")}
        dialogClassName={"modal-dialog-centered"}
        title={!tob ? "ajout" : "modifier"}
        icon={"fas fa-pen"}
        show={modal}
        onCloseModal={closeModal}
        content={<AdditProductPromo productId={product.id} tob={tob} onSubmitForm={handleSubmit} onCancelForm={cancelForm} />}
      />
    </>
  );
};

export default PromoProduct;
