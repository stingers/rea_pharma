import { yupResolver } from "@hookform/resolvers/yup";
import { BtnSubmit } from "asv-hlps-react";
import useReadonlyFetchTobs from "asv-hlps-react/lib/cjs/reacts/hooks/uses/useReadonlyFetchTobs";
import { Button, Form, Row, Table } from "react-bootstrap";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import Select from "react-select";

import httpService from "../../../../services/httpService";
import { InventoryForm, ProductInventoryForm, ProductInventorySchema } from "./ProductInventoryForm";

const removeDuplicates = (tab: any[]) => {
  return tab.filter((v, i, a) => a.findIndex((t) => t.lot === v.lot && t.stores[0].name === v.stores[0].name && t.qtity === v.qtity) === i);
};
const AdditProductInventory = ({ tob, onCancelForm, onSubmit }) => {
  let { tobs: lots } = useReadonlyFetchTobs(httpService, "productins/lots", { param: +tob?.id });
  // lots = removeDuplicates(lots);

  const {
    handleSubmit,
    register,
    control,
    formState: { errors, isValid },
    reset,
    setValue,
    watch,
  } = useForm<ProductInventoryForm>({
    defaultValues: { lines: [{}] },
    resolver: yupResolver<any>(ProductInventorySchema),
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

  const line: InventoryForm = null;

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
                  lot <span className="text-danger">*</span>
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
                    <td width={"5%"}>{index + 1}</td>
                    <td>
                      <Controller
                        render={({ field }) => (
                          <Select
                            options={lots}
                            getOptionLabel={(opt) => `${opt["lot"]} => ${opt["depot"].name} => ${opt["qtity"]}`}
                            getOptionValue={(opt) => `${opt["id"]}`}
                            styles={{ menu: (base) => ({ ...base, minWidth: 200 }) }}
                            onChange={(tob) => {
                              setValue(`lines.${index}.inId`, +tob.id);
                            }}
                            menuPosition={"fixed"}
                          />
                        )}
                        name={`lines.${index}.inId` as const}
                        control={control}
                      />
                      {errors && errors.lines?.[index].inId ? (
                        <Form.Text className="text-danger">{errors.lines?.[index].inId["message"]}</Form.Text>
                      ) : null}
                    </td>
                    <td width={"15%"}>
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

                    <td width={"3%"}>
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
  );
};

export default AdditProductInventory;
