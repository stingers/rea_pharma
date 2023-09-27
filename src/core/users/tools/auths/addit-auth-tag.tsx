import { yupResolver } from "@hookform/resolvers/yup";
import { AuthTag } from "asv-hlps";
import { BtnSubmit, FormFieldReactSelect } from "asv-hlps-react";
import useReadonlyFetchTobs from "asv-hlps-react/lib/cjs/reacts/hooks/uses/useReadonlyFetchTobs";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import httpService from "../../../../services/httpService";
import hlpForm from "../../../../shared/forms/hlpForm";
import FormField from "../../../../shared/forms/input-form-h";

type FormProps = {
  onSubmitForm?: (values) => any;
  onCancelForm?: (value) => any;
  tob?: AuthTag;
  // tob?: any;
};

const AdditAuthTag = ({ tob, onSubmitForm, onCancelForm }: FormProps) => {
  const { tobs: cats } = useReadonlyFetchTobs(httpService, "authtagcats");
  const [selectedCat, setSelectedCat] = useState(tob ? tob.cat.id : null);

  type FormType = { name: string; code: string; cat: number };

  const tobForm = (tob) => {
    return {
      id: tob.id || null,
      code: tob.code,
      cat: tob?.cat?.id || null,
      name: tob.name,
    };
  };

  const schema = hlpForm.schemaNaCo("authtags", tob, 8).shape({
    cat: yup.number().required(),
  });

  const {
    handleSubmit,
    register,
    control,
    formState: { errors, isValid },
    reset,
    setValue,
    watch,
  } = useForm<FormType>({
    defaultValues: tob ? tobForm(tob) : {},
    resolver: yupResolver<any>(schema),
    mode: "onChange",
  });

  const formSubmit = (data) => {
    onSubmitForm(data);
    reset();
  };

  const handleCancel = (props) => {
    onCancelForm(false);
    reset();
  };

  const handleSelectedCat = (cat) => {
    setValue("cat", +cat.id);
    setSelectedCat(+cat.id);
  };

  // --------------------
  return (
    <form onSubmit={handleSubmit(formSubmit)} className="px-2 text-uppercase fs-6">
      <FormFieldReactSelect
        label="catégorie"
        name={"cat"}
        options={cats}
        selected={selectedCat}
        onChange={handleSelectedCat}
        errors={errors}
        control={control}
        defaultValue={tob ? tob.cat : null}
      />
      <FormField labelColSize={3} label="nom" name="name" register={register} errors={errors} control={control} />
      <FormField label="code" name="code" register={register} errors={errors} control={control} />
      <hr className="my-1" />
      <div className="text-end mt-2  ">
        <BtnSubmit disabled={!isValid} size="sm" onCancel={handleCancel} />
      </div>
    </form>
  );
};

export default AdditAuthTag;
