import * as yup from "yup";

import { FormErrors } from "../../../shared/forms/FormErrors";
import hlpForm from "../../../shared/forms/hlpForm";

export const UserForm = (tob?: any) => {
  return yup.object({
    address: hlpForm.yupNoRequiredString(),
    birthday: hlpForm.yupNoRequiredString(),

    codeCompta: hlpForm.yupNoRequiredString(),
    cityId: yup.number().notRequired().nullable(),
    countryId: yup.number().required(FormErrors.REQUIRED),
    cp: hlpForm.yupNoRequiredNumber(),
    // email: yupValideUniqEmail("users/checkUniqueEmail", tob),
    // email: yupValideNoRequiredUniqEmail("users/checkUniqueEmail", tob),
    email: yup.string().email().notRequired().nullable(),
    firstname: yup.string().required(FormErrors.REQUIRED),
    genderId: yup.number().required(FormErrors.REQUIRED),
    hasBillSafe: yup.bool(),
    isActive: yup.bool(),
    isBadPayer: yup.bool(),
    isEqeerUser: yup.bool(),
    isSpecial: yup.bool(),
    isValided: yup.bool(),
    lastname: yup.string().required(FormErrors.REQUIRED),
    limitAmountSaleByMonth: hlpForm.yupNoRequiredNumber(),
    limitAmountSaleIsActive: yup.bool(),
    periodBill: yup.string().required(FormErrors.REQUIRED),
    phoneP: hlpForm.yupValideUniqName("users/checkUniquePhone", tob),
    // phoneS: hlpForm.yupNoRequiredString()
    phoneS: hlpForm.yupNoRequiredString(),
    regionId: yup.number().notRequired().nullable(),
    titrId: yup.number(),
    username: yup.string(),
  });
};
