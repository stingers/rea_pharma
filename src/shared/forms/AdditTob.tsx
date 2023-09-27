import { yupResolver } from "@hookform/resolvers/yup";
import { BtnSubmit } from "asv-hlps-react";
import React from "react";
import { Col, Form, Modal, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import FormInput from "./FormInput";
import hlpForm from "./hlpForm";

type FormProps = {
  // onSubmitForm?: (values) => any;
  onSubmitForm?;
  onCancelForm?: (value) => any;
  tob?: any;
};

const AdditTob: React.FC<FormProps> = ({ tob, onSubmitForm, onCancelForm }) => {
  const methods = useForm<{ name; code; shortname }>({
    defaultValues: tob ? tob : {},
    resolver: yupResolver<any>(hlpForm.schemaNaCoSh("url", "tob")),
    mode: "onChange",
  });

  const {
    handleSubmit,
    register,
    control,
    formState: { errors, isValid },
  } = methods;

  const onSubmit = (data) => {
    onSubmitForm(data);
    methods.reset();
  };

  const handleCancel = (props) => {
    onCancelForm(false);
    methods.reset();
  };

  return (
    <React.Fragment>
      <form onSubmit={handleSubmit(onSubmit)} className="px-2">
        <Modal.Body>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column md={3}>
              Nom<span className="text-danger">*</span>
            </Form.Label>
            <Col md={9}>
              <FormInput type="text" name="name" placeholder="name" register={register} key="name" errors={errors} control={control} />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column md={3}>
              Code<span className="text-danger">*</span>
            </Form.Label>
            <Col md={9}>
              <FormInput type="text" name="code" placeholder="code" register={register} key="code" errors={errors} control={control} />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column md={3}>
              Shortname<span className="text-danger">*</span>
            </Form.Label>
            <Col md={9}>
              <FormInput
                type="text"
                name="shortname"
                placeholder="shortname"
                register={register}
                key="shortname"
                errors={errors}
                control={control}
              />
            </Col>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <BtnSubmit disabled={!isValid} onCancel={handleCancel}></BtnSubmit>
        </Modal.Footer>
      </form>
    </React.Fragment>
  );
};

export default AdditTob;
