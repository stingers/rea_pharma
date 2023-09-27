import { yupResolver } from "@hookform/resolvers/yup";
import { BtnSubmit } from "asv-hlps-react";
import dayjs from "dayjs";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import { FormErrors } from "../../../shared/forms/FormErrors";
import FormField from "../../../shared/forms/input-form-h";

type TobType = {
  // tob?: Spent;
  tob?: any;
  onSubmitForm?: (values) => any;
  onCancelForm?: (value) => any;
};
/* type FormType = {
  description: string;
  via: string;
  amount: number;
  spentDate?: string;
}; */

const schema = yup.object({
  description: yup.string().required(),
  amount: yup.number().required(FormErrors.REQUIRED).positive().integer().typeError(FormErrors.DIGIT),
  via: yup.string().required(),
  spentDate: yup.string(),
});

type FormType = yup.InferType<typeof schema>;

const formatForm = (tob) => {
  if (tob.spentDate) {
    tob.spentDate = dayjs(tob.spentDate).format("YYYY-MM-DD");
  }

  return tob;
};

const AdditSpent = ({ tob, onCancelForm, onSubmitForm }: TobType) => {
  const {
    handleSubmit,
    register,
    control,
    formState: { errors, isValid },
    reset,
  } = useForm<FormType>({
    defaultValues: tob ? formatForm(tob) : {},
    resolver: yupResolver<any>(schema),
    mode: "onChange",
  });

  const formSubmit = (data) => {
    onSubmitForm(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(formSubmit)} className="px-2 text-uppercase fs-6">
      <FormField label="date" name="spentDate" type="date" register={register} errors={errors} control={control} requiredStar={false} />
      <FormField label="description" name="description" register={register} errors={errors} control={control} />
      <FormField label="montant" name="amount" register={register} errors={errors} control={control} />
      <FormField label="via" name="via" register={register} errors={errors} control={control} />

      <hr className="my-1" />
      <div className="text-end mt-2  ">
        <BtnSubmit disabled={!isValid} size="sm" onCancel={onCancelForm} />
      </div>
    </form>
  );
};

export default AdditSpent;
