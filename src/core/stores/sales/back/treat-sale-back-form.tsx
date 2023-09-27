import { yupResolver } from "@hookform/resolvers/yup";
import { BtnSubmit, FormErrors, FormField, FormFieldReactSelect } from "asv-hlps-react";
import { useEffect, useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import hlpForm from "../../../../shared/forms/hlpForm";
import { IIdName } from "../../../../shared/models/IIdName";

type AdditModalFormProps = {
  tob?;
  onCancelForm;
  onSubmitForm: (value: any) => void;
};

const TreatSaleBackForm = ({ tob, onSubmitForm, onCancelForm }: AdditModalFormProps) => {
  const [selected, setSelected] = useState(null);
  const schema = yup.object({
    choiceId: hlpForm.yupRequiredNumber(),
    reason: yup.string().when("choiceId", {
      is: 2,
      then: () => yup.string().required(FormErrors.REQUIRED),
      otherwise: () => yup.string().notRequired(),
    }),
    backChoice: yup.string().when("choiceId", {
      is: 1,
      then: () => yup.string().required(FormErrors.REQUIRED),
      otherwise: () => yup.string().notRequired(),
    }),
  });

  type FormType = yup.InferType<typeof schema>;

  const {
    handleSubmit,
    register,
    control,
    formState: { errors, isValid },
    reset,
    setValue,
    watch,
  } = useForm<FormType>({
    defaultValues: {},
    // defaultValues: tob ? tob : {},
    resolver: yupResolver<any>(schema),
    mode: "onChange",
  });

  const choices: IIdName[] = [
    { id: 1, name: "Accepter" },
    { id: 2, name: "Refuser" },
  ];

  const checkChoice = watch("choiceId");

  useEffect(() => {
    if (checkChoice === 1) {
      setValue("reason", "");
    }
    if (checkChoice === 2) {
      setValue("backChoice", null);
    }
  }, [checkChoice]);

  const handleCancel = () => {
    reset();
  };

  const formSubmit = (obj) => {
    onSubmitForm(obj);
    reset();
  };
  return (
    <form onSubmit={handleSubmit(formSubmit)}>
      <FormFieldReactSelect
        label={"option"}
        onChange={(tob) => {
          setValue("choiceId", +tob?.id);
          setSelected(tob);
        }}
        options={choices}
        selected={selected}
        name="choiceId"
        errors={errors}
        control={control}
        className={"text-uppercase mb-2"}
      />
      {selected?.id === 1 && (
        <Form.Group as={Row} className="mb-2 text-uppercase">
          <Col sm={3}>choix</Col>
          <Col>
            <Form.Check type="radio" name="backChoice" value={"1"} label="Echanger/Remplacer les produits" {...register("backChoice")} />
            <Form.Check type="radio" name="backChoice" value={"2"} label="Créer un avoir" {...register("backChoice")} />
          </Col>
        </Form.Group>
      )}

      {selected?.id === 2 && (
        <Row>
          <Col className="mb-2 text-uppercase">
            <FormField
              type="textarea"
              name={"reason"}
              placeholder={"motif du refus"}
              control={control}
              errors={errors}
              label="motif"
              register={register}
            />
          </Col>
        </Row>
      )}
      <BtnSubmit disabled={!isValid} onCancel={handleCancel} />
    </form>
  );
};

export default TreatSaleBackForm;
