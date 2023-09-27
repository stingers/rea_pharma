import { yupResolver } from "@hookform/resolvers/yup";
import { FormFieldReactSelect } from "asv-hlps-react";
import BtnSubmit from "asv-hlps-react/lib/cjs/reacts/minton/btns/BtnSubmit";
import { ReactNode, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import { FormErrors } from "./FormErrors";
import FormField from "./input-form-h";

type TobType = {
  // onSubmitForm?: (values) => any;
  onSubmitForm?: (data) => void;
  onCancelForm?;
  schema?: "str" | "nbr" | "select" | "strSelect" | "nbrSelect";
  type?: "text" | "number" | "date" | "textarea";
  tob?: any;
  label: string;
  labelProp?: string;
  valueProp?: string;
  options?: any[];
  requiredStar?: boolean;
  labelColSize?: number;
  formatLabel?: any;
  labelSelect?;
  formatOptionLabel?;
  msg?: ReactNode;

  onSelected?: (tob) => void;

  // name: string;
};

type FormStrNbr = { str?: string; digit?: number; selectedId?: string };
const schemaStr = yup.object({
  str: yup.string().required(FormErrors.REQUIRED),
});
const schemaStrSelect = yup.object({
  str: yup.string().required(FormErrors.REQUIRED),
  selectedId: yup.string().required(FormErrors.REQUIRED),
});

const schemaNbrSelect = yup.object({
  nbr: yup.number().required(FormErrors.REQUIRED).typeError(FormErrors.DIGIT),
  selectedId: yup.string().required(FormErrors.REQUIRED),
});
const schemaDigit = yup.object({
  nbr: yup.number().required(FormErrors.REQUIRED).typeError(FormErrors.DIGIT),
});
const schemaReactSelect = yup.object({
  // selectedId: yup.number().required(FormErrors.REQUIRED),
  selectedId: yup.string().required(FormErrors.REQUIRED),
});

const AdditStrNbrSelect = ({
  type = "text",
  schema = "str",
  msg,
  tob,
  label,
  onSubmitForm,
  labelColSize,
  onCancelForm,
  labelProp = "name",
  valueProp = "id",
  options,
  formatLabel,
  onSelected,
  labelSelect,
  formatOptionLabel,
}: TobType) => {
  let schemaType;
  switch (schema) {
    case "str":
      schemaType = schemaStr;
      break;
    case "nbr":
      schemaType = schemaDigit;
      break;
    case "nbrSelect":
      schemaType = schemaNbrSelect;
      break;
    case "strSelect":
      schemaType = schemaStrSelect;
      break;
    case "select":
      schemaType = schemaReactSelect;
      break;
    default:
      schemaType = schemaStr;
      break;
  }
  // --------------------
  const [selected, setSelected] = useState(null);

  const {
    handleSubmit,
    register,
    control,
    setValue,
    formState: { errors, isValid },
    reset,
    watch,
  } = useForm<FormStrNbr>({
    defaultValues: tob ? tob : {},
    resolver: yupResolver<any>(schemaType),
    mode: "onChange",
  });

  const onSubmit = (data) => {
    switch (schema) {
      case "select":
        onSubmitForm(selected);
        setValue("selectedId", null);
        setSelected(null);
        break;
      case "nbrSelect":
      case "strSelect":
        onSubmitForm({ selected, data });
        setValue("selectedId", null);
        setSelected(null);
        break;
      default:
        onSubmitForm(data);
        break;
    }

    reset();
  };

  const renderInput = (label, name: string, placeholder?) => {
    return (
      <FormField
        type={type ? type : "text"}
        label={label}
        name={name}
        placeholder={placeholder}
        register={register}
        errors={errors}
        control={control}
      />
    );
  };

  const renderInputSelect = (label, name: string, labelSelect?, placeholder?) => {
    return (
      <>
        <Row className="mb-2">
          <Col>
            <FormFieldReactSelect
              label={labelSelect}
              onChange={(tob) => {
                setValue("selectedId", tob[valueProp]);
                setSelected(tob);
              }}
              options={options}
              selected={selected}
              name="selectedId"
              errors={errors}
              control={control}
              formatLabel={formatLabel}
              formatOptionLabel={formatOptionLabel}
            />
          </Col>
        </Row>
        <FormField
          type={type ? type : "text"}
          label={label}
          name={name}
          placeholder={placeholder}
          register={register}
          errors={errors}
          control={control}
        />
      </>
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="px-2 text-uppercase fs-6">
      {msg}
      {schema === "str" && <>{renderInput(label, "str")}</>}
      {schema === "nbr" && <>{renderInput(label, "nbr")}</>}
      {schema === "select" && (
        <Row className="mb-2 ">
          {/* {label && (
            <Form.Label column sm={labelColSize ? labelColSize : 3}>
              {label}
              {requiredStar && <span className="text-danger"> *</span>}
            </Form.Label>
          )} */}
          <Col>
            <FormFieldReactSelect
              label={label}
              onChange={(tob) => {
                setValue("selectedId", tob[valueProp]);
                setSelected(tob);
              }}
              options={options}
              selected={selected}
              name="selectedId"
              errors={errors}
              control={control}
            />
            {/* <Controller
              render={({ field }) => (
                <Select
                  className="text-uppercase"
                  options={options}
                  styles={{ menu: (base) => ({ ...base, minWidth: 250 }) }}
                  menuPosition={"fixed"}
                  // getOptionLabel={(opt) => (formatLabel(opt) ? formatLabel(opt) : `${opt[labelProp]}`)}
                  getOptionLabel={(opt) => (formatLabel ? formatLabel(opt) : `${opt[labelProp]}`)}
                  getOptionValue={(opt) => `${opt[valueProp]}`}
                  // value={selected ? options.find((obj) => obj.value === selected) : null}
                  onChange={(tob) => {
                    console.log("------ tob ------");
                    console.log();
                    console.log(tob);

                    console.log("------ tob ------");
                    setValue("selectedId", tob[valueProp]);
                    setSelected(tob);
                  }}
                />
              )}
              name={"selectedId"}
              control={control}
              // {...register("tobId")}
            />
            {errors && errors.selectedId ? <Form.Text className="text-danger">{errors.selectedId["message"]}</Form.Text> : null} */}
          </Col>
        </Row>
      )}
      {schema === "nbrSelect" && <>{renderInputSelect(label, "nbr", labelSelect)}</>}
      {schema === "strSelect" && <>{renderInputSelect(label, "str", labelSelect)}</>}
      <BtnSubmit disabled={!isValid} onCancel={onCancelForm} />
      {/* <BtnSubmit disabled={isValid} onCancel={onCancelForm} /> */}
    </form>
  );
};

export default AdditStrNbrSelect;
