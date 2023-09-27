import { yupResolver } from "@hookform/resolvers/yup";
import { Leave } from "asv-hlps";
import FormField from "asv-hlps-react/lib/cjs/reacts/forms/input-form-h";
import BtnSubmit from "asv-hlps-react/lib/cjs/reacts/minton/btns/BtnSubmit";
import dayjs from "dayjs";
import { useEffect } from "react";
import { Col, Form, ListGroup, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { FormErrors } from "../../../shared/forms/FormErrors";

// require("dayjs/locale/fr");
import "dayjs/locale/fr";
import authService from "../../../auth/services/authService";

type TobType = {
  tob: Leave;
  onSubmitForm;
  onCancelForm;
};

/* interface FormType {
  validLeave: string;
  motifReject?: string;
  dgNoDispo?: boolean;
} */

const MngLeave = ({ tob, onSubmitForm, onCancelForm }: TobType) => {
  // const [check, setCheck] = useState(null);
  /* const schema = yup.object({
    validLeave: yup.string().required(FormErrors.REQUIRED),
    motifReject: yup.string().when("validLeave", {
      is: (value) => value === "false",
      // is: false,
      then: yup.string().required(FormErrors.REQUIRED),
    }),
    dgNoDispo: yup.string(),
  }); */

  const schema = yup.object({
    validLeave: yup.string().required(FormErrors.REQUIRED),
    motifReject: yup.string().when("validLeave", {
      // is: (value) => value === "isRejected",
      is: "isRejected",
      then: () => yup.string().required(FormErrors.REQUIRED).min(10, "Minimum 10 caractères"),
      otherwise: () => yup.string().notRequired(),
    }),
    dgNoDispo: yup.string(),
  });
  type FormType = yup.InferType<typeof schema>;

  const {
    handleSubmit,
    register,
    control,
    formState: { errors, isValid },
    getValues,
    watch,
    reset,
    setValue,
  } = useForm<FormType>({
    defaultValues: {},
    resolver: yupResolver<any>(schema),
    mode: "onChange",
  });
  const checkValid = watch("validLeave");

  /* const { onChange, ref, name } = register("validLeave");
  console.log(name.length);
  console.log(ref.name);
  console.log(onChange); */

  const formSubmit = (values) => {
    onSubmitForm(values);
    reset();
  };

  const handleCancel = () => {
    reset();
    onCancelForm();
  };

  useEffect(() => {
    if (checkValid === "isAccepted") {
      setValue("motifReject", "");
    }
  }, [checkValid]);

  // const checked = useWatch({ control, name: "validLeave" });

  /* useEffect(() => {
    if (check === false) {
      setCheck(false);
    } else {
      setCheck(true);
    }
  }, [check]); */

  return (
    <ListGroup>
      <ListGroup.Item>
        <span>
          <small className="me-2 text-uppercase">Fait le : </small>
          <b>{dayjs(tob.createdAt).format("DD/MM/YYYY")}</b>
        </span>
      </ListGroup.Item>
      <ListGroup.Item>
        <span>
          <small className="me-2 text-uppercase">Demandeur : </small>
          <b>{tob.author.fullname}</b>
        </span>
      </ListGroup.Item>
      <ListGroup.Item>
        <span>
          <small className="me-2 text-uppercase">periode : </small>
          <b>
            du <span className="text-warning text-capitalize">{dayjs(tob.fromDate).locale("fr").format("dddd DD MMMM YYYY")}</span>
            au <span className="text-warning text-capitalize">{dayjs(tob.toDate).locale("fr").format("dddd DD MMMM YYYY")}</span>
          </b>
        </span>
      </ListGroup.Item>
      <ListGroup.Item>
        <span>
          <small className="me-2 text-uppercase">motif : </small>
          <b>{tob.motif}</b>
        </span>
      </ListGroup.Item>
      <ListGroup.Item>
        <form onSubmit={handleSubmit(formSubmit)} className="px-2 text-uppercase fs-6">
          <Form.Group as={Row} className="mb-2">
            <Col>
              <Row>
                {/* <input type={"radio"} value={"fofo"} onChange={(e) => handleChange(e)} name="validLeave" /> */}
                <Col>
                  {/* <Controller
                    control={control}
                    name="validLeave"
                    render={({ field: { onChange, onBlur, value, name, ref }, formState }) => ( */}
                  <Form.Check type="radio" name="validLeave" value={"isAccepted"} label="accepter" {...register("validLeave")} />
                  {/* )}
                  /> */}
                </Col>
                <Col>
                  <Form.Check type="radio" name="validLeave" value={"isRejected"} label="refuser" {...register("validLeave")} />
                </Col>
                {!authService.getAuth({ roles: ["ceo", "sadm"] }) && (
                  <Col>
                    <Form.Check type="checkbox" label="dg no dispo" {...register("dgNoDispo")} />
                  </Col>
                )}
              </Row>
              {/* {check === false && ( */}
              {checkValid === "isRejected" && (
                <Row>
                  <Col className="mb-2">
                    <FormField
                      type="textarea"
                      name={"motifReject"}
                      placeholder={"motif du refus"}
                      control={control}
                      errors={errors}
                      label="motif"
                      register={register}
                      noLabel
                    />
                  </Col>
                </Row>
              )}
            </Col>
          </Form.Group>
          <BtnSubmit disabled={!isValid} onCancel={handleCancel} />
          {/* <BtnSubmit disabled={isValid} onCancel={handleCancel} /> */}
        </form>
      </ListGroup.Item>
    </ListGroup>
  );
};

export default MngLeave;
