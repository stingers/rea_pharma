import httpService from "../../../../services/httpService";
import hlpForm from "../../../../shared/forms/hlpForm";
import { yupResolver } from "@hookform/resolvers/yup";
import { Bank } from "asv-hlps";
import { BtnSubmit, FormField, FormFieldReactSelect, useReadonlyFetchTobs } from "asv-hlps-react";
import { useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import * as yup from "yup";

interface FormType {
  id?: number;
  name: string;
  bankId: number;
}

export default function AdditAccount({ tob, onSubmitForm, onCancelForm }) {
  const { tobs: banks } = useReadonlyFetchTobs(httpService, "banks");
  const [selectedBank, setSelectedBank] = useState<Bank>(tob ? tob.bank : null);

  const schema = yup.object({
    name: hlpForm.yupValideUniqName("accounts/checkUniqueName", tob),
    bankId: yup.number().required(),
  });
  const {
    handleSubmit,
    register,
    control,
    formState: { errors, isValid },
    reset,
    setValue,
  } = useForm<FormType>({
    defaultValues: tob ? { id: tob.id, name: tob.name, bankId: tob.bank.id } : {},
    resolver: yupResolver<any>(schema),
    mode: "onChange",
  });

  const onSubmit = (data) => {
    onSubmitForm(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="px-2 text-uppercase fs-6">
      <FormFieldReactSelect
        label={"banque"}
        onChange={(tob) => {
          setValue("bankId", tob.id);
          setSelectedBank(tob);
        }}
        labelColSize={3}
        valueProp="name"
        options={banks}
        selected={selectedBank}
        name="bankId"
        errors={errors}
        control={control}
        defaultValue={tob ? selectedBank : null}
      />
      <Row>
        <Col className="mb-2">
          <FormField
            name={"name"}
            control={control}
            errors={errors}
            label="Nom"
            register={register}
            labelColSize={3}
            // noLabel
          />
        </Col>
      </Row>
      <hr className="my-1" />
      <div className="text-end mt-2  ">
        <BtnSubmit disabled={!isValid} size="sm" onCancel={onCancelForm} />
      </div>
    </form>
  );
}
