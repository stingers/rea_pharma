import DisplayTooltip from "asv-hlps-react/lib/cjs/reacts/displays/display-tooltip";
import { Dropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export const TopbarDuties = () => {
  const navigate = useNavigate();
  const navigateTo = () => {
    navigate("/dash/cashs/payments", { state: { tabId: "cash_payments" } });
  };
  return (
    <Dropdown>
      {/* <Dropdown.Toggle as="a" onClick={navigateTo} className="nav-link arrow-none waves-effect waves-light maximize-icon"> */}
      <Dropdown.Toggle
        as="a"
        onClick={() => navigate("/dash/cashs/payments", { state: { tabId: "cash_payments" } })}
        className="nav-link arrow-none waves-effect waves-light maximize-icon">
        <DisplayTooltip content={"phatmacies de garde"}>
          <i className="mdi mdi-pharmacy noti-icon text-white"></i>
        </DisplayTooltip>
      </Dropdown.Toggle>
    </Dropdown>
  );
};
