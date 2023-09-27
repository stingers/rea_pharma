import { yupResolver } from "@hookform/resolvers/yup";
import { Sale, SaleProduct } from "asv-hlps";
import { BtnSubmit, FormField, ModalBase, ReactTableColumnType, TskTable, colToolTip } from "asv-hlps-react";
import { useMemo, useState } from "react";
import { Badge, Col, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import hlpForm from "../../../shared/forms/hlpForm";
import hlpCrud from "../../../shared/helpers/hlpCrud";
import InfoSale from "./info-sale";
import ValidedSaleProductLot from "./valided-sale-product-lot";

type TobProps = {
  sale: Sale;
  onSaleValided;
  onCancelForm;
};
const ValidedSaleProduct = ({ sale, onSaleValided, onCancelForm }: TobProps) => {
  const schema = yup.object({
    nbPack: hlpForm.yupRequiredNumber(),
    nbFreeze: hlpForm.yupNoRequiredNumber(),
  });

  type FormType = yup.InferType<typeof schema>;

  const {
    handleSubmit,
    register,
    control,
    formState: { errors, isValid },
    reset,
    watch,
  } = useForm<FormType>({
    // defaultValues: tob ? tob : {},
    defaultValues: {},
    resolver: yupResolver<any>(schema),
    mode: "onChange",
  });

  const [tobs, setTobs] = useState(sale.saleProducts);
  const [sp, setSp] = useState(null);
  const [modal, setModal] = useState(false);

  const onValidedSaleProduct = (sp) => {
    setSp(sp);
    setModal(true);
  };

  const onValidedLot = (sp) => {
    setModal(false);
    const nTobs = hlpCrud.updateTobOnList(sp, tobs);
    setTobs(nTobs);
  };

  const getBgColor = (sp: SaleProduct) => {
    if (sp.qtityFund === 0) {
      return "danger";
    }

    if (sp.qtityFund === sp.qtityOdr + sp.qtityFree) {
      return "success";
    }

    if (sp.qtityFund < sp.qtityOdr + sp.qtityFree) {
      return "warning";
    }
  };

  const formSubmit = (obj) => {
    const nTob: Sale = { ...sale, saleProducts: tobs, nbFreeze: obj.nbFreeze, nbPackages: obj.nbPack };
    onSaleValided(nTob);
    /* sale.saleProducts = tobs;
    sale.nbFreeze  = obj.nbFreeze;
    sale.nbPackages = obj.nbPack */
    // onSaleValided(sale)
  };

  const columns: ReactTableColumnType[] = useMemo(
    () => [
      {
        header: "ref",
        accessorKey: "product.ref",
      },
      {
        header: "designation",
        accessorKey: "product.designation",
      },
      {
        header: "emplacement",
        accessorKey: "product.loc.name",
        style: { width: "10%" },
      },
      {
        header: "lot",
        accessorKey: "lot",
      },
      {
        header: () => colToolTip("Q.C", "quantité commandée"),
        accessorKey: "qtityOdr",
      },
      {
        header: () => colToolTip("U.G", "unité gratuite"),
        accessorKey: "qtityFree",
      },
      {
        header: () => colToolTip("Q.T.D", "quantité total à delivrer"),
        accessorKey: "ctd",
        cell: ({ row }) => {
          const tob: SaleProduct = row.original;
          return tob.qtityOdr + tob.qtityFree;
        },
      },
      {
        header: () => colToolTip("Q.D", "quantité delivrée"),
        accessorKey: "cd",
        cell: ({ row }) => {
          const sp: SaleProduct = row.original;
          return (
            <>
              <span onClick={() => onValidedSaleProduct(sp)}>
                <Badge className={`p-1 bg-${getBgColor(sp)}`}>{sp.qtityFund}</Badge>
              </span>

              {/* <input
                className="form-control form-control-sm   text-center"
                onClick={() => onValidedSaleProduct(sp)}
                readOnly
                value={sp.qtityFund}
                // value={40}
                // defaultValue={0}
              /> */}
            </>
          );
        },
      },
    ],
    []
  );
  return (
    <>
      <InfoSale sale={sale} />

      <TskTable
        // loading={loading}
        columns={columns}
        data={tobs}
        noHeader={true}
      />
      <form onSubmit={handleSubmit(formSubmit)} className="px-2 text-uppercase fs-6">
        <Row>
          <Col md={6} className="mb-2">
            <FormField name={"nbPack"} control={control} errors={errors} label="nbre de colis" register={register} />
          </Col>
          <Col md={6} className="mb-2">
            <FormField name={"nbFreeze"} control={control} errors={errors} label="nbre de froid" register={register} />
          </Col>
        </Row>
        <hr className="my-1" />
        <div className="text-end mt-2  ">
          <BtnSubmit size="sm" onCancel={onCancelForm} disabled={!isValid} />
          {/* <BtnSubmit size="sm" onCancel={() => setModal(false)} disabled={isValid} /> */}
        </div>
      </form>
      <ModalBase
        icon="fas fa-pen"
        onCloseModal={() => setModal(false)}
        show={modal}
        title={sp?.product?.designation}
        content={<ValidedSaleProductLot sp={sp} onValidedLot={onValidedLot} />}
        // dialogClassName="modal-dialog-centered"
        className={"bg-light"}
      />
    </>
  );
};

export default ValidedSaleProduct;
