import { yupResolver } from "@hookform/resolvers/yup";
import { BtnSubmit, FormField, FormFieldReactSelect, Toastify, useReadonlyFetchTobs } from "asv-hlps-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import httpService from "../../../../services/httpService";
import hlpForm from "../../../../shared/forms/hlpForm";

const AdditProductTransfert = ({ tob, onCancelForm, onSubmitForm }) => {
  let { tobs: depots } = useReadonlyFetchTobs(httpService, "productdepots");
  depots = depots.filter((x) => x.name.toLocaleLowerCase() !== tob.depot.toLocaleLowerCase());
  const [selectedDepot, setSelectedDepot] = useState(null);
  const [checkQtity, setCheckQtity] = useState(true);

  const schema = yup.object({
    depotId: hlpForm.yupRequiredNumber(),
    qtity: hlpForm.yupRequiredNumber(),
    // qtity: yup.number().required(FormErrors.REQUIRED).typeError(FormErrors.DIGIT),
  });

  type FormType = yup.InferType<typeof schema>;

  const {
    handleSubmit,
    register,
    control,
    formState: { errors, isValid },
    reset,
    setValue,
    watch,
  } = useForm<FormType>({
    defaultValues: {},
    resolver: yupResolver<any>(schema),
    mode: "onChange",
  });

  const formSubmit = (data) => {
    data.depot = selectedDepot;
    onSubmitForm(data);
    reset();
  };
  /* const watchQity = watch("qtity");
  if (+watchQity > tob.qtities) {
    Toastify.error();
  } */
  const qityChange = (ev) => {
    ev.preventDefault();
    const qtityIn = +ev.currentTarget.value;
    if (qtityIn > +tob.qtities) {
      setCheckQtity(false);
      Toastify.error("la quantité entrée supérieur à la quantité disponible");
      setValue("qtity", null);
    }
  };

  return (
    <form onSubmit={handleSubmit(formSubmit)} className="px-2 text-uppercase fs-6">
      <FormFieldReactSelect
        label={"depot"}
        onChange={(tob) => {
          setValue("depotId", +tob.id);
          setSelectedDepot(tob);
        }}
        options={depots}
        selected={selectedDepot}
        name="depotId"
        errors={errors}
        control={control}
      />
      <FormField label="quantité" name="qtity" onChange={(e) => qityChange(e)} register={register} errors={errors} control={control} />

      <div className="text-end mt-2  ">
        <BtnSubmit disabled={!isValid && checkQtity} size="sm" onCancel={onCancelForm} />
      </div>
    </form>
  );
};

export default AdditProductTransfert;
