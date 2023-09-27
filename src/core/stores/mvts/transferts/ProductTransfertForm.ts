import * as yup from "yup";

import { FormErrors } from "../../../../shared/forms/FormErrors";

export interface TransfertForm {
  id?: number;
  qtity: number;
  comment: string;
  reasonId: number;
  inId: number;
}

export interface ProductTransfertForm {
  lines: TransfertForm[];
}

export const ProductTransfertSchema = yup.object({
  lines: yup.array().of(
    yup.object().shape({
      qtity: yup.number().required(FormErrors.REQUIRED).typeError(FormErrors.DIGIT),
      reasonId: yup.number().required(FormErrors.REQUIRED),
      inId: yup.number().required(FormErrors.REQUIRED),
      comment: yup.string(),
    })
  ),
});
