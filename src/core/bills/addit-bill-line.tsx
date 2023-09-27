import { yupResolver } from "@hookform/resolvers/yup";
import { BtnSubmit, FormFieldReactSelect, useReadonlyFetchTobs } from "asv-hlps-react";
import { useState } from "react";
import { Button, Col, Form, Row, Table } from "react-bootstrap";
import { useFieldArray, useForm } from "react-hook-form";
import * as yup from "yup";

import httpService from "../../services/httpService";
import FormField from "../../shared/forms/input-form-h";

type LineForm = {
  id?: number;
  designation: string;
  qtity: number;
  unitPrice: number;
};

type BillLineForm = {
  id?: number;
  mafiaDate: Date;
  clientId: number;
  lines: LineForm[];
};

const AdditBillLine = ({ onCancel, onSubmit }) => {
  const [selectedClient, setSelectedClient] = useState(null);
  let { tobs: clients } = useReadonlyFetchTobs(httpService, "users");

  // --------------------
  const schema = yup.object({
    clientId: yup.number().required(),
    mafiaDate: yup.string(),
    lines: yup.array().of(
      yup.object({
        unitPrice: yup.number().required().typeError("digit is required"),
        qtity: yup.number().required().typeError("digit is required"),
        designation: yup.string().required("this field is required").typeError("this field is required"),
      })
    ),
  });

  const {
    handleSubmit,
    register,
    control,
    formState: { errors, isValid },
    setValue,
    getValues,
    watch,
    reset,
  } = useForm<BillLineForm>({
    // defaultValues: tob ? tob : {},
    defaultValues: { lines: [{}] },
    resolver: yupResolver<any>(schema),
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

  const line: LineForm = null;

  const formSubmit = (values) => {
    onSubmit(values);
    setSelectedClient(null);
    reset();
  };
  // const onCancelForm = (props) => {};

  return (
    <form onSubmit={handleSubmit(formSubmit)} className="px-2 text-uppercase fs-6">
      <Row>
        <Col md={8}>
          <FormFieldReactSelect
            vertical
            noLabel
            label={"clients"}
            onChange={(tob) => {
              setValue("clientId", +tob.id);
              setSelectedClient(tob);
            }}
            options={clients}
            selected={selectedClient}
            name="clientId"
            errors={errors}
            control={control}
          />
        </Col>
        <Col>
          <FormField
            vertical
            type="date"
            noLabel
            requiredStar={false}
            label="date"
            name="mafiaDate"
            register={register}
            errors={errors}
            control={control}
          />
        </Col>
      </Row>
      <Row>
        <div className="table-responsive ">
          <Table className="mb-0" size="sm">
            <thead className="text-capitalize">
              <tr>
                <th>#</th>
                <th>
                  Designation <span className="text-danger">*</span>
                </th>
                <th>
                  qtité <span className="text-danger">*</span>
                </th>
                <th>
                  P.U <span className="text-danger">*</span>
                </th>
                <th>Montant</th>
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
                    {/* designation */}
                    <td>
                      <Form.Group>
                        <Form.Control
                          {...register(`lines.${index}.designation` as const)}
                          // bsPrefix="form-control-plaintext"
                        />
                        {errors && errors.lines?.[index].designation ? (
                          <Form.Text className="text-danger">{errors.lines?.[index].designation["message"]}</Form.Text>
                        ) : null}
                      </Form.Group>
                    </td>
                    {/* qtity */}
                    <td className="col-2">
                      <Form.Group>
                        <Form.Control
                          {...register(`lines.${index}.qtity` as const)}
                          // bsPrefix="form-control-plaintext"
                        />
                        {errors && errors.lines?.[index].qtity ? (
                          <Form.Text className="text-danger">{errors.lines?.[index].qtity["message"]}</Form.Text>
                        ) : null}
                      </Form.Group>
                    </td>

                    <td className="col-2">
                      <Form.Group>
                        <Form.Control
                          {...register(`lines.${index}.unitPrice` as const)}
                          // bsPrefix="form-control-plaintext"
                        />
                        {errors && errors.lines?.[index].unitPrice ? (
                          <Form.Text className="text-danger">{errors.lines?.[index].unitPrice["message"]}</Form.Text>
                        ) : null}
                      </Form.Group>
                    </td>
                    {/* montant */}
                    <td className="col-2">
                      <Form.Group>
                        <Form.Control
                          readOnly
                          disabled
                          value={(getValues(`lines.${index}.unitPrice`) || 0) * (getValues(`lines.${index}.qtity`) || 0)}

                          // bsPrefix="form-control-plaintext"
                        />
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
      </div>
    </form>
  );
};

export default AdditBillLine;
