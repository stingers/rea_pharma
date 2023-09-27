import { yupResolver } from "@hookform/resolvers/yup";
import { BtnSubmit, FormErrors, FormField, FormPropsType } from "asv-hlps-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import httpService from "../../services/httpService";
import { Toastify } from "../../shared/helpers/Toastify";

const ChangePasswd = ({ tob, onCancelForm, onSubmitForm }: FormPropsType<any>) => {
  const navigate = useNavigate();
  const schema = yup.object({
    // oldPasswd: hlpForm.hlpForm.yupRequiredString(),
    oldPassword: yup.string().trim().required(FormErrors.REQUIRED),
    // oldPasswd: hlpForm.hlpForm.yupRequiredString(),
    // newPasswd: hlpForm.hlpForm.yupRequiredString().min(8, "minimum 8 caractères"),
    newPassword: yup.string().trim().required(FormErrors.REQUIRED).min(8, "minimum 8 caractères"),
    confirmPassword: yup
      .string()
      .trim()
      .oneOf([yup.ref("newPassword"), null], "Passwords must match"),
  });

  type FormType = yup.InferType<typeof schema>;
  const {
    handleSubmit,
    register,
    control,
    formState: { errors, isValid },
    reset,
  } = useForm<FormType>({
    defaultValues: {},
    resolver: yupResolver<any>(schema),
    mode: "onChange",
  });

  const formSubmit = (values) => {
    httpService
      .postBody(values, "users/registers/changePassword")
      .then(({ status }) => {
        if (status === 204) {
          onSubmitForm(status);
        }

        // Logout;
      })
      .catch((error) => {
        Toastify.error();
      });
  };

  return (
    <form onSubmit={handleSubmit(formSubmit)} className="px-2 text-uppercase fs-6">
      <FormField labelColSize={5} name="oldPassword" control={control} errors={errors} label="ancien mot de passe" register={register} />

      <FormField labelColSize={5} name="newPassword" control={control} errors={errors} label="nouveau mot de passe" register={register} />

      <FormField
        labelColSize={5}
        name="confirmPassword"
        control={control}
        errors={errors}
        label="confirmer le mot de passe"
        register={register}
      />

      <hr className="my-1" />
      <div className="text-end mt-2  ">
        <BtnSubmit size="sm" onCancel={onCancelForm} disabled={!isValid} />
        {/* <BtnSubmit size="sm" onCancel={onCancelForm} disabled={isValid} /> */}
      </div>
    </form>
  );
};

export default ChangePasswd;
