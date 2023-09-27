import { yupResolver } from "@hookform/resolvers/yup";
import { t } from "i18next";
import { useEffect } from "react";
import { Alert, Button, Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import * as yup from "yup";

// components
import { FormInput, VerticalForm } from "../auth/form/";
// hooks
import { useRedux } from "../hooks/";
//actions
import { forgotPassword, resetAuth } from "../redux/actions";
import AuthLayout from "./AuthLayout";

interface UserData {
  email: string;
}

/* bottom link */
const BottomLink = () => {
  useTranslation();

  return (
    <Row className="mt-3">
      <Col className="text-center">
        <p className="text-muted">
          Back to
          <Link to={"/auth/login"} className="text-primary fw-medium ms-1">
            Log in
          </Link>
        </p>
      </Col>
    </Row>
  );
};

const ForgetPassword = () => {
  const { dispatch, appSelector } = useRedux();
  // const { t } = useTranslation();

  useEffect(() => {
    dispatch(resetAuth());
  }, [dispatch]);

  const { loading, passwordReset, resetPasswordSuccess, error } = appSelector((state) => ({
    loading: state.Auth.loading,
    user: state.Auth.user,
    error: state.Auth.error,
    passwordReset: state.Auth.passwordReset,
    resetPasswordSuccess: state.Auth.resetPasswordSuccess,
  }));

  /*
   * form validation schema
   */
  const schemaResolver = yupResolver(
    yup.object({
      email: yup.string().required(t("Please enter Email")).email(t("Please enter Email")),
    })
  );

  /*
   * handle form submission
   */
  const onSubmit = (formData: UserData) => {
    dispatch(forgotPassword(formData["email"]));
  };

  return (
    <>
      <AuthLayout
        helpText={t("Enter your email address and we'll send you an email with instructions to reset your password.")}
        bottomLinks={<BottomLink />}>
        {resetPasswordSuccess && <Alert variant="success">{resetPasswordSuccess.message}</Alert>}

        {error && !resetPasswordSuccess && (
          <Alert variant="danger" className="my-2">
            {error}
          </Alert>
        )}

        {!passwordReset && (
          // <VerticalForm<UserData> onSubmit={onSubmit} resolver={schemaResolver}>
          <VerticalForm<UserData> onSubmit={onSubmit}>
            <FormInput label={t("Email address")} type="email" name="email" placeholder={t("Enter your email")} containerClass={"mb-3"} />

            <div className="d-grid text-center">
              <Button type="submit" disabled={loading}>
                Reset Password
              </Button>
            </div>
          </VerticalForm>
        )}
      </AuthLayout>
    </>
  );
};

export default ForgetPassword;
