import { yupResolver } from "@hookform/resolvers/yup";
import { BtnSubmit, FormFieldReactSelect, useReadonlyFetchTobs } from "asv-hlps-react";
import { useEffect, useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import httpService from "../../../services/httpService";
import { FormErrors } from "../../../shared/forms/FormErrors";
import FormField from "../../../shared/forms/input-form-h";

type TobProps = {
  // tob?: Feed;
  tob?: any;
  onSubmitForm?: (values) => any;
  onCancelForm?: (value) => any;
};

type FormType = {
  id?: number;
  methodId: number;
  accountId?: number;
  bankId?: number;
  checkNumber?: string;
  typeAppro?: string;
  description: string;
  amount: number;
  feedDate?: Date | string;
  // feedDate?: string;
};

const schema = yup.object({
  description: yup.string().required(),
  // feedDate: yup.string().nullable().optional().notRequired(),
  feedDate: yup.string(),
  typeAppro: yup.string().required(),
  methodId: yup.number().required(),
  amount: yup.number().required().positive().integer().typeError(FormErrors.DIGIT),
  checkNumber: yup
    .string()
    .default(null)
    // .nullable()
    .when("methodId", {
      is: (value) => +value !== 1,
      then: () => yup.string().required(FormErrors.REQUIRED),
      otherwise: () => yup.string().notRequired(),
    }),
  bankId: yup
    .number()
    .default(null)
    .when("methodId", {
      is: (value) => +value !== 1,
      then: () => yup.number().required(),
      otherwise: () => yup.string().notRequired(),
    }),
  accountId: yup
    .number()
    .default(null)
    .when("methodId", {
      is: (value) => +value !== 1,
      then: () => yup.number().required(),
      otherwise: () => yup.string().notRequired(),
    }),
});

const AdditFeed = ({ tob, onCancelForm, onSubmitForm }: TobProps) => {
  const [selectedMode, setSelectedMode] = useState(tob ? tob.method : null);
  const [selectedBank, setSelectedBank] = useState(tob ? tob.bank : null);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const { tobs: modes } = useReadonlyFetchTobs(httpService, "billpaymentmodes");
  const { tobs: banks } = useReadonlyFetchTobs(httpService, "banks");
  const { tobs: accounts } = useReadonlyFetchTobs(httpService, "accounts");

  const formatForm = (tob) => {
    tob.methodId = tob?.method.id;
    if (tob.bank) {
      tob.bankId = tob?.bank.id;
    }
    if (tob.account) {
      tob.accountId = tob?.account.id;
    }
    return tob;
  };

  const {
    handleSubmit,
    register,
    control,
    setValue,
    formState: { errors, isValid },
    reset,
    watch,
  } = useForm<FormType>({
    defaultValues: tob ? formatForm(tob) : {},
    resolver: yupResolver<any>(schema),
    mode: "onChange",
  });

  const watchMethodId = watch("methodId");

  const formSubmit = (data) => {
    onSubmitForm(data);
    reset();
  };

  useEffect(() => {
    if (watchMethodId === 1) {
      setValue("accountId", null);
      setValue("bankId", null);
      setValue("checkNumber", null);
    }
  }, [watchMethodId]);

  return (
    <form onSubmit={handleSubmit(formSubmit)} className="px-2 text-uppercase fs-6">
      <Form.Group>
        <Row>
          <Col>
            <Form.Label>auteur</Form.Label>
          </Col>

          <Col>
            <Form.Check label={"D.G"} type="radio" name="typeAppro" value={"dg"} {...register("typeAppro")} />
          </Col>
          <Col>
            <Form.Check label={"banque"} type="radio" name="typeAppro" value={"bank"} {...register("typeAppro")} />
          </Col>
          <Col>
            <Form.Check label={"autre"} type="radio" name="typeAppro" value={"other"} {...register("typeAppro")} />
          </Col>
        </Row>
        <span>{errors.typeAppro?.message}</span>
      </Form.Group>

      <FormField type="date" requiredStar={false} label="date" name="feedDate" register={register} errors={errors} control={control} />
      <FormField label="description" name="description" register={register} errors={errors} control={control} />
      <FormField label="montant" name="amount" register={register} errors={errors} control={control} />
      <FormFieldReactSelect
        label={"mode"}
        onChange={(tob) => {
          setValue("methodId", +tob.id);
          setSelectedMode(tob);
          if (selectedMode?.id === 1) {
            setSelectedAccount(null);
            setSelectedBank(null);
            // setValue("bankId", null);
            // setValue("accountId", null);
            setValue("checkNumber", "");
          }
        }}
        options={modes}
        selected={selectedMode}
        name="methodId"
        errors={errors}
        control={control}
        defaultValue={tob ? tob.method : null}
      />

      {/* {watchMethodId && watchMethodId !== 1 && ( */}
      {selectedMode && selectedMode?.id !== 1 && (
        <>
          <FormField labelColSize={4} label="N°chèque/virt." name="checkNumber" register={register} errors={errors} control={control} />
          <FormFieldReactSelect
            labelColSize={4}
            label={"Banq. emettrice"}
            onChange={(tob) => {
              setValue("bankId", +tob.id);
              setSelectedBank(tob);
            }}
            options={banks}
            selected={selectedBank}
            name="bankId"
            errors={errors}
            control={control}
            defaultValue={tob ? tob.bank : null}
          />
          <FormFieldReactSelect
            labelColSize={4}
            label={"Compte Cpa"}
            onChange={(tob) => {
              setValue("accountId", +tob.id);
              setSelectedAccount(tob);
            }}
            options={accounts}
            selected={selectedAccount}
            name="accountId"
            errors={errors}
            control={control}
            defaultValue={tob ? tob.account : null}
          />
        </>
      )}

      <hr className="my-1" />
      <div className="text-end mt-2  ">
        {/* <BtnSubmit disabled={isValid} size="sm" onCancel={onCancelForm} /> */}
        <BtnSubmit disabled={!isValid} size="sm" onCancel={onCancelForm} />
      </div>
    </form>
  );
};

export default AdditFeed;
