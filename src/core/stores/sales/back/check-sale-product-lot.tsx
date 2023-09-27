import { yupResolver } from "@hookform/resolvers/yup";
import { dateFormatter, reduceSum, SaleProduct, SaleProductLot } from "asv-hlps";
import { BtnSubmit, colToolTip, ModalConfirm, useReadonlyFetchTobs } from "asv-hlps-react";
import { FormFieldReactSelect } from "asv-hlps-react/lib/cjs/reacts/forms";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import httpService from "../../../../services/httpService";
import hlpForm from "../../../../shared/forms/hlpForm";

type TobType = {
  sp: SaleProduct;
  onValidedLot: (sp: SaleProduct) => void;
};
const CheckSaleProductLot = ({ sp, onValidedLot }: TobType) => {
  const { tobs: reasons } = useReadonlyFetchTobs(httpService, "product-out-reasons/back");

  const [lots, setLots] = useState<SaleProductLot[]>(sp.lots);
  const [totalBack, setTotalBack] = useState<number>(0);
  const [modalConfirm, setModalConfirm] = useState(false);
  const [selected, setSelected] = useState(null);
  const refQtiyBack = useRef();
  // ------ hook form ------
  const schema = yup.object({
    reasonId: hlpForm.yupRequiredNumber(),
  });
  type FormType = yup.InferType<typeof schema>;
  const {
    handleSubmit,
    register,
    control,
    formState: { errors, isValid },
    reset,
    setValue,
  } = useForm<FormType>({
    // defaultValues: tob ? tob : {},
    defaultValues: {},
    resolver: yupResolver<any>(schema),
    mode: "onChange",
  });

  // --------------------

  const onGetQtityLotBack = (data) => {
    const index = lots.findIndex((x) => x.id === data.lot.id);
    // --------------------
    const qtityBack = data.refQtiyBack.current.value;
    if (qtityBack > lots[index].qtityOut) {
      setModalConfirm(true);
      data.refQtiyBack.current.value = 0;
    } else {
      lots[index].qtityBack = +qtityBack;
      setTotalBack(reduceSum(lots, "qtityBack"));
    }
  };

  /* const onSelected = (selected) => {
    console.log(selected);
  }; */

  const formSubmit = (values) => {
    // e.preventDefault();
    setTotalBack(reduceSum(lots, "qtityBack"));

    const nSp = { ...sp, lots, qtityBack: totalBack, backReason: values.reasonId };
    onValidedLot(nSp);
    // console.log(e.currentTarget.value);
  };
  return (
    <>
      <form onSubmit={handleSubmit(formSubmit)}>
        <FormFieldReactSelect
          label={"raison"}
          onChange={(tob) => {
            setValue("reasonId", +tob.id);
            setSelected(tob);
          }}
          options={reasons}
          selected={selected}
          name="reasonId"
          errors={errors}
          control={control}
          className={"text-uppercase mb-2"}
        />
        {/* <BtnReactSelect className={"fs-6 p-0 m0"} tob={sp} options={reasons} onSelectedOption={onSelected} minWidth={200} maxWidth={200} /> */}
        <div className="table-responsive">
          <table className="table table-bordered table-striped table-sm">
            <thead>
              <tr className="mb-0 mt-0">
                <th scope="col">#</th>
                <th scope="col">lot</th>
                <th scope="col">{colToolTip("Exp", "Date de péremption")}</th>
                <th scope="col">{colToolTip("Q.L", "Quantité livrée")} </th>
                <th scope="col">{colToolTip("Q.A.R", "Quantité à retournée")} </th>
              </tr>
            </thead>
            <tbody>
              {React.Children.toArray(
                lots.map((lot, index) => (
                  <tr>
                    <td>{index + 1}</td>
                    <td>{lot.lot}</td>
                    <td>{dateFormatter(lot.lotExp)}</td>
                    <td>{lot.qtityOut}</td>
                    <td width={"20%"}>
                      <input
                        ref={refQtiyBack}
                        onChange={() => onGetQtityLotBack({ lot, refQtiyBack })}
                        type="text"
                        className="form-control form-control-sm text-center"
                        name="lot.qtityBack"
                        aria-label="Small"
                        aria-describedby="inputGroup-sizing-sm"
                        // defaultValue={lot.qtityOut}
                        defaultValue={0}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <BtnSubmit disabled={!isValid || totalBack <= 0} />
        </div>
      </form>
      <ModalConfirm
        title={"impossible s'effectuer cette action"}
        show={modalConfirm}
        onCloseModal={() => setModalConfirm(false)}
        onApprove={() => setModalConfirm(false)}
        approveLabel={"ok"}
        content={`<b>Quantité retour supérieur à la quantité livrée</b>`}
      />
    </>
  );
};

export default CheckSaleProductLot;
