import { yupResolver } from "@hookform/resolvers/yup";
import { ProductTclGrp } from "asv-hlps";
import { BtnSubmit, FormField, FormFieldReactSelect, useReadonlyFetchTobs } from "asv-hlps-react";
import { useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import httpService from "../../../../../../services/httpService";
import hlpForm from "../../../../../../shared/forms/hlpForm";

interface FormType {
  id?: number;
  name: string;
  grpId: number;
}

export default function AdditTclForm({ tob, onSubmitForm, onCancelForm }) {
  const { tobs: grps } = useReadonlyFetchTobs(httpService, "producttclgrps");
  const [selectedTob, setSelectedTob] = useState<ProductTclGrp>(tob ? tob.grp : null);

  const schema = yup.object({
    name: hlpForm.yupValideUniqName("producttclgrps/checkUniqueName", tob),
    grpId: yup.number().required(),
  });
  const {
    handleSubmit,
    register,
    control,
    formState: { errors, isValid },
    reset,
    setValue,
    getValues,
  } = useForm<FormType>({
    defaultValues: tob ? { id: tob.id, name: tob.name, grpId: tob.grp.id } : {},
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
        label={"groupe"}
        onChange={(tob) => {
          setValue("grpId", tob.id);
          setSelectedTob(tob);
        }}
        labelColSize={3}
        valueProp="name"
        options={grps}
        selected={selectedTob}
        name="grpId"
        errors={errors}
        control={control}
        // defaultValue={tob ? tob.cat : null}
        defaultValue={tob ? selectedTob : null}
        // className={"pb-0"}
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
