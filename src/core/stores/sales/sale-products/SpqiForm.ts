import * as yup from "yup";

export interface SpqiLineForm {
  qtity: number;
  lotId: number;
}
export interface SpqiForm {
  lines: SpqiLineForm[];
}

export const SpqiSchema = yup.object({
  lines: yup.array().of(
    yup.object().shape({
      lotId: yup.number().required(),
      qtity: yup.number().required(),
    })
  ),
});
