import { yupResolver } from "@hookform/resolvers/yup";
import { BtnSubmit, FormField, FormPropsType } from "asv-hlps-react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import hlpForm from "../../../../shared/forms/hlpForm";

export default function AdditUserGrp({ url, tob, onCancelForm, onSubmitForm }: FormPropsType<any>) {
  const schemaN = hlpForm.schemaNaCoSh(url, tob, 2);
  const schema = schemaN.shape({
    coef: yup.number().positive().optional().nullable(),
  });

  type FormType = yup.InferType<typeof schema>;

  const {
    handleSubmit,
    register,
    control,
    formState: { errors, isValid },
    reset,
  } = useForm<FormType>({
    defaultValues: tob ? tob : {},
    resolver: yupResolver<any>(schema),
    mode: "onChange",
  });

  const formSubmit = (data) => {
    onSubmitForm(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(formSubmit)} className="px-2 text-uppercase fs-6">
      <FormField label="nom" name="name" register={register} errors={errors} control={control} />
      <FormField label="code" name="code" register={register} errors={errors} control={control} />
      <FormField label="abr" name="shortname" register={register} errors={errors} control={control} />
      <FormField label="coef" name="coef" register={register} errors={errors} control={control} requiredStar={false} />
      <hr className="my-1" />
      <div className="text-end mt-2  ">
        <BtnSubmit disabled={!isValid} size="sm" onCancel={onCancelForm} />
      </div>
    </form>
  );
}
