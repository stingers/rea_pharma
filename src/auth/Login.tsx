// components
import { yupResolver } from "@hookform/resolvers/yup";
import { t } from "i18next";
import { Button, Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import * as yup from "yup";

import { FormInput, VerticalForm } from "../auth/form/";
import httpService from "../services/httpService";
import AuthLayout from "./AuthLayout";
import authService from "./services/authService";

interface LoginForm {
  username: string;
  password: string;
}

/* bottom links */
const BottomLink = () => {
  useTranslation();

  return (
    <Row className="mt-3">
      <Col xs={12} className="text-center">
        <p className="text-muted">
          <Link to="/auth/forget-password" className="text-muted ms-1">
            Forgot your password?
          </Link>
        </p>
        <p className="text-muted">
          Don't have an account?
          <Link to={"/auth/register"} className="text-primary fw-bold ms-1">
            Sign Up
          </Link>
        </p>
      </Col>
    </Row>
  );
};

const Login = () => {
  // const { t } = useTranslation();

  /*
    form validation schema
    */
  const schemaResolver = yupResolver<any>(
    yup.object({
      username: yup.string().required(t("Please enter username")),
      password: yup.string().required(t("Please enter Password")),
    })
  );

  const location: any = useLocation();
  const redirectUrl = location?.state?.from?.pathname || "/dash";

  /*
    handle form submission
    */
  const onSubmit = async (form: LoginForm) => {
    try {
      const hasToken = await authService.login(form, httpService);
      if (hasToken) {
        window.location = redirectUrl;
        // navigate(redirectUrl, { replace: true });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {/* {(userLoggedIn || user) && <Navigate to={redirectUrl} />} */}

      <AuthLayout helpText={t("Veuillez vous connecter avec votre identifiant et password")} bottomLinks={<BottomLink />}>
        {/* {error && (
          <Alert variant="danger" className="my-2">
            {error}
          </Alert>
        )} */}

        {/* <VerticalForm<LoginForm> onSubmit={onSubmit} resolver={schemaResolver} defaultValues={""}> */}
        <VerticalForm<LoginForm> onSubmit={onSubmit} resolver={schemaResolver} defaultValues={""}>
          <FormInput
            // type="email"
            name="username"
            label={t("Username")}
            // placeholder={t("hello@coderthemes.com")}
            containerClass={"mb-2"}
          />
          <FormInput
            label={t("Password")}
            type="password"
            name="password"
            // placeholder="Enter your password"
            containerClass={"mb-2"}></FormInput>

          {/* <FormInput type="checkbox" name="checkbox" label={t("Remember me")} containerClass={"mb-3"} defaultChecked /> */}

          <div className="text-center d-grid">
            {/* <Button variant="primary" type="submit" disabled={loading}> */}
            <Button variant="primary" type="submit">
              Log In
            </Button>
          </div>
        </VerticalForm>

        {/* <div className="text-center">
          <h5 className="mt-3 text-muted">{t("Sign in with")}</h5>
          <SocialLinks />
        </div> */}
      </AuthLayout>
    </>
  );
};

export default Login;
