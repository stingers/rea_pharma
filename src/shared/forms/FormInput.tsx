import { InputHTMLAttributes } from "react";
import { Form, InputGroup } from "react-bootstrap";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  startIcon?: any;
  label?: any;
  type?: string;
  as?: any;
  name: string;
  comp?: string;
  placeholder?: string;
  register?: any;
  // errors?: FieldErrors<any>;
  errors?: any;
  errorBorder?: boolean;
  // control?: Control<any>;
  control?: any;
  className?: string;
  labelClassName?: string;
  containerClass?: string;
  textClassName?: string;
  refCallback?: any;
  action?: any;
  rows?: string | number;
  value?;
}

// textual form-controls—like inputs, passwords, textareas etc.
const TextualInput = ({
  type,
  name,
  placeholder,
  register,
  errors,
  errorBorder = false,
  comp,
  rows,
  className,
  refCallback,
  ...otherProps
}: FormInputProps) => {
  return (
    <>
      <Form.Control
        type={type}
        placeholder={placeholder}
        name={name}
        as={comp}
        id={name}
        ref={(r: HTMLInputElement) => {
          if (refCallback) refCallback(r);
        }}
        className={className}
        isInvalid={errorBorder && errors && errors[name] ? true : false}
        {...(register ? register(name) : {})}
        rows={rows}
        {...otherProps}></Form.Control>

      {errors && errors[name] ? (
        <Form.Control.Feedback type="invalid" className="d-block">
          {errors[name]["message"]}
        </Form.Control.Feedback>
      ) : null}
    </>
  );
};

// non-textual checkbox and radio controls
const CheckInput = ({
  type,
  label,
  name,
  placeholder,
  register,
  errors,
  comp,
  rows,
  className,
  errorBorder = false,
  refCallback,
  ...otherProps
}: FormInputProps) => {
  return (
    <>
      <Form.Check
        type={type}
        label={label}
        name={name}
        id={name}
        ref={(r: HTMLInputElement) => {
          if (refCallback) refCallback(r);
        }}
        className={className}
        isInvalid={errorBorder && errors && errors[name] ? true : false}
        {...(register ? register(name) : {})}
        {...otherProps}
      />

      {errors && errors[name] ? <Form.Control.Feedback type="invalid">{errors[name]["message"]}</Form.Control.Feedback> : null}
    </>
  );
};

// handle select controls
const SelectInput = ({
  type,
  label,
  name,
  placeholder,
  register,
  errors,
  comp,
  rows,
  className,
  errorBorder = false,
  refCallback,
  ...otherProps
}: FormInputProps) => {
  return (
    <>
      <Form.Select
        type={type}
        label={label}
        name={name}
        id={name}
        ref={(r: HTMLInputElement) => {
          if (refCallback) refCallback(r);
        }}
        className={className}
        isInvalid={errorBorder && errors && errors[name] ? true : false}
        {...(register ? register(name) : {})}
        {...otherProps}
      />

      {errors && errors[name] ? <Form.Control.Feedback type="invalid">{errors[name]["message"]}</Form.Control.Feedback> : null}
    </>
  );
};

// extend textual form-controls with add-ons
export const FormInputGroup = ({
  label,
  startIcon,
  type,
  name,
  placeholder,
  comp,
  register,
  errors,
  rows,
  className,
  textClassName,
  refCallback,
  ...otherProps
}: FormInputProps) => {
  return (
    <InputGroup>
      <InputGroup.Text className={textClassName}>{startIcon || label}</InputGroup.Text>
      {type === "select" ? (
        <SelectInput
          type={type}
          name={name}
          placeholder={placeholder}
          refCallback={refCallback}
          comp={comp}
          errors={errors}
          register={register}
          className={className}
          rows={rows}
          {...otherProps}
        />
      ) : (
        <TextualInput
          type={type}
          name={name}
          placeholder={placeholder}
          refCallback={refCallback}
          comp={comp}
          errors={errors}
          register={register}
          className={className}
          rows={rows}
          {...otherProps}
        />
      )}
    </InputGroup>
  );
};

const FormInput = ({
  startIcon,
  label,
  type,
  name,
  as,
  placeholder,
  register,
  errors,
  control,
  className,
  labelClassName,
  containerClass,
  textClassName,
  refCallback,
  action,
  rows,
  ...otherProps
}: FormInputProps) => {
  // handle input type
  const comp = type === "textarea" ? "textarea" : type === "select" ? "select" : "input";

  const renderInput = () => {
    switch (type) {
      case "hidden":
        return <input type={type} name={name} {...(register ? register(name) : {})} {...otherProps} />;
      case "checkbox":
      case "radio":
        return (
          <Form.Group className={containerClass}>
            <CheckInput
              type={type}
              label={label}
              name={name}
              placeholder={placeholder}
              refCallback={refCallback}
              errors={errors}
              register={register}
              comp={comp}
              className={className}
              rows={rows}
              {...otherProps}
            />
          </Form.Group>
        );
      case "select":
        return (
          <Form.Group as={as} className={containerClass}>
            {label ? (
              <>
                <Form.Label className={labelClassName}>{label}</Form.Label>
                {action && action}
              </>
            ) : null}
            {startIcon ? (
              <FormInputGroup
                type={type}
                startIcon={startIcon}
                name={name}
                comp={comp}
                textClassName={textClassName}
                placeholder={placeholder}
                refCallback={refCallback}
                errors={errors}
                register={register}
                className={className}
                rows={rows}
                {...otherProps}
              />
            ) : (
              <SelectInput
                type={type}
                name={name}
                placeholder={placeholder}
                refCallback={refCallback}
                errors={errors}
                register={register}
                comp={comp}
                className={className}
                rows={rows}
                {...otherProps}
              />
            )}
          </Form.Group>
        );

      default:
        return (
          <Form.Group className={containerClass}>
            {label ? (
              <>
                <Form.Label className={labelClassName}>{label}</Form.Label>
                {action && action}
              </>
            ) : null}
            {startIcon ? (
              <FormInputGroup
                type={type}
                startIcon={startIcon}
                name={name}
                comp={comp}
                textClassName={textClassName}
                placeholder={placeholder}
                refCallback={refCallback}
                errors={errors}
                register={register}
                className={className}
                rows={rows}
                {...otherProps}
              />
            ) : (
              <TextualInput
                type={type}
                name={name}
                placeholder={placeholder}
                refCallback={refCallback}
                errors={errors}
                register={register}
                comp={comp}
                className={className}
                rows={rows}
                {...otherProps}
              />
            )}
          </Form.Group>
        );
    }
  };

  return <>{renderInput()}</>;
};

export default FormInput;
