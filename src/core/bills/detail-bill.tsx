import { Bill, Sale, currencyFormatter, dateFormatter, getTotalAmountAllIncludedOnBill, getTotalAmountOnSale } from "asv-hlps";
import { ReactTableColumnType, TskTable } from "asv-hlps-react";
import { ModalBase } from "asv-hlps-react/lib/cjs/reacts/minton/modals";
import { useEffect, useState } from "react";

import { ADM } from "../../auth/services/auth-menu";
import authService from "../../auth/services/authService";
import httpService from "../../services/httpService";
import DetailSale from "../stores/sales/detail-sale";

type TobType = {
  bill: Bill;
};

const DetailBill = ({ bill }: TobType) => {
  const [tobs, setTobs] = useState<Sale[]>([]);
  const [sale, setSale] = useState<Sale>();
  const [modal, setModal] = useState(false);
  const [filtereds, setFiltereds] = useState([]);
  const getDatas = async () => {
    const { data: sales } = await httpService.getByParam(bill.id, `bills/sales`);
    setTobs(sales);
  };

  const columns: ReactTableColumnType[] = [
    {
      header: "ref",
      accessorKey: "ref",
      cell: ({ row }) => {
        const sale: Sale = row.original;

        return (
          <span className="cursor-pointer" onClick={() => detailSale(sale)}>
            {sale.ref}
          </span>
        );
      },
    },
    {
      header: "date d'emission",
      accessorKey: "saleDate",
      cell: ({ row }) => <span>{dateFormatter(row.original.saleDate, "dmy", "/")}</span>,
    },
    {
      header: "montant",
      accessorKey: "amount",
      cell: ({ row }) => {
        const sale: Sale = row.original;
        return (
          <span className="fw-bolder">
            <b>{currencyFormatter(getTotalAmountOnSale(sale, true), " ")}</b>
          </span>
        );
      },
    },
  ];

  const addTrs = (
    <>
      <tr className="text-uppercase fw-bold">
        <td colSpan={3}>
          <span>Montant Total</span>
        </td>
        <td>{currencyFormatter(getTotalAmountAllIncludedOnBill(filtereds), " ")}</td>
      </tr>
    </>
  );

  const detailSale = (tob) => {
    setSale(tob);
    setModal(true);
  };
  // --------------------
  useEffect(() => {
    getDatas();
  }, []);
  return (
    <>
      <TskTable
        pullTrs={addTrs}
        columns={columns}
        data={tobs}
        loading={false}
        pushTrs={addTrs}
        noHeader
        initialState={{
          columnVisibility: {
            actions: authService.getAuth({ roles: [...ADM] }),
            del: authService.getAuth({ roles: [...ADM] }),
          },
        }}
        getRows={(rows) => setFiltereds(rows.map((row) => row.original))}
      />
      {/* <ModalBase title={tob?.ref} show={showModal} onCloseModal={() => setModal(false)} content={<DetailSale tob={tob} />} /> */}
      <ModalBase
        footer={false}
        size="lg"
        // fullscreen={"xxl-down"}
        // dialogClassName={"modal-right"}
        title={sale?.ref}
        show={modal}
        onCloseModal={() => setModal(false)}
        content={<DetailSale tob={sale} />}
      />
    </>
  );
};

export default DetailBill;
