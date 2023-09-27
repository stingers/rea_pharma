import { yupResolver } from "@hookform/resolvers/yup";
import { AdditModalFormProps, BtnSubmit, FormField, FormFieldReactSelect } from "asv-hlps-react";
import dayjs from "dayjs";
import { useState } from "react";
import { Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import hlpForm from "../../../shared/forms/hlpForm";

const AdditTask = ({ tob, onSubmitForm, onCancelForm }: AdditModalFormProps) => {
  const [selectedPrio, setSelectedPrio] = useState();

  const formatForm = (tob) => {
    if (tob.endDate) {
      tob.endDate = dayjs(tob.spentDate).format("YYYY-MM-DD");
    }

    return tob;
  };
  const schema = yup.object({
    // id: yup.number(),
    title: hlpForm.yupRequiredString(),
    endDate: hlpForm.yupRequiredString(),
    priority: hlpForm.yupRequiredString(),
    // assignUserId: hlpForm.yupRequiredNumber(),
  });

  const options = [
    { id: "high", name: "high" },
    { id: "medium", name: "medium" },
    { id: "low", name: "low" },
  ];

  type FormType = yup.InferType<typeof schema>;

  const {
    handleSubmit,
    register,
    control,
    formState: { errors, isValid },
    setValue,
    reset,
    watch,
  } = useForm<FormType>({
    defaultValues: tob ? formatForm(tob) : {},
    resolver: yupResolver<any>(schema),
    mode: "onChange",
  });

  const formSubmit = (obj) => {
    onSubmitForm(obj);
  };

  return (
    <form onSubmit={handleSubmit(formSubmit)} className="px-2 text-uppercase fs-6">
      <Row>
        <FormField type="textarea" name={"title"} control={control} errors={errors} label="titre" register={register} />
      </Row>
      <Row>
        <FormField type="date" name={"endDate"} control={control} errors={errors} label="date de fin" register={register} />
      </Row>
      <Row>
        <FormFieldReactSelect
          label={"priorité"}
          onChange={(tob) => {
            setValue("priority", tob.id);
            setSelectedPrio(tob);
          }}
          options={options}
          selected={selectedPrio}
          name="priority"
          errors={errors}
          control={control}
          defaultValue={tob ? options.filter((x) => x.id === tob.priority) : null}
        />
      </Row>
      <div className="text-end mt-2  ">
        <BtnSubmit size="sm" onCancel={onCancelForm} disabled={!isValid} />
      </div>
    </form>
  );
};

export default AdditTask;
