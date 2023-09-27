import { Col, Form, Row } from "react-bootstrap";

import FormInput from "./FormInput";

export type InputTypes = {
  label?: string | any;
  name;
  register;
  errors;
  errorBorder?: boolean;
  control;
  placeholder?;
  requiredStar?: boolean;
  type?: string;
  labelColSize?: number;
  noLabel?: boolean;
  vertical?: boolean;
  readOnly?: boolean;
  value?;
};

const FormField = ({
  label,
  name,
  placeholder,
  type = "text",
  requiredStar = true,
  errorBorder = false,
  register,
  errors,
  control,
  labelColSize,
  noLabel = false,
  vertical = false,
  readOnly,
  value,
}: InputTypes) => {
  return (
    <Form.Group as={Row} className="mb-2">
      {!noLabel && (
        <Form.Label column sm={labelColSize ? labelColSize : 3}>
          {label}
          {requiredStar && <span className="text-danger"> *</span>}
        </Form.Label>
      )}

      <Col>
        {vertical && (
          <Form.Label htmlFor={name}>
            {label}
            {requiredStar && <span className="text-danger"> *</span>}
          </Form.Label>
        )}
        <FormInput
          value={value}
          errorBorder={errorBorder}
          type={type}
          name={name}
          placeholder={placeholder}
          register={register}
          key={name}
          errors={errors}
          control={control}
          readOnly={readOnly}
        />
      </Col>
    </Form.Group>
  );
};

export default FormField;
