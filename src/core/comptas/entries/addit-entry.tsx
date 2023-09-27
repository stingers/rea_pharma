import { yupResolver } from "@hookform/resolvers/yup";
import { BtnSubmit, FormFieldReactSelect, useReadonlyFetchTobs } from "asv-hlps-react";
import { Entry } from "asv-hlps/lib/cjs/models/entities/comptas/Entry";
import dayjs from "dayjs";
import { useState } from "react";
import { Button, Col, Form, Row, Table } from "react-bootstrap";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import Select from "react-select";

import httpService from "../../../services/httpService";
import FormField from "../../../shared/forms/input-form-h";
import { Toastify } from "../../../shared/helpers/Toastify";
import { EntryForm, EntryLineForm, EntrySchema } from "./EntryForm";

type AdditModalFormProps = {
  tob?: Entry;
  onSubmitForm: (value: any) => void;
  onCancelForm: any;
};

const AdditEntry = ({ tob, onSubmitForm, onCancelForm }: AdditModalFormProps) => {
  const [selectedCat, setSelectedCat] = useState();
  const { tobs: cats } = useReadonlyFetchTobs(httpService, "entrycats/entriesMenu");
  const { tobs: accounts } = useReadonlyFetchTobs(httpService, "entryaccounts");

  const formatForm = (tob) => {
    tob.catId = +tob.cat.id;
    tob.entryDate = dayjs(tob.entryDate).format("YYYY-MM-DD");
    return tob;
  };

  const {
    handleSubmit,
    register,
    control,
    formState: { errors, isValid },
    reset,
    setValue,
    getValues,
    watch,
    getFieldState,
  } = useForm<EntryForm>({
    defaultValues: tob ? formatForm(tob) : { lines: [{}] },
    resolver: yupResolver<any>(EntrySchema),
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    name: "lines",
    control,
  });

  const watchFieldArray = watch("lines");

  const controlledFields = fields.map((field, index) => {
    return {
      ...field,
      ...watchFieldArray[index],
    };
  });

  const line: EntryLineForm = null;

  const formSubmit = (data) => {
    if (data.lines.length <= 1) {
      Toastify.error("Minimum 2 lignes");
      return;
    }
    onSubmitForm(data);
    reset();
  };

  const onCancel = () => {
    reset();
    onCancelForm();
  };

  return (
    <form onSubmit={handleSubmit(formSubmit)} className="px-2 text-uppercase fs-6">
      <Row>
        {/* cat */}
        <Col>
          <FormFieldReactSelect
            vertical
            noLabel
            label={"classeur"}
            onChange={(tob) => {
              setValue("catId", +tob.id);
              setSelectedCat(tob);
            }}
            options={cats}
            selected={selectedCat}
            name="catId"
            errors={errors}
            control={control}
            defaultValue={tob ? tob.cat : null}
          />
        </Col>
        {/* proof */}
        <Col>
          <FormField name={"proof"} control={control} errors={errors} label="pièce" register={register} noLabel vertical />
        </Col>
        {/* entryDate */}
        <Col md={3}>
          <FormField
            type="date"
            name={"entryDate"}
            control={control}
            errors={errors}
            label="Date"
            register={register}
            noLabel
            requiredStar={false}
            vertical
          />
        </Col>
      </Row>
      <Row>
        <div className="table-responsive ">
          <Table className="mb-0 table-bordered table-striped" size="sm">
            <thead className="text-capitalize">
              <tr>
                <th>#</th>
                <th>
                  compte débit <span className="text-danger">*</span>
                </th>
                <th>
                  compte credit <span className="text-danger">*</span>
                </th>
                <th>
                  designation <span className="text-danger">*</span>
                </th>
                <th>Montant débit</th>
                <th>Montant credit</th>

                <th>
                  <i className="fas fa-trash"></i>
                </th>
              </tr>
            </thead>
            <tbody>
              {controlledFields.map((field, index) => {
                return (
                  <tr key={field.id} className={"align-baseline"}>
                    <td>{index + 1}</td>
                    <td className="col-2">
                      <Controller
                        render={() => (
                          <Select
                            // {...field}
                            options={accounts}
                            getOptionLabel={(opt) => `${opt["id"]} ${opt["name"]}`}
                            styles={{ menu: (base) => ({ ...base, minWidth: 500 }) }}
                            menuPosition="fixed"
                            onChange={(tob) => {
                              setValue(`lines.${index}.accountDebit`, +tob.id);
                              // setValue(`lines.${index}.accountDebit`, tob);
                            }}
                            // defaultValue={tob ? accounts.find((x) => x.id === +field.accountDebit) : null}
                            value={tob ? accounts.find((x) => x.id === +field.accountDebit) : null}
                            // value={tob ? accounts.find((x) => x.id === +field?.accountDebit) : `lines.${index}.accountDebit`}
                            // value={getValues(`lines.${index}.accountDebit`)}
                            // defaultValue={tob ? tob.lines[index].accountDebit === field.value : null}
                            // defaultValue={tob ? accounts.find((x) => x.id === field.accountDebit) : null}
                            // defaultValue={tob ? accounts.find((index) => index === +`lines.${index}.accountDebit`) : null}
                          />
                        )}
                        name={`lines.${index}.accountDebit` as const}
                        control={control}

                        // {...register(`lines.${index}.accountDebit`)}
                      />
                      {errors && errors.lines?.[index]?.accountDebit ? (
                        <Form.Text className="text-danger">{errors.lines?.[index].accountDebit["message"]}</Form.Text>
                      ) : null}
                    </td>
                    <td className="col-2">
                      <Controller
                        render={() => (
                          <Select
                            options={accounts}
                            getOptionLabel={(opt) => `${opt["id"]} ${opt["name"]}`}
                            styles={{ menu: (base) => ({ ...base, minWidth: 500 }) }}
                            menuPosition="fixed"
                            // isDisabled={`lines.${index}.accountDebit` !== undefined}
                            onChange={(obj) => {
                              setValue(`lines.${index}.accountCredit`, +obj.id as number);
                            }}
                            value={tob ? accounts.find((x) => x.id === +field.accountCredit) : null}
                            // defaultValue={tob ? accounts.find((x) => x.id === +field.accountCredit) : null}
                          />
                        )}
                        name={`lines.${index}.accountCredit`}
                        control={control}

                        // {...register(`lines.${index}.accountCredit` as const)}
                      />
                      {errors && errors.lines?.[index]?.accountCredit ? (
                        <Form.Text className="text-danger">{errors.lines?.[index].accountCredit["message"]}</Form.Text>
                      ) : null}
                    </td>
                    <td>
                      <Form.Group>
                        <Form.Control
                          {...register(`lines.${index}.designation` as const)}
                          // bsPrefix="form-control-plaintext"
                        />
                        {errors && errors.lines?.[index]?.designation ? (
                          <Form.Text className="text-danger">{errors.lines?.[index].designation["message"]}</Form.Text>
                        ) : null}
                      </Form.Group>
                    </td>
                    <td className="col-2">
                      <Form.Group>
                        <Form.Control
                          {...register(`lines.${index}.amountDebit` as const)}
                          // bsPrefix="form-control-plaintext"
                        />
                        {errors && errors.lines?.[index]?.amountDebit ? (
                          <Form.Text className="text-danger">{errors.lines?.[index].amountDebit["message"]}</Form.Text>
                        ) : null}
                      </Form.Group>
                    </td>
                    <td className="col-2">
                      <Form.Group>
                        <Form.Control
                          {...register(`lines.${index}.amountCredit` as const)}
                          // bsPrefix="form-control-plaintext"
                        />
                        {errors && errors.lines?.[index]?.amountCredit ? (
                          <Form.Text className="text-danger">{errors.lines?.[index].amountCredit["message"]}</Form.Text>
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
      <hr className="my-1" />
      <div className="text-end mt-2  ">
        <BtnSubmit disabled={!isValid} size="sm" onCancel={onCancel} />
        {/* <BtnSubmit disabled={isValid} size="sm" onCancel={onCancel} /> */}
      </div>
    </form>
  );
};

export default AdditEntry;
