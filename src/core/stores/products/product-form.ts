import * as yup from "yup";
import { setLocale } from "yup";

import hlpForm from "../../../shared/forms/hlpForm";

setLocale({
  mixed: {
    default: "Ce champ est requis",
  },
  number: {
    min: "caratère min ${min}",
  },
});

export interface ProductStoreForm {
  discountRate: number;
  fees: number; // frais
  id?: number;
  isActive: boolean;
  isAvailable: boolean;
  isPublished: boolean;
  pght: number;
  profit: number; // marge
  profitPhcie: number; // marge
  publicPrice: number;
  pvdPrice: number;
  qtityLimit: number;
  stockLimit?: number;
  stockMax?: number;
  stockReappro?: number;
  stockReserved?: number;
  stockSalable?: number;
  tva: number;
}

export interface ProductForm {
  agcyId: number;
  catId: number;
  codeCip7?: string;
  codeCompta?: number;
  codeEan?: string;
  codeHs?: string;
  codeInam?: string;
  dciId?: number;
  description?: string;
  designation: string;
  dosId?: number;
  fgId?: number;
  id?: number;
  image?: string;
  inEqeer: boolean;
  inPharma: boolean;
  laboId: number;
  locId?: number;
  // promoEndAt: Date;
  // promoPerQtity: number;
  pvdId: number;
  qtityPerBox: number;
  qtityPerPackaging: number;
  ref: string;
  sofId: number;
  // sold: number;
  tclId: number;
  tva: number;
  store: ProductStoreForm;
}
export const ProductSchema = yup.object({
  // dciId: hlpForm.yupRequiredNumber(),
  // dciId: hlpForm.yupNoRequiredNumber(),
  designation: hlpForm.yupRequiredString(),
  // designation: hlpForm.yupValideUniqName("products/checkUniqueDesignation", tob),
  ref: hlpForm.yupRequiredString(),

  // ref: hlpForm.yupValideUniqName("products/checkUniqueRef", tob),
  // promoEndAt
  // promoPerQtity
  // tclId: hlpForm.yupRequiredNumber(),
  agcyId: hlpForm.yupRequiredNumber(),
  catId: hlpForm.yupRequiredNumber(),
  codeCip7: hlpForm.yupNoRequiredString().nullable(),
  codeCompta: hlpForm.yupNoRequiredNumber(),
  codeEan: yup.string().nullable(),
  codeHs: hlpForm.yupNoRequiredString().nullable().default(null),
  codeInam: hlpForm.yupNoRequiredString().nullable(),
  description: hlpForm.yupNoRequiredString(),
  dosId: hlpForm.yupNoRequiredNumber(),
  dciId: hlpForm.yupNoRequiredNumber(),
  fgId: hlpForm.yupNoRequiredNumber(),
  image: hlpForm.yupNoRequiredString(),
  inEqeer: yup.boolean(),
  inPharma: yup.boolean().default(true),
  laboId: hlpForm.yupRequiredNumber(),
  locId: hlpForm.yupNoRequiredNumber(),
  pvdId: hlpForm.yupRequiredNumber(),
  qtityPerBox: hlpForm.yupNoRequiredNumber(),
  qtityPerPackaging: hlpForm.yupNoRequiredNumber(),
  // sofId: hlpForm.yupNoRequiredNumber(),
  sofId: yup.number().required(),
  tclId: hlpForm.yupNoRequiredNumber(),
  tva: hlpForm.yupRequiredNumber().default(0),
  store: yup.object({
    // id: yup.number(),
    discountRate: hlpForm.yupRequiredNumber().default(0),
    fees: hlpForm.yupRequiredNumber().default(0),
    isActive: yup.bool().default(true),
    isAvailable: yup.bool().default(true),
    isPublished: yup.bool().default(false),
    pght: hlpForm.yupRequiredNumber().default(1),
    profit: hlpForm.yupRequiredNumber().default(0),
    profitPhcie: hlpForm.yupRequiredNumber().default(0),
    publicPrice: hlpForm.yupRequiredNumber().default(0),
    pvdPrice: hlpForm.yupRequiredNumber().default(0),
    qtityLimit: hlpForm.yupRequiredNumber().default(0),
    stockLimit: hlpForm.yupRequiredNumber().default(0),
    stockMax: hlpForm.yupRequiredNumber().default(0),
    stockReappro: hlpForm.yupRequiredNumber().default(0),
    stockReserved: hlpForm.yupRequiredNumber().default(0),
    stockSalable: hlpForm.yupRequiredNumber().default(0),
    // tva: hlpForm.yupRequiredNumber().default(0),
  }),
});
export const ProductForm = (tob) => {
  return;
};
