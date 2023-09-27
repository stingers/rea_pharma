import { yupResolver } from "@hookform/resolvers/yup";
import { BtnSubmit, FormField } from "asv-hlps-react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import hlpForm from "../../shared/forms/hlpForm";
import InputFormCreateList from "../../shared/forms/input-form-create-list";

const options = [
  { id: 1, name: "bobo" },
  { id: 2, name: "coco" },
];

const schema = yup.object({
  master: hlpForm.yupRequiredNumber(),
  slaves: yup.array().required().min(1).nonNullable(),
});

type FormType = yup.InferType<typeof schema>;

const components = {
  DropdownIndicator: null,
};

const AdditBillConcat = () => {
  const {
    handleSubmit,
    register,
    control,
    formState: { errors, isValid },
    watch,
    setValue,
    reset,
  } = useForm<FormType>({
    defaultValues: {},
    resolver: yupResolver<any>(schema),
    mode: "onChange",
  });

  interface Option {
    readonly label: string;
    readonly value: string;
  }

  const createOption = (label: string) => ({
    label,
    value: label,
  });

  const formSubmit = (values) => {};

  return (
    <form onSubmit={handleSubmit(formSubmit)} className="px-2 text-uppercase fs-6">
      <InputFormCreateList
        name={"slaves"}
        control={control}
        label={"slaves"}
        options={[]}
        selected={undefined}
        onChange={(value) => setValue("slaves", value)}
        errors={undefined}
      />
      <FormField name={"master"} control={control} errors={errors} label="Target" register={register} />

      <div className="text-end mt-2  ">
        {/* <BtnSubmit size="sm" onCancel={undefined} disabled={!isValid} /> */}
        <BtnSubmit size="sm" onCancel={undefined} disabled={isValid} />
      </div>
    </form>
  );
};

export default AdditBillConcat;
