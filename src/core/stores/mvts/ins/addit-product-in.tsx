import { yupResolver } from "@hookform/resolvers/yup";
import { BtnSubmit } from "asv-hlps-react";
import useReadonlyFetchTobs from "asv-hlps-react/lib/cjs/reacts/hooks/uses/useReadonlyFetchTobs";
import { Button, Form, Row, Table } from "react-bootstrap";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import Select from "react-select";

import httpService from "../../../../services/httpService";
import { LineForm, ProducInSchema, ProductInForm } from "./ProductInForm";

const AdditProductIn = ({ tob, onSubmit, onCancelForm }) => {
  const { tobs: products } = useReadonlyFetchTobs(httpService, "products");
  const { tobs: depots } = useReadonlyFetchTobs(httpService, "productdepots");
  const {
    handleSubmit,
    register,
    control,
    formState: { errors, isValid },
    reset,
    setValue,
    watch,
    getValues,
  } = useForm<ProductInForm>({
    defaultValues: tob ? tob : { lines: [{}] },
    resolver: yupResolver<any>(ProducInSchema),
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

  // const onCancelForm = () => {};

  const formSubmit = (data) => {
    onSubmit(data);
    reset();
  };
  return (
    <form onSubmit={handleSubmit(formSubmit)} className="px-2 text-uppercase fs-6">
      <Row>
        <div className="table-responsive ">
          <Table className="mb-0 table-bordered" size="sm">
            <thead className="text-capitalize">
              <tr>
                <th>#</th>
                <th>
                  produit <span className="text-danger">*</span>
                </th>
                <th>
                  lot <span className="text-danger">*</span>
                </th>
                <th>
                  depot <span className="text-danger">*</span>
                </th>
                <th>
                  qités<span className="text-danger">*</span>
                </th>
                <th>
                  prix pvd<span className="text-danger">*</span>
                </th>
                <th>package</th>
                <th>date fab</th>
                <th>
                  date exp<span className="text-danger">*</span>
                </th>
                <th>
                  <i className="fas fa-bullhorn"></i>
                </th>

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
                    {/* productId */}
                    <td className="col-3">
                      <Controller
                        render={({ field }) => (
                          <Select
                            options={products}
                            // getOptionLabel={(opt) => `${opt["value"]} ${opt["label"]}`}
                            styles={{ menu: (base) => ({ ...base, minWidth: 250 }) }}
                            menuPosition={"fixed"}
                            onChange={(tob) => {
                              setValue(`lines.${index}.productId`, +tob.id);
                            }}
                            getOptionLabel={(tob) => tob.designation}
                          />
                        )}
                        // name={`lines.${index}.productId` as const}
                        name={`lines.${index}.productId`}
                        control={control}
                        // {...register(`lines.${index}.productId`)}
                      />
                      {errors && errors.lines?.[index].productId ? (
                        <Form.Text className="text-danger">{errors.lines?.[index].productId["message"]}</Form.Text>
                      ) : null}
                    </td>
                    {/* lot */}
                    <td className="col-1">
                      <Form.Group>
                        <Form.Control
                          className="p-1"
                          {...register(`lines.${index}.lot` as const)}
                          // bsPrefix="form-control-plaintext"
                        />
                        {errors && errors.lines?.[index].lot ? (
                          <Form.Text className="text-danger">{errors.lines?.[index].lot["message"]}</Form.Text>
                        ) : null}
                      </Form.Group>
                    </td>
                    {/* depotId */}
                    <td className="col-2">
                      <Controller
                        render={({ field }) => (
                          <Select
                            options={depots}
                            styles={{ menu: (base) => ({ ...base, minWidth: 250 }) }}
                            menuPosition={"fixed"}
                            onChange={(tob) => {
                              setValue(`lines.${index}.depotId`, +tob.id);
                            }}
                            getOptionLabel={(tob) => tob.name}
                          />
                        )}
                        name={`lines.${index}.depotId` as const}
                        control={control}
                        // {...register(`lines.${index}.depotId` as const)}
                      />
                      {errors && errors.lines?.[index].depotId ? (
                        <Form.Text className="text-danger">{errors.lines?.[index].depotId["message"]}</Form.Text>
                      ) : null}
                    </td>
                    {/* qtity */}
                    <td className="col-1">
                      <Form.Group>
                        <Form.Control
                          className="p-1"
                          {...register(`lines.${index}.qtity` as const)}
                          // bsPrefix="form-control-plaintext"
                        />
                        {errors && errors.lines?.[index].qtity ? (
                          <Form.Text className="text-danger">{errors.lines?.[index].qtity["message"]}</Form.Text>
                        ) : null}
                      </Form.Group>
                    </td>
                    {/* pvdPrice */}
                    <td className="col-1">
                      <Form.Group>
                        <Form.Control
                          className="p-1"
                          // {...register(`lines.${index}.amountDebit` as const)}
                          {...register(`lines.${index}.pvdPrice`)}
                          // bsPrefix="form-control-plaintext"
                        />
                        {errors && errors.lines?.[index].pvdPrice ? (
                          <Form.Text className="text-danger">{errors.lines?.[index].pvdPrice["message"]}</Form.Text>
                        ) : null}
                      </Form.Group>
                    </td>
                    {/* qtityPerPackaging */}
                    <td className="col-1">
                      <Form.Group>
                        <Form.Control
                          className="p-1"
                          {...register(`lines.${index}.qtityPerPackaging` as const)}
                          // bsPrefix="form-control-plaintext"
                        />
                        {errors && errors.lines?.[index].qtityPerPackaging ? (
                          <Form.Text className="text-danger">{errors.lines?.[index].qtityPerPackaging["message"]}</Form.Text>
                        ) : null}
                      </Form.Group>
                    </td>
                    {/* manufDate */}
                    <td className="col-1">
                      <Form.Group>
                        <Form.Control
                          className="p-1"
                          type="date"
                          {...register(`lines.${index}.manufDate` as const)}
                          // bsPrefix="form-control-plaintext"
                        />
                        {errors && errors.lines?.[index].manufDate ? (
                          <Form.Text className="text-danger">{errors.lines?.[index].manufDate["message"]}</Form.Text>
                        ) : null}
                      </Form.Group>
                    </td>
                    {/* expirationDate */}
                    <td className="col-1">
                      <Form.Group>
                        <Form.Control
                          className="p-1"
                          type="date"
                          {...register(`lines.${index}.expirationDate` as const)}
                          // bsPrefix="form-control-plaintext"
                        />
                        {errors && errors.lines?.[index].expirationDate ? (
                          <Form.Text className="text-danger">{errors.lines?.[index].expirationDate["message"]}</Form.Text>
                        ) : null}
                      </Form.Group>
                    </td>
                    {/* published */}
                    <td>
                      <Form.Check {...register(`lines.${index}.published`)} />
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
        <BtnSubmit disabled={!isValid} size="sm" onCancel={onCancelForm} />
        {/* <BtnSubmit disabled={isValid} size="sm" onCancel={onCancelForm} /> */}
      </div>
    </form>
  );
};

export default AdditProductIn;
