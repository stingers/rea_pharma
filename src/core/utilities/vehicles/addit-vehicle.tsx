import { yupResolver } from "@hookform/resolvers/yup";
import { deepClone } from "asv-hlps";
import { useReadonlyFetchTobs } from "asv-hlps-react";
import { BtnSubmit } from "asv-hlps-react/lib/cjs/reacts/minton/btns";
import dayjs from "dayjs";
import { Button, Form, Row, Table } from "react-bootstrap";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import Select from "react-select";
import * as yup from "yup";

import httpService from "../../../services/httpService";
import hlpForm from "../../../shared/forms/hlpForm";
import FormField from "../../../shared/forms/input-form-h";

type FormProps = {
  onSubmitForm?;
  onCancelForm?: (value) => any;
  tob?: any;
  url: string;
};

type InsuranceLineForm = {
  startDate: string;
  endDate: string;
  company: number | string;
  ref: string;
};

type FormType = {
  name: string;
  registration: string;
  registrationDate: string;
  lines?: InsuranceLineForm[];
};

const schema = (tob) =>
  yup.object({
    name: hlpForm.yupRequiredString(),
    registration: hlpForm.yupValideUniqName("vehicles/checkUniqueRegistration", tob),
    registrationDate: hlpForm.yupRequiredString(),
    lines: yup.array().of(
      yup.object({
        startDate: hlpForm.yupRequiredString(),
        endDate: hlpForm.yupRequiredString(),
        company: yup.number().required(),
        ref: hlpForm.yupRequiredString(),
      })
    ),
  });

const ifTobForm = (tob) => {
  if (tob) {
    // let upTob = { ...tob, lines: [...tob.insurances], registrationDate: dayjs(tob.registrationDate).format("YYYY-MM-DD") };
    let upTob = deepClone(tob);

    upTob.registrationDate = dayjs(tob.registrationDate).format("YYYY-MM-DD");
    upTob.lines = upTob.insurances;
    delete upTob.insurances;
    if (upTob.lines) {
      for (const line of upTob.lines) {
        line.startDate = dayjs(line.startDate).format("YYYY-MM-DD");
        line.endDate = dayjs(line.endDate).format("YYYY-MM-DD");
        line.company = line?.company?.id || null;
      }

      return upTob;
    }
    return upTob;

    /*  let upTob = { ...tob, lines: { ...tob.insurances }, registrationDate: dayjs(tob.registrationDate).format("YYYY-MM-DD") };
    upTob.lines = upTob.lines.map((line) => {
      return (line.startDate = dayjs(line.startDate).format("YYYY-MM-DD")), (line.startDate = dayjs(line.startDate).format("YYYY-MM-DD"));
    });
    // let upTob = deepClone(tob);
    console.log(upTob);
    upTob.lines = tob.insurances;
    upTob.registrationDate = dateFormatter(tob.registrationDate);
    // delete upTob.insurances;
    console.log(upTob);
    return upTob; */
  }
};

// type formType = { name: string; registration: string; registrationDate: string };

const AdditVehicle = ({ url, tob, onSubmitForm, onCancelForm }: FormProps) => {
  const {
    handleSubmit,
    register,
    control,
    watch,
    formState: { errors, isValid },
    setValue,
    reset,
  } = useForm<FormType>({
    defaultValues: tob ? ifTobForm(tob) : { lines: [{}] },
    resolver: yupResolver<any>(schema(tob)),
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    name: "lines",
    control,
  });

  /* const { data: compagnies } = useQueryGet({
    httpService,
    keys: ["insurances"],
    url: "insurances",
  }); */
  const { tobs: compagnies } = useReadonlyFetchTobs(httpService, "insurances");

  const watchFieldArray = watch("lines");

  const controlledFields = fields.map((field, index) => {
    return {
      ...field,
      ...watchFieldArray[index],
    };
  });

  const line: InsuranceLineForm = null;

  const onSubmit = (data) => {
    console.log(data);
    onSubmitForm(data);
    reset();
  };

  /* useEffect(() => {
    const nTob = ifTobForm(tob);
    for (let index = 0; index < nTob.lines.length; index++) {
      // const element = nTob.lines[index];
      setValue(`lines.${index}.company`, compagnies.filter((x) => x.id === `lines.${index}.company`)[0]);
    }
  }); */

  const handleCancel = (props) => {
    onCancelForm(false);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="px-2 text-uppercase fs-6">
      <FormField label="nom" name="name" register={register} errors={errors} control={control} />
      <FormField label="Immatriculation" name="registration" register={register} errors={errors} control={control} />
      <FormField type="date" label=" date Immatriculation" name="registrationDate" register={register} errors={errors} control={control} />
      <Row>
        <div className="table-responsive ">
          <Table className="mb-0 table-bordered table-striped text-uppercase fs-6" size="sm">
            <thead className="text-capitalize">
              <tr>
                <th>#</th>
                <th>
                  n° d'assurance <span className="text-danger">*</span>
                </th>
                <th>
                  compagnie <span className="text-danger">*</span>
                </th>
                <th>
                  date de début <span className="text-danger">*</span>
                </th>
                <th>
                  date de fin <span className="text-danger">*</span>
                </th>
                <th>
                  <i className="fas fa-trash"></i>
                </th>
              </tr>
            </thead>
            <tbody>
              {controlledFields.map((field, index, lines) => {
                return (
                  <tr key={field.id} className={"align-baseline"}>
                    <td>{index + 1}</td>

                    {/* // ------ ref insurrance ------ */}
                    <td>
                      <Form.Group>
                        <Form.Control {...register(`lines.${index}.ref` as const)} />
                        {errors && errors.lines?.[index].ref ? (
                          <Form.Text className="text-danger">{errors.lines?.[index].ref["message"]}</Form.Text>
                        ) : null}
                      </Form.Group>
                    </td>
                    {/* // ------ compagny ------ */}
                    <td className="col-2">
                      <Controller
                        name={`lines.${index}.company` as const}
                        control={control}
                        render={({ field }) => (
                          <Select
                            options={compagnies}
                            getOptionLabel={(opt) => `${opt["name"]}`}
                            getOptionValue={(opt) => `${opt["id"]}`}
                            styles={{ menu: (base) => ({ ...base, minWidth: 120 }) }}
                            menuPosition="fixed"
                            onChange={(tob) => {
                              //@ts-ignore
                              setValue(`lines.${index}.company`, +tob.id);
                            }}
                            // defaultValue={tob ?  : null}
                            // defaultValue={tob ? `lines.${index}.company` = 2 : null}
                            // defaultValue={tob ? compagnies.find((x) => x.id === +`lines.${index}.company`) : null}
                            /* defaultValue={
                              compagnies.find((x) => x.id === lines[index].company)
                              // setValue(`lines.${index}.company`, lines[index].company || null)
                              // console.log(+tob?.compagnies[index].company.id)
                              // console.log(lines)
                              // console.log(field)
                              // tob &&tob.co ? setValue(`lines.${index}.company`, +tob.compagnies[index].company.id) : null
                            } */
                          />
                        )}
                      />
                      {errors && errors.lines?.[index].company ? (
                        <Form.Text className="text-danger">{errors.lines?.[index].company["message"]}</Form.Text>
                      ) : null}
                    </td>
                    {/* // ------ startDate ------ */}
                    <td>
                      <Form.Group>
                        <Form.Control {...register(`lines.${index}.startDate` as const)} type="date" />
                        {errors && errors.lines?.[index].startDate ? (
                          <Form.Text className="text-danger">{errors.lines?.[index].startDate["message"]}</Form.Text>
                        ) : null}
                      </Form.Group>
                    </td>
                    {/* // ------ endDate ------ */}
                    <td>
                      <Form.Group>
                        <Form.Control {...register(`lines.${index}.endDate` as const)} type="date" />
                        {errors && errors.lines?.[index].endDate ? (
                          <Form.Text className="text-danger">{errors.lines?.[index].endDate["message"]}</Form.Text>
                        ) : null}
                      </Form.Group>
                    </td>

                    <td>
                      <span className="cursor-pointer" onClick={() => remove(index)}>
                        <i className="fas fa-trash text-danger"></i>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
          <div className="text-end mt-2  ">
            <Button size="sm" variant="info" className="text-uppercase mx-1 float-end " onClick={() => append(line)}>
              <span>
                <i className="fas fa-plus-circle"></i> ligne
              </span>
            </Button>
          </div>
        </div>
      </Row>

      <BtnSubmit disabled={!isValid} onCancel={handleCancel}></BtnSubmit>
      {/* <BtnSubmit disabled={isValid} onCancel={handleCancel}></BtnSubmit> */}
    </form>
  );
};

export default AdditVehicle;
