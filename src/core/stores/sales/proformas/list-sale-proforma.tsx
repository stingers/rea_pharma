import { BtnAction, BtnDownloads, colToolTip, ModalConfirm, ReactTableColumnType, TskTable } from "asv-hlps-react";
import { User } from "asv-hlps/lib/cjs/models";
import { currencyFormatterCfa, dateFormatter, sesStorageSet } from "asv-hlps/lib/cjs/utils";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import httpService from "../../../../services/httpService";
import pdfService from "../../../../services/pdfService";
import hlpCrud from "../../../../shared/helpers/hlpCrud";
import LinkTob from "../../../../shared/links/link-tob";
import { InvoiceDefinition } from "../../../bills/pdfs/invoices/InvoiceDefinition";
import { PdfBillTables } from "../../../bills/pdfs/PdfBillTables";
import LinkUserCard from "../../../users/cards/link-user-card";
import hlpShop from "../../shops/hlpShop";
import { useShopCartContext } from "../../shops/shop-cart-context";
import DetailSale from "../detail-sale";
import PipeSale from "./../helpers/pipeSale";

const ListSaleProforma = () => {
  const [tobs, setTobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tob, setTob] = useState(null);
  const [modal, setModal] = useState(false);
  const [modalConvert, setModalConvert] = useState(false);
  const navigate = useNavigate();
  const { cartItems, setClient } = useShopCartContext();

  // --------------------
  const fetchTobs = async () => {
    const { data: tobs } = await httpService.get("sales/proformas");
    setLoading(false);
    setTobs(tobs);
  };
  useEffect(() => {
    fetchTobs();
    // }, [dates]);
  }, []);
  // --------------------

  const handleDelete = async () => {
    const nTobs = tobs.filter((x) => x.id !== tob.id);
    setTobs(nTobs);
    setModal(false);
    const err = await hlpCrud.persistDelete(tob, "sales/delProForma", tobs);
    if (err) {
      setTobs(tobs);
    }
    setTob(null);
  };

  const onGenProforma = ({ action, tob: sale }) => {
    pdfService.generatePdf(action, InvoiceDefinition.invoice(sale, PdfBillTables.invoiceProformaTable(sale.saleProducts)));
  };

  const onBtn = ({ id, tob }) => {
    switch (id) {
      case 1:
        setTob(tob);
        setModalConvert(true);
        break;
      case 2:
        setTob(tob);
        setModal(true);
        // handleDelete(tob);
        break;
    }
  };

  const onConvertToSale = () => {
    setModalConvert(false);
    setClient(tob.client);
    httpService.postId(tob.id, "sales/delproforma").then(({ data }) => {
      // let cartItems: CartItem[] = [];
      console.log(tob);
      for (const item of tob.saleProducts) {
        cartItems.push({ product: item.product, qtityOdr: item.qtityOdr });
      }

      sesStorageSet("basket", cartItems);
      hlpShop.convertToSale(cartItems, tob);
      setTob(null);
      navigate("/dash/shopcart");
    });
  };

  const columns: ReactTableColumnType[] = useMemo(
    () => [
      {
        header: "créé le",
        accessorKey: "createdAt",
        cell: ({ row }) => <span>{dateFormatter(row.original.createdAt, "dmy", "/")}</span>,

        style: { width: "7%", textAlign: "center" },
      },
      {
        header: "reference",
        accessorKey: "ref",
        cell: ({ row }) => {
          const tob = row.original;
          return (
            <>
              <LinkTob tob={tob} size={"lg"} content={<DetailSale tob={tob} />}>
                {`PRO-${tob.ref}`}
              </LinkTob>
              <BtnDownloads tob={tob} onGenPdf={onGenProforma} />
            </>
          );
        },
      },
      {
        header: "client",
        accessorKey: "client.username",
        cell: ({ row }) => {
          const client: User = row.original.client;
          return <LinkUserCard user={client} userProp={client.username} />;
        },
        style: { width: "7%", textAlign: "center" },
      },
      {
        header: "société",
        accessorKey: "client.ste.name",
        cell: ({ row }) => {
          const client: User = row.original.client;
          return client.grp?.code !== "sf" ? client?.ste?.name : client.fullname;
        },
      },
      {
        header: "montant",
        accessorKey: "amount",
        cell: ({ row }) => {
          return <span className="fw-bold">{currencyFormatterCfa(PipeSale.totalSale(row.original, "amountAllIncluded"))}</span>;
        },
      },

      {
        header: "actions",
        accessorKey: "actions",
        cell: ({ row }) => (
          <BtnAction
            className={"btn-xs"}
            btns={[
              {
                id: 1,
                label: colToolTip(<i className="fas fa-clone"></i>, "convertir en commande"),
              },
              {
                id: 2,
                label: colToolTip(<i className="fas fa-trash"></i>, "supprimer la proforma"),
                variant: "danger",
              },
            ]}
            onBtn={onBtn}
            tob={row.original}
          />
        ),
      },

      // { ...ColDel({ handleDelete }) },

      /* {
      header: () => <i className="fas fa-cogs"></i>,
      accessorKey: "actions",
      cell: ({ row }) => <BtnDel tob={row.original} onDelete={handleDelete} />,
      style: { width: "3%", textAlign: "center" },
    }, */
    ],
    [handleDelete]
  );

  return (
    <>
      <TskTable
        headTitle={"proformas"}
        // onSelectedDate={onSelectedDates}
        columns={columns}
        data={tobs}
        loading={loading}
      />
      <ModalConfirm
        title={`confirmer de la suppression du proforma n° PRO-${tob?.ref}`}
        show={modal}
        onApprove={handleDelete}
        onCloseModal={() => setModal(false)}
      />
      <ModalConfirm
        // title={`confirmer de la suppression du proforma n° PRO-${tob?.ref}`}
        show={modalConvert}
        onApprove={onConvertToSale}
        onCloseModal={() => setModalConvert(false)}
        content={"Etes-vous sûr de vouloir réaliser cette action? l'ancien Proforma sera détruit"}
      />
    </>
  );
};

export default ListSaleProforma;
