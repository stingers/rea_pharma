import { Link } from "react-router-dom";

import logo from "../../assets/images/logos/akofa-logo-pharma.svg";
import logoWithText from "../../assets/images/logos/akofa-logo-text-pharma.svg";

const LogoBox = () => {
  return (
    <>
      {/* logo */}
      <div className="logo-box">
        <Link to="/" className="logo logo-dark text-center">
          <span className="logo-sm">
            {/* <img src={logoSmDark} alt="" height="24" /> */}
            <img src={logo} alt="" height="40" />
          </span>
          <span className="logo-lg">
            {/* <img src={logoDark} alt="" height="20" /> */}
            <img src={logoWithText} alt="" height="40" />
          </span>
        </Link>

        <Link to="/" className="logo logo-light text-center">
          <span className="logo-sm">
            {/* <img src={logoSm} alt="" height="24" /> */}
            <img src={logo} alt="" height="40" />
          </span>
          <span className="logo-lg">
            {/* <img src={logoLight} alt="" height="20" /> */}
            <img src={logoWithText} alt="" height="40" />
          </span>
        </Link>
      </div>
    </>
  );
};

export default LogoBox;
