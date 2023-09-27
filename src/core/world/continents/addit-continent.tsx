import { yupResolver } from "@hookform/resolvers/yup";
import { Continent } from "asv-hlps";
import BtnSubmit from "asv-hlps-react/lib/cjs/reacts/minton/btns/BtnSubmit";
import axios from "axios";
import React from "react";
import { Col, Form, Modal, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import { FormInput } from "../../../auth/form";
import { FormPropsType } from "../../../shared/models/FormProps";

const AdditContinent: React.FC<FormPropsType<Continent>> = ({ tob, onSubmitForm, onCancelForm }) => {
  const schema: yup.ObjectSchema<any> = yup.object({
    name: yup
      .string()
      .required()
      .test("Check_name", "This name is already taken", (value) => {
        return new Promise(async (resolve) => {
          const { data: res } = await axios.post("genders/checkUniqueName", { id: tob?.id, name: value });
          res ? resolve(true) : resolve(false);
        });
      }),
    abr: yup
      .string()
      .min(2)
      .max(4)
      .required()
      .test("Check_name", "This code is already taken", (value) => {
        return new Promise(async (resolve) => {
          const { data: res } = await axios.post("genders/checkUniqueAbr", { id: tob?.id, name: value });
          res ? resolve(true) : resolve(false);
        });
      }),
    avatar: yup.string(),
    // shortname: yup.string().required(),
  });

  type FormType = yup.InferType<typeof schema>;

  const {
    handleSubmit,
    register,
    control,
    reset,
    formState: { errors, isValid },
  } = useForm<FormType>({
    defaultValues: tob ? tob : {},
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
          <BtnSubmit disabled={!isValid} onCancel={handleCancel}></BtnSubmit>
        </Modal.Footer>
      </form>
    </React.Fragment>
  );
};

export default AdditContinent;
