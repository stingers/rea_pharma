// images
import { Card, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

import logoWithText from "../assets/images/logos/akofa-logo-text-pharma.svg";

interface AccountLayoutProps {
  helpText?: string;
  bottomLinks?: any;
  isCombineForm?: boolean;
  children?: any;
}

const AuthLayout = ({ helpText, children, isCombineForm }: AccountLayoutProps) => {
  return (
    <>
      {/* <div className="account-pages mt-5 mb-5"> */}
      <div className="account-pages my-5">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={isCombineForm ? 9 : 4}>
              <Card>
                <Card.Body className="p-4">
                  <div className="text-center w-75 m-auto">
                    <div className="auth-logo">
                      <Link to="/" className="logo logo-dark text-center">
                        <span className="logo-lg">
                          {/* <img src={LogoDark} alt="" height="22" /> */}
                          <img src={logoWithText} alt="logo" height="24" />
                        </span>
                      </Link>

                      <Link to="/" className="logo logo-light text-center">
                        <span className="logo-lg">
                          {/* <img src={LogoLight} alt="" height="22" /> */}
                          <img src={logoWithText} alt="" height="24" />
                        </span>
                      </Link>
                    </div>
                    {helpText && <p className="text-muted mb-3 mt-2">{helpText}</p>}
                  </div>
                  {children}
                </Card.Body>
              </Card>

              {/* bottom links */}
              {/* {bottomLinks} */}
            </Col>
          </Row>
        </Container>
      </div>

      <footer className="footer footer-alt">
        {new Date().getFullYear()} &copy; Akofa'S Pharma by{" "}
        <Link to="#" className="text-dark">
          Stinger'S
        </Link>
      </footer>
    </>
  );
};

export default AuthLayout;
