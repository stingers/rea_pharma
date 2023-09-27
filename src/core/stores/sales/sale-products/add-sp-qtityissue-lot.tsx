import { removeDuplicateObjects, SaleProductQtityIssue } from "asv-hlps";
import { BtnSubmit, ModalConfirm } from "asv-hlps-react";
import useReadonlyFetchTobs from "asv-hlps-react/lib/cjs/reacts/hooks/uses/useReadonlyFetchTobs";
import { useState } from "react";
import { Button, Form, Row, Table } from "react-bootstrap";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import Select from "react-select";
import * as yup from "yup";

import { yupResolver } from "@hookform/resolvers/yup";
import httpService from "../../../../services/httpService";
import { SpqiForm, SpqiLineForm, SpqiSchema } from "./SpqiForm";

type TobType = {
  tob: SaleProductQtityIssue;
  onSubmit: (value: any) => void;
};
const AddSpQtityissueLot = ({ tob, onSubmit }: TobType) => {
  let { tobs } = useReadonlyFetchTobs(httpService, "productins/lots", { param: tob.saleProduct.product.id });
  // console.log(tobs.length);
  tobs = tobs.filter((x) => x.depot.main === "master");
  tobs = removeDuplicateObjects(tobs, "lot");
  // console.log(tobs.length);

  const [modal, setModal] = useState(false);
  const [totalQtities, setTotalQtities] = useState(null);

  const schema = yup.object({
    qtity: yup.number().required(),
    lotId: yup.number().required(),
  });

  const {
    handleSubmit,
    register,
    control,
    formState: { errors, isValid },
    reset,
    watch,
    setValue,
  } = useForm<SpqiForm>({
    defaultValues: { lines: [{}] },
    resolver: yupResolver<any>(SpqiSchema),
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    name: "lines",
    control,
  });

  const watchFieldArray = watch("lines");
  // const watchAccountDebit = watch(`lines.${index}.accountDebit`);
  const controlledFields = fields.map((field, index) => {
    return {
      ...field,
      ...watchFieldArray[index],
    };
  });

  const formSubmit = ({ lines }) => {
    const totalQtities = lines.reduce((prev, curr) => {
      return +prev + +curr.qtity;
    }, 0);
    setTotalQtities(totalQtities);
    if (totalQtities > tob.saleProduct.qtityOdr) {
      setModal(true);
    } else {
      setModal(false);
      onSubmit(lines);
    }
  };
  const onCancelForm = () => {};

  const line: SpqiLineForm = null;

  return (
    <>
      <form onSubmit={handleSubmit(formSubmit)} className="px-2 text-uppercase fs-6">
        <Row>
          <div className="table-responsive ">
            <Table className="mb-0 table-bordered" size="sm">
              <thead className="text-capitalize">
                <tr>
                  <th>#</th>
                  <th>
                    lots <span className="text-danger">*</span>
                  </th>
                  <th>
                    quantité <span className="text-danger">*</span>
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
                      <td className="col-8">
                        <Controller
                          render={({ field }) => (
                            <Select
                              className={"react-select react-select-container text-uppercase"}
                              options={tobs}
                              menuPosition="fixed"
                              getOptionLabel={(opt) => `${opt["lot"]} =>  ${opt["depot"]["name"]}`}
                              styles={{ menu: (base) => ({ ...base, minWidth: 300 }) }}
                              getOptionValue={(opt) => `${opt["id"]}`}
                              onChange={(tob) => {
                                setValue(`lines.${index}.lotId`, tob.id);
                              }}
                            />
                          )}
                          name={`lines.${index}.lotId` as const}
                          control={control}

                          // {...register(`lines.${index}.accountDebit`)}
                        />
                        {errors && errors.lines?.[index].lotId ? (
                          <Form.Text className="text-danger">{errors.lines?.[index].lotId["message"]}</Form.Text>
                        ) : null}
                        {/* <FormFieldReactSelect
                        // vertical
                        noLabel
                        label={"classeur"}
                        onChange={(tob) => {
                          console.log(tob);
                          setValue(`lines.${index}.accountDebit`, +tob.value);
                          setSelectedAccountDebit(tob.value);
                        }}
                        options={accounts}
                        selected={selectedAccountDebit}
                       c
                        errors={errors}
                        control={control}
                        // {...register(`lines.${index}.accountDebit`)}
                      /> */}
                      </td>

                      <td>
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
        </div>
      </form>
      <ModalConfirm
        title={"Attention action incorrecte"}
        show={modal}
        onCloseModal={() => setModal(false)}
        onApprove={() => setModal(false)}
        approveLabel={"ok"}
        approveVariant={"success"}
        content={`Les quantités encodées <b>${totalQtities}</b> sont supérieur aux quantités <b>${tob.saleProduct.qtityOdr}</b>  commandées`}
      />
    </>
  );
};

export default AddSpQtityissueLot;
