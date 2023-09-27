import * as yup from "yup";

import { SteForm } from "./ste-form";
import { UserForm } from "./user-form";

export const UserSteForm = (tob: any) => {
  return UserForm(tob).shape({
    // id?:
    ste: SteForm,
    zoneId: yup.number(),
  });
};
