import { yupResolver } from "@hookform/resolvers/yup";
import BtnSubmit from "asv-hlps-react/lib/cjs/reacts/minton/btns/BtnSubmit";
import React from "react";
import { Col, Form, Modal, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";

import FormInput from "../../auth/form/FormInput";
import hlpForm from "./hlpForm";

type FormProps = {
  // onSubmitForm?: (values) => any;
  onSubmitForm?;
  onCancelForm?: (value) => any;
  tob?: any;
  url: string;
};

type formNa = { name: string };

const AdditTpl: React.FC<FormProps> = ({ url, tob, onSubmitForm, onCancelForm }) => {
  const {
    handleSubmit,
    register,
    control,
    formState: { errors, isValid },
    reset,
  } = useForm<formNa>({
    defaultValues: tob ? tob : {},
    resolver: yupResolver<any>(hlpForm.schemaNaCo(url, tob)),
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
        </Modal.Body>
        <Modal.Footer>
          <BtnSubmit disabled={!isValid} onCancel={handleCancel}></BtnSubmit>
        </Modal.Footer>
      </form>
    </React.Fragment>
  );
};

export default AdditTpl;
