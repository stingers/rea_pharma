import { yupResolver } from "@hookform/resolvers/yup";
import { BtnSubmit } from "asv-hlps-react";
import { Gender } from "asv-hlps/lib/cjs/models/entities/users/Gender";
import React from "react";
import { Col, Form, Modal, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import FormInput from "../../../../shared/forms/FormInput";
import hlpForm from "../../../../shared/forms/hlpForm";

type FormProps = {
  onSubmitForm?: (values) => any;
  onCancelForm?: (value) => any;
  tob?: Gender;
  // tob?: any;
};

const AdditGender = ({ tob, onSubmitForm, onCancelForm }: FormProps) => {
  const schema = yup.object({
    name: hlpForm.yupValideUniqName("genders/checkUniqueName", tob),
    abr: hlpForm.yupValideUniqCode("genders/checkUniqueAbr", 3, tob),
    avatar: yup.string(),
  });

  type FormType = yup.InferType<typeof schema>;
  const {
    handleSubmit,
    register,
    control,
    formState: { errors, isValid },
    reset,
  } = useForm<FormType>({
    defaultValues: tob ? tob : {},
    resolver: yupResolver<any>(schema),
    mode: "onChange",
  });

  const formSubmit = (data) => {
    onSubmitForm(data);
    reset();
  };

  /* const handleCancel = (props) => {
    onCancelForm(false);
    methods.reset();
  }; */

  return (
    <React.Fragment>
      <form onSubmit={handleSubmit(formSubmit)} className="px-2">
        <Modal.Body>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column md={3}>
              Nom<span className="text-danger">*</span>
            </Form.Label>
            <Col md={9}>
              <FormInput type="text" name="name" register={register} key="name" errors={errors} control={control} />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column md={3}>
              Abr <span className="text-danger">*</span>
            </Form.Label>
            <Col md={9}>
              <FormInput type="text" name="abr" register={register} key="abr" errors={errors} control={control} />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column md={3}>
              Avatar <span className="text-danger">*</span>
            </Form.Label>
            <Col md={9}>
              <FormInput type="text" name="avatar" register={register} key="avatar" errors={errors} control={control} />
            </Col>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <BtnSubmit disabled={!isValid} onCancel={onCancelForm}></BtnSubmit>
        </Modal.Footer>
      </form>
    </React.Fragment>
  );
};

export default AdditGender;
