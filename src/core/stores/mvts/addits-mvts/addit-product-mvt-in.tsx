import { yupResolver } from "@hookform/resolvers/yup";
import { BtnSubmit, FormFieldReactSelect } from "asv-hlps-react";
import { ProductMvt } from "asv-hlps/lib/cjs/models/entities/products/ProductMvt";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import httpService from "../../../../services/httpService";
import hlpForm from "../../../../shared/forms/hlpForm";
import FormField from "../../../../shared/forms/input-form-h";
import useReadonlyFetchTobs from "../../../../shared/hooks/useReadonlyFetchTobs";

type AdditModalFormType = {
  tob?: ProductMvt;
  onSubmit;
  onCancelForm;
};

type FormType = {
  id?: number;
  billNumber: string;
  billPaidStatus: string;
  costs?: number;
  currencyId: number;
  dollarRate?: number;
  pvdId: number;
};

const AdditProductMvtIn = ({ tob, onSubmit, onCancelForm }: AdditModalFormType) => {
  const { tobs: currencies } = useReadonlyFetchTobs(httpService, "currencies");
  const { tobs: pvds } = useReadonlyFetchTobs(httpService, "users/pvds/menu");
  const [selectedCurrency, setSelectedCurrency] = useState();
  const [selectedPvd, setSelectedPvd] = useState();
  const [selectedStatus, setSelectedStatus] = useState();
  const status = [
    { id: "nopaid", name: "impayée" },
    { id: "paid", name: "payée" },
    { id: "partielpaid", name: "payment partiel" },
    { id: "notApplicale", name: "non applicable" },
  ];

  const schema = yup.object({
    billNumber: hlpForm.yupRequiredString(),
    billPaidStatus: hlpForm.yupRequiredString(),
    costs: hlpForm.yupNoRequiredNumber(),
    currencyId: hlpForm.yupRequiredNumber(),
    pvdId: hlpForm.yupRequiredNumber(),
    dollarRate: yup
      .number()
      .when("currencyId", {
        is: (val) => val === 2,
        then: () => hlpForm.yupRequiredNumber(),
        /* otherwise: () =>
        yup
          .number()
          .optional()
          // .transform((value) => (isNaN(value) ? undefined : value))
          .nullable(), */
      })
      .nullable(),
    // published: yup.number().required(),
  });

  const {
    handleSubmit,
    register,
    control,
    formState: { errors, isValid, isSubmitting },
    setValue,
    reset,
    watch,
  } = useForm<FormType>({
    defaultValues: tob ? tob : {},
    resolver: yupResolver<any>(schema),
    mode: "onChange",
  });

  useEffect(() => {
    if (tob) {
      setValue("currencyId", tob.currency.id);
      setValue("pvdId", tob.pvd.id);
    }
  }, []);

  const watchCurrency = watch("currencyId");
  if (watchCurrency && watchCurrency !== 2) {
    setValue("dollarRate", null);
  }

  const formSubmit = (values) => {
    onSubmit(values);
    reset();
  };
  // const onCancelForm = () => {};

  return (
    <form onSubmit={handleSubmit(formSubmit)} className="px-2 text-uppercase fs-6">
      <FormField
        name={"billNumber"}
        control={control}
        errors={errors}
        label="n° Facture"
        register={register}
        // noLabel
      />
      <FormFieldReactSelect
        label={"devise"}
        onChange={(tob) => {
          setValue("currencyId", +tob.id);
          setSelectedCurrency(tob);
        }}
        options={currencies}
        selected={selectedCurrency}
        name="currencyId"
        errors={errors}
        control={control}
        defaultValue={tob ? tob.currency : null}
      />
      {watchCurrency === 2 && (
        <FormField
          name={"dollarRate"}
          control={control}
          errors={errors}
          label="cours du dollar"
          register={register}
          // noLabel
        />
      )}
      <FormFieldReactSelect
        label={"fournisseur"}
        onChange={(tob) => {
          setValue("pvdId", +tob.id);
          setSelectedPvd(tob);
        }}
        options={pvds}
        selected={selectedPvd}
        name="pvdId"
        errors={errors}
        control={control}
        defaultValue={tob ? tob.pvd : null}
      />
      {/* </Col> */}
      {/* <Col md={3} className="mb-2"> */}
      <FormField
        name={"costs"}
        control={control}
        errors={errors}
        label="charges"
        register={register}
        requiredStar={false}
        // noLabel
      />
      <FormFieldReactSelect
        label={"status"}
        onChange={(tob) => {
          setValue("billPaidStatus", tob.name);
          setSelectedStatus(tob);
        }}
        options={status}
        selected={selectedStatus}
        name="billPaidStatus"
        errors={errors}
        control={control}
        defaultValue={tob ? status.filter((s) => s.name === tob.billPaidStatus) : null}
      />

      <hr className="my-1" />
      <div className="text-end mt-2">
        {/* <BtnSubmit disabled={isValid} size="sm" onCancel={onCancelForm} /> */}
        <BtnSubmit disabled={!isValid} size="sm" onCancel={onCancelForm} />
      </div>
    </form>
  );
};

export default AdditProductMvtIn;
