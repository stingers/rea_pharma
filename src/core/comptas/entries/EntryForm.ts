import * as yup from "yup";

import hlpForm from "../../../shared/forms/hlpForm";

yup.addMethod(yup.number, "requiredIf", function (list, message) {
  return this.test("requiredIf", message, function (value) {
    const { path, createError } = this;

    // check if any in list contain value
    // true : one or more are contains a value
    // false: none contain a value
    var anyHasValue = list.some((value) => {
      // return `true` if value is not empty, return `false` if value is empty
      //@ts-ignore
      return Boolean(document.querySelector(`input[name="${value}"]`).value);
    });

    // returns `CreateError` current value is empty and no value is found, returns `false` if current value is not empty and one other field is not empty.
    return !value && !anyHasValue ? createError({ path, message }) : true;
  });
});

export interface EntryLineForm {
  id?: number;
  accountCredit?: number;
  accountDebit?: number;
  amountCredit: number;
  amountDebit: number;
  designation: string;
}
export interface EntryForm {
  id?: number;
  proof: string;
  // proof: string;
  entryDate: string | Date;
  catId: number;
  lines: EntryLineForm[];
}

export const EntrySchema = yup.object({
  entryDate: yup.string(),
  proof: hlpForm.yupRequiredString(),
  catId: hlpForm.yupRequiredNumber(),
  lines: yup.array().of(
    yup.object({
      accountDebit: yup
        .number()
        .nullable()
        .transform((_, val) => (val === Number(val) ? val : null)),

      /* accountDebit: yup.number().when("accountCredit", {
        is: (value) => value === null,
        then: () => yup.number().required(),
        // otherwise: (value) => (value = null),
      }), */
      // accountCredit: yup.number(),
      accountCredit: yup
        .number()
        .nullable()
        .transform((_, val) => (val === Number(val) ? val : null)),
      /* accountCredit: yup.number().when("accountDebit", {
        is: (value) => value === null,
        then: () => yup.number().required(),
        // otherwise: (value) => (value = null),
      }), */
      amountDebit: hlpForm.yupNoRequiredNumber(),
      amountCredit: hlpForm.yupNoRequiredNumber(),
      designation: yup.string().required(),
    })
  ),

  /* lines: yup.array().of(
    yup.object({
      accountDebit: yup.number(),
      accountCredit: yup.number(),
      amountDebit: yup.number().when("accountDebit", {
        is: (value) => value !== undefined || value !== null,
        then: () => hlpForm.yupRequiredNumber(),
        otherwise: () => hlpForm.yupNoRequiredNumber(),
      }),
      // amountCredit: yup.number(),
      amountCredit: yup.number().when("accountCredit", {
        is: (valCredit) => valCredit !== undefined || valCredit !== null,
        then: () => hlpForm.yupRequiredNumber(),
        otherwise: () => hlpForm.yupNoRequiredNumber(),
      }),
      designation: hlpForm.yupRequiredString(),
    })
  ), */
});
