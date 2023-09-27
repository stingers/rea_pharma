import * as yup from "yup";
import hlpForm from "../../../../shared/forms/hlpForm";

export interface LineForm {
  depotId: number;
  expirationDate: Date;
  id?: number;
  lot: string;
  manufDate?: Date;
  productId: number;
  published?: boolean;
  pvdPrice: number;
  qtity: number;
  qtityPerPackaging?: number;
}

export interface ProductInForm {
  lines: LineForm[];
}

export const ProducInSchema = yup.object({
  lines: yup.array().of(
    yup.object({
      depotId: hlpForm.yupRequiredNumber(),
      expirationDate: hlpForm.yupRequiredString(),
      lot: hlpForm.yupRequiredString(),
      manufDate: yup.string(),
      productId: hlpForm.yupRequiredNumber(),
      published: yup.boolean(),
      pvdPrice: hlpForm.yupRequiredNumber(),
      qtity: hlpForm.yupRequiredNumber(),
      // qtityPerPackaging: hlpForm.yupNoRequiredNumber(),
    })
  ),
});
