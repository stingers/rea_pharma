import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { yupResolver } from "@hookform/resolvers/yup";
import { BtnSubmit, FormField, FormFieldReactSelect } from "asv-hlps-react";
import { useReadonlyFetchTobs } from "asv-hlps-react/lib/cjs/reacts/hooks";
import { useState } from "react";
import { Col, Row } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";

import httpService from "../../../services/httpService";
import FormInput from "../../../shared/forms/FormInput";
import FaqForm, { FaqSchema } from "./FaqForm";

const AdditFaq = ({ tob, onCancelForm, onSubmitForm }) => {
  let upTob = { ...tob.faq };
  upTob.catId = tob.catId;
  const { tobs: cats } = useReadonlyFetchTobs(httpService, "faqcats");
  const [selectedCat, setSelectedCat] = useState(upTob.catId || null);
  // --------------------
  const {
    handleSubmit,
    register,
    control,
    formState: { errors, isValid },
    reset,
    setValue,
    getValues,
    watch,
  } = useForm<FaqForm>({
    // defaultValues: tob.faq ? tob.faq : {},
    defaultValues: tob ? upTob : {},
    resolver: yupResolver<any>(FaqSchema),
    mode: "onChange",
  });
  // --------------------
  const formSubmit = (values) => {
    onSubmitForm(values);
    reset();
  };
  // --------------------

  return (
    <form onSubmit={handleSubmit(formSubmit)} className="px-2 text-uppercase fs-6">
      <FormFieldReactSelect
        // vertical
        noLabel
        label={"categories"}
        onChange={(tob) => {
          setValue("catId", +tob.value);
          setSelectedCat(+tob.value);
        }}
        options={cats}
        selected={selectedCat}
        name="catId"
        errors={errors}
        control={control}
      />
      <FormField
        name={"question"}
        placeholder={"question"}
        control={control}
        errors={errors}
        label="question"
        register={register}
        noLabel
      />
      <Controller
        name="response"
        control={control}
        render={({ field }) => (
          <CKEditor
            editor={ClassicEditor}
            data={getValues("response") || ""}
            onChange={(event, editor) => {
              const data = editor.getData();
              setValue("response", data);
            }}
          />
        )}
      />

      <Row className="my-2">
        <Col>
          <FormInput label={"interne"} type="checkbox" name="intern" register={register} errors={errors} control={control} />
        </Col>
        <Col>
          <FormInput label={"externe"} type="checkbox" name="extern" register={register} errors={errors} control={control} />
        </Col>
      </Row>

      <hr className="my-1" />
      <div className="text-end mt-2  ">
        <BtnSubmit disabled={!isValid} size="sm" onCancel={onCancelForm} />
      </div>
    </form>
  );
};

export default AdditFaq;
