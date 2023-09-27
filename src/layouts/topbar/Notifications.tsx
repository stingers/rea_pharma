import useReadonlyFetchTobs from "asv-hlps-react/lib/cjs/reacts/hooks/uses/useReadonlyFetchTobs";
import classNames from "classnames";
import { useState } from "react";
import { Badge, Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";

import httpService from "../../services/httpService";
import Scrollbar from "../../shared/components/Scrollbar";
import { NotificationItem } from "../Topbar";

// components

// notifiaction continer styles
const notificationContainerStyle = {
  maxHeight: "230px",
  display: "none",
};

const notificationShowContainerStyle = {
  maxHeight: "230px",
};

interface NotificationDropdownProps {
  notifications: Array<NotificationItem>;
}

interface NotificationContainerStyle {
  maxHeight?: string;
  display?: string;
}

const Notifications = (props: NotificationDropdownProps) => {
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [notificationContentStyle, setNotificationContentStyles] = useState<NotificationContainerStyle>(notificationContainerStyle);

  /*
   * toggle notification-dropdown
   */
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
    setNotificationContentStyles(
      notificationContentStyle === notificationContainerStyle ? notificationShowContainerStyle : notificationContainerStyle
    );
  };

  const { tobs } = useReadonlyFetchTobs(httpService, "spqtityissues/countnotreat");

  return (
    <Dropdown show={dropdownOpen} onToggle={toggleDropdown}>
      <Dropdown.Toggle
        id="dropdown-notification"
        as="a"
        onClick={toggleDropdown}
        className={classNames("nav-link", "waves-effect", "waves-light", {
          show: dropdownOpen,
        })}>
        <i className="fe-bell noti-icon"></i>
        <span className="badge bg-danger rounded-circle noti-icon-badge ">{tobs["issues"]}</span>
      </Dropdown.Toggle>
      <Dropdown.Menu className="dropdown-menu-end dropdown-lg">
        <div onClick={toggleDropdown}>
          <div className="dropdown-item noti-title">
            <h5 className="m-0 text-center fw-bold">
              {/* <span className="float-end">
                <Link to="#" className="text-dark">
                  <small>Clear All</small>
                </Link>
              </span> */}
              Notifications
            </h5>
          </div>
          <Scrollbar style={notificationContentStyle}>
            <Link
              to="/dash/stores/products/qtityissues/noTreat"
              state={{ tabId: "stores_products", tabChildId: "stores_products_sp-qtityissues" }}
              className="dropdown-item notify-item">
              <p className="notify-details fw-bold">
                {"Problème sur les quantités"}
                <Badge className="float-end" bg="danger">
                  {tobs["issues"]}
                </Badge>
              </p>
            </Link>
          </Scrollbar>

          {/* <Link to="/" className="dropdown-item text-center text-primary notify-item notify-all">
            View All <i className="fe-arrow-right"></i>
          </Link> */}
        </div>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default Notifications;
