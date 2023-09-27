import { Product, dateFormatter } from "asv-hlps";
import { ReactTableColumnType, TskTable } from "asv-hlps-react";
import DisplayTooltip from "asv-hlps-react/lib/cjs/reacts/displays/display-tooltip";
import useTobCrud from "asv-hlps-react/lib/cjs/reacts/hooks/uses/useTobCrud";
import { useMemo } from "react";
import { Card } from "react-bootstrap";
import httpService from "../../../../services/httpService";
import DisplayWidget from "../../../../shared/displays/display-widget";
const InProduct = ({ product }: { product: Product }) => {
  const { tobs, loading, handleRefresh } = useTobCrud({ httpService, url: "productins/product", getByParam: product.id });
  const widgets = [
    { title: "stock", content: "" },
    { title: "nombre de lot", content: "" },
    { title: " depot", content: "" },
    { title: " montant total estimé", content: "" },
  ];
  const columns: ReactTableColumnType[] = useMemo(
    () => [
      {
        header: "date",
        accessorKey: "createdAt",

        cell: ({ row }) => dateFormatter(row.original.createdAt),
      },
      {
        header: "mvt N° Ref",
        accessorKey: "mvt.ref",
      },
      {
        header: () => (
          <DisplayTooltip content={"Quantités"}>
            <span>qtites</span>
          </DisplayTooltip>
        ),
        accessorKey: "qtity",
      },
      {
        header: () => (
          <DisplayTooltip content={"n° de lot"}>
            <span>n°lot</span>
          </DisplayTooltip>
        ),
        accessorKey: "lot",
      },
      {
        header: () => (
          <DisplayTooltip content={"Date d'expiration"}>
            <span>Date exp</span>
          </DisplayTooltip>
        ),
        accessorKey: "expirationDate",

        cell: ({ row }) => dateFormatter(row.original.expirationDate),
      },
      {
        header: "mvt N° Ref",
        accessorKey: "author.username",
      },
    ],
    []
  );
  return (
    <>
      <Card>
        <Card.Body className="py-0">
          <DisplayWidget widgets={widgets} />
        </Card.Body>
      </Card>
      <TskTable headTitle={"entrées"} loading={loading} columns={columns} data={tobs} />;
    </>
  );
};

export default InProduct;
