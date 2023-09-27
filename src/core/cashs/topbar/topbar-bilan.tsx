import DisplayTooltip from "asv-hlps-react/lib/cjs/reacts/displays/display-tooltip";
import { Dropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const TopbarBilan = () => {
  const navigate = useNavigate();
  const navigateTo = () => {
    navigate("/dash/cashs/bilans", { state: { tabId: "cash_bilan" } });
  };
  return (
    <Dropdown>
      <Dropdown.Toggle as="a" onClick={navigateTo} className="nav-link arrow-none waves-effect waves-light maximize-icon">
        <DisplayTooltip content={"point du jour"}>
          <i className="fe-bar-chart noti-icon text-white"></i>
          {/* <i className="fas fa-bar-chart noti-icon text-white"></i> */}
        </DisplayTooltip>
      </Dropdown.Toggle>
    </Dropdown>
  );
};

export default TopbarBilan;
