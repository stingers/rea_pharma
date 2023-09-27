import { yupResolver } from "@hookform/resolvers/yup";
import { BtnSubmit, FormFieldReactSelect, useReadonlyFetchTobs } from "asv-hlps-react";
import dayjs from "dayjs";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import httpService from "../../../services/httpService";
import FormField from "../../../shared/forms/input-form-h";

type TobType = {
  // tob?: Spent;
  tob?: any;
  onSubmitForm?: (values) => any;
  onCancelForm?: (value) => any;
};
/* type FormType = {
  via: string;
  amount: number;
  spentDate?: string;
  bank: number
  bank: number
}; */

const schema = yup.object({
  // description: yup.string().required(),
  amount: yup.number().required().positive().integer(),
  bank: yup.number().required(), // bankId
  client: yup.number().required(), // clientId
  depositDate: yup.string(),
  checkNumber: yup.string().required(),
});

type FormType = yup.InferType<typeof schema>;

// const formatForm = (tob: Deposit) => {
const formatForm = (tob) => {
  return {
    id: tob.id,
    amount: tob.amount,
    bank: tob.bank.id,
    client: tob.client.id,
    depositDate: tob.depositDate ? dayjs(tob.depositDate).format("YYYY-MM-DD") : null,
    checkNumber: tob.checkNumber,
  };
};

const AdditDeposit = ({ tob, onCancelForm, onSubmitForm }: TobType) => {
  const { tobs: banks } = useReadonlyFetchTobs(httpService, "banks");
  const { tobs: clients } = useReadonlyFetchTobs(httpService, "users");
  const [selectedBankId, setSelectedBankId] = useState(tob ? tob.bank : null);
  const [selectedClientId, setSelectedClientId] = useState(tob ? tob.client : null);
  const {
    handleSubmit,
    register,
    control,
    formState: { errors, isValid },
    reset,
    setValue,
    watch,
  } = useForm<FormType>({
    defaultValues: tob ? formatForm(tob) : {},
    resolver: yupResolver<any>(schema),
    mode: "onChange",
  });

  const formSubmit = (data) => {
    /* data.bank = data.bankId;
    data.client = data.clientId; */
    onSubmitForm(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(formSubmit)} className="px-2 text-uppercase fs-6">
      <FormField label="date" name="depositDate" type="date" register={register} errors={errors} control={control} requiredStar={false} />
      {/* <FormField label="description" name="description" register={register} errors={errors} control={control} /> */}
      <FormField label="montant" name="amount" register={register} errors={errors} control={control} />
      <FormField label="n° cheq/virt" name="checkNumber" register={register} errors={errors} control={control} />
      <FormFieldReactSelect
        label={"banque"}
        onChange={(tob) => {
          setValue("bank", +tob.id);
          setSelectedBankId(tob.id);
        }}
        options={banks}
        selected={selectedBankId}
        name="bank"
        errors={errors}
        control={control}
        defaultValue={tob ? tob.bank : null}
      />
      <FormFieldReactSelect
        label={"client"}
        onChange={(tob) => {
          setValue("client", +tob.id);
          setSelectedClientId(tob.id);
        }}
        options={clients}
        selected={selectedClientId}
        name="client"
        errors={errors}
        control={control}
        labelProp={"username"}
        // formatLabel={() => (tob) => `${tob.username}`}
        formatOptionLabel={(tob) => `${tob.username} ( ${tob.grp.code !== "sf" ? tob.ste.name : tob.fullname})`}
        defaultValue={tob ? tob.client : null}
      />
      <hr className="my-1" />
      <div className="text-end mt-2  ">
        <BtnSubmit disabled={!isValid} size="sm" onCancel={onCancelForm} />
      </div>
    </form>
  );
};

export default AdditDeposit;
