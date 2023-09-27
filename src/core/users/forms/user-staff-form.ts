import { FormErrors } from "asv-hlps-react";
import * as yup from "yup";

import { UserForm } from "./user-form";

export const UserStaffForm = (tob) => {
  return UserForm(tob).shape({
    roleId: yup.number().required(FormErrors.REQUIRED),
    hasRolesId: yup.array(),
    tagsId: yup.array<number[]>(),
  });
};
