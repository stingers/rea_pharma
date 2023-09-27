import { yupResolver } from "@hookform/resolvers/yup";
import { BtnSubmit, FormField } from "asv-hlps-react";
import dayjs from "dayjs";
import { Col, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import hlpForm from "../../../../shared/forms/hlpForm";

const AdditProductPromo = ({ productId, tob, onSubmitForm, onCancelForm }) => {
  const getTob = (tob) => {
    tob.startDate = dayjs(tob.startDate).format("YYYY-MM-DD");
    tob.endDate = dayjs(tob.endDate).format("YYYY-MM-DD");
    return tob;
  };
  const schema = yup.object({
    qtityFree: hlpForm.yupRequiredNumber(),
    qtityPromo: hlpForm.yupRequiredNumber(),
    startDate: hlpForm.yupRequiredString(),
    endDate: hlpForm.yupRequiredString(),
  });
  type FormType = yup.InferType<typeof schema>;
  const {
    handleSubmit,
    register,
    control,
    formState: { errors, isValid },
    reset,
  } = useForm<FormType>({
    defaultValues: tob ? getTob(tob) : {},
    resolver: yupResolver<any>(schema),
    mode: "onChange",
  });

  const formSubmit = (values) => {
    reset();
    const vals = { promo: values, productId };
    onSubmitForm(vals);
  };

  return (
    <form onSubmit={handleSubmit(formSubmit)} className="px-2 mb-2 text-uppercase fs-6">
      {/* <h5 className="mb-3 text-uppercase bg-light p-2">
      <i className="fas fa-house-user"></i> Bien
    </h5> */}

      <Row>
        <Col>
          <FormField name={"qtityPromo"} control={control} errors={errors} label="Quantité commander" register={register} />
        </Col>
      </Row>
      <Row>
        <Col>
          <FormField name={"qtityFree"} control={control} errors={errors} label="Ug" register={register} />
        </Col>
      </Row>
      <Row>
        <Col>
          <FormField type="date" name={"startDate"} control={control} errors={errors} label="Debut" register={register} />
        </Col>
      </Row>
      <Row>
        <Col>
          <FormField type="date" name={"endDate"} control={control} errors={errors} label="Fin" register={register} />
        </Col>
      </Row>
      {/* <hr className="my-1" /> */}
      <div className="text-end mt-2 pb-2  ">
        <BtnSubmit size="sm" onCancel={onCancelForm} disabled={!isValid} />
      </div>
    </form>
  );
};

export default AdditProductPromo;
