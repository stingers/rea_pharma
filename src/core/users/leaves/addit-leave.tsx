import { yupResolver } from "@hookform/resolvers/yup";
import { BtnSubmit, FormField, FormFieldReactSelect } from "asv-hlps-react";
import { useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import { FormErrors } from "../../../shared/forms/FormErrors";
import hlpForm from "../../../shared/forms/hlpForm";

interface LeaveForm {
  id?: number;
  name: string;
  // typeId: number;
  fromDate: Date;
  toDate: Date;
  motif: string;
  staffId?: number;
}

const schema = yup.object({
  // typeId: yup.number().required(FormErrors.REQUIRED),
  name: yup.string().required(FormErrors.REQUIRED),
  fromDate: yup.string().required(FormErrors.REQUIRED),
  toDate: yup.string().required(FormErrors.REQUIRED),
  motif: yup.string().required(FormErrors.REQUIRED),
  staffId: hlpForm.yupNoRequiredNumber(),
});

const options = [
  { id: "congé", name: "Congé" },
  { id: "permission", name: "Permission" },
];

const AdditLeave = ({ tob, onSubmitForm, onCancelForm }) => {
  const [selectedType, setSelectedType] = useState(null);

  const {
    handleSubmit,
    register,
    control,
    formState: { errors, isValid },
    setValue,
    reset,
  } = useForm<LeaveForm>({
    defaultValues: tob ? tob : {},
    resolver: yupResolver<any>(schema),
    mode: "onChange",
  });
  // --------------------
  const formSubmit = (values) => {
    onSubmitForm(values);
  };
  // --------------------
  return (
    <form onSubmit={handleSubmit(formSubmit)} className="px-2 text-uppercase fs-6">
      <Row>
        <Col>
          <FormFieldReactSelect
            // vertical
            noLabel
            label={""}
            onChange={(tob) => {
              setValue("name", tob.id);
              setSelectedType(tob);
            }}
            options={options}
            selected={selectedType}
            // valueProp="name"

            name="name"
            errors={errors}
            control={control}
          />
        </Col>
      </Row>

      <Row>
        <Col className="mb-2">
          <FormField
            type="textarea"
            name={"motif"}
            placeholder={"motif de la demande"}
            control={control}
            errors={errors}
            label="motif"
            register={register}
            noLabel
          />
        </Col>
      </Row>

      <Row>
        <Col md={6} className="mb-2">
          <FormField
            type="date"
            name={"fromDate"}
            control={control}
            errors={errors}
            label="date de début"
            register={register}
            noLabel
            vertical
          />
        </Col>
        <Col md={6} className="mb-2">
          <FormField
            name={"toDate"}
            type={"date"}
            // placeholder={"code postal"}
            control={control}
            errors={errors}
            label="date de fin"
            register={register}
            noLabel
            vertical
          />
        </Col>
      </Row>

      <hr className="my-1" />
      <div className="text-end mt-2  ">
        <BtnSubmit disabled={!isValid} size="sm" onCancel={onCancelForm} />
      </div>
    </form>
  );
};

export default AdditLeave;
