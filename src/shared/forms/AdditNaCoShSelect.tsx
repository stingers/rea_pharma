import { yupResolver } from "@hookform/resolvers/yup";
import BtnSubmit from "asv-hlps-react/lib/cjs/reacts/minton/btns/BtnSubmit";
import React from "react";
import { Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import hlpForm from "./hlpForm";
import FormField from "./input-form-h";

type FormProps = {
  onSubmitForm?: (values) => any;
  // onSubmitForm?;
  onCancelForm?: (value) => any;
  type: "na" | "naco" | "nacosh";
  tob?: any;
  url: string;
  codeMaxLength?: number;
};

type formNaCoSh = { name: string; code?: string; shortname?: string };
let schema;

const AdditNaCoShSelect = ({ type, url, codeMaxLength, tob, onSubmitForm, onCancelForm }: FormProps) => {
  switch (type) {
    case "na":
      schema = hlpForm.schemaNa(url, tob);
      break;
    case "naco":
      schema = hlpForm.schemaNaCo(url, tob, codeMaxLength);
      break;
    case "nacosh":
      schema = hlpForm.schemaNaCoSh(url, tob, codeMaxLength);
      break;
    default:
      schema = hlpForm.schemaNa(url, tob);
      break;
  }

  const finalSchema = schema.shape({
    selectId: yup.number().required(),
  });

  /* const methods = useForm<formNaCoSh>({
    defaultValues: tob ? tob : {},
    resolver: schema,
    mode: "onChange",
  });

  const {
    handleSubmit,
    register,
    control,
    formState: { errors, isValid },
  } = methods; */
  const {
    handleSubmit,
    register,
    control,
    formState: { errors, isValid },
    reset,
  } = useForm<formNaCoSh>({
    defaultValues: tob ? tob : {},
    resolver: yupResolver<any>(schema),
    mode: "onChange",
  });

  const onSubmit = (data) => {
    onSubmitForm(data);
    reset();
  };

  const handleCancel = (props) => {
    onCancelForm(false);
    reset();
  };

  const renderInput = (label, name, placeholder?) => {
    return <FormField label={label} name={name} placeholder={placeholder} register={register} errors={errors} control={control} />;
  };

  return (
    <React.Fragment>
      <form onSubmit={handleSubmit(onSubmit)} className="px-2">
        <Modal.Body>
          {type === "na" && <>{renderInput("nom", "name")}</>}

          {type === "naco" && (
            <>
              {renderInput("nom", "name")}
              {renderInput("code", "code")}
            </>
          )}

          {type === "nacosh" && (
            <>
              {renderInput("nom", "name")}
              {renderInput("code", "code")}
              {renderInput("Shortname", "shortname")}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <BtnSubmit disabled={!isValid} onCancel={handleCancel}></BtnSubmit>
        </Modal.Footer>
      </form>
    </React.Fragment>
  );
};

export default AdditNaCoShSelect;
