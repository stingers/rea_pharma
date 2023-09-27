import * as yup from "yup";

import { FormErrors } from "../../../../shared/forms/FormErrors";

export interface InventoryForm {
  id?: number;
  qtity: number;
  inId: number;
}

export interface ProductInventoryForm {
  lines: InventoryForm[];
}

export const ProductInventorySchema = yup.object({
  lines: yup.array().of(
    yup.object().shape({
      qtity: yup.number().required(FormErrors.REQUIRED).typeError(FormErrors.DIGIT),
      inId: yup.number().required(FormErrors.REQUIRED),
    })
  ),
});
