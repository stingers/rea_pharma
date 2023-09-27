import * as yup from "yup";

export const SteForm = yup.object({
  approval: yup.string(),
  approvalExpDate: yup.string(),
  grpId: yup.number().required("This value is required."),
  name: yup.string().required("This value is required."),
  nif: yup.string(),
  shortname: yup.string(),
});
