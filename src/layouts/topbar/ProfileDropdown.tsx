import { Gender } from "asv-hlps";
import classNames from "classnames";
import React, { useState } from "react";
import { Badge, Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";

// types
import { ProfileMenuItem } from "../../layouts/Topbar";
import UserAvatar from "../../shared/components/user-avatar";

interface ProfileDropdownProps {
  menuItems: ProfileMenuItem[];
  profilePic?: string;
  username: string;
  userTitle?: string;
  gender?: Gender;
}

const ProfileDropdown = (props: ProfileDropdownProps) => {
  const profilePic = props["profilePic"] || null;
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

  /*
   * toggle profile-dropdown
   */
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <Dropdown show={dropdownOpen} onToggle={toggleDropdown}>
      <Dropdown.Toggle
        id="dropdown-profile"
        as="a"
        onClick={toggleDropdown}
        className={classNames("nav-link", "nav-user", "me-0", "waves-effect", "waves-light", {
          show: dropdownOpen,
        })}>
        {/* <img src={profilePic!} className="rounded-circle" alt="" />  */}
        <UserAvatar gender={props["gender"]} className="rounded-circle" nowrap={false} />
        <span className="pro-user-name ms-1">
          {props["username"]} <i className="mdi mdi-chevron-down"></i>
        </span>
      </Dropdown.Toggle>
      <Dropdown.Menu className="dropdown-menu-end profile-dropdown">
        <div onClick={toggleDropdown}>
          {/* <div className="dropdown-header noti-title">
            <h6 className="text-overflow m-0">Welcome !</h6>
          </div> */}
          {(props.menuItems || []).map((item, i) => {
            return (
              <React.Fragment key={i}>
                {i === props["menuItems"].length - 1 && <div className="dropdown-divider my-0"></div>}
                <Link to={item.redirectTo} className="dropdown-item notify-item " key={i + "-profile-menu"}>
                  <i className={`${item.icon} me-1`}></i>
                  <span>
                    {item.label}
                    {item.badge && (
                      <Badge bg={item.badge.variant} className="float-end">
                        {item.badge.text}
                      </Badge>
                    )}
                  </span>
                </Link>
              </React.Fragment>
            );
          })}
        </div>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default ProfileDropdown;
