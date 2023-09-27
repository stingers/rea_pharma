import { useEffect, useRef, useState } from "react";
import { Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";

import authService from "../auth/services/authService";
import { ProfileMenus } from "../core/users/profiles/profile-menus";
import { getMenuItems } from "../helpers/menu";
// components
import Scrollbar from "../shared/components/Scrollbar";
// helpers
import UserAvatar from "../shared/components/user-avatar";
import AppMenu from "./Menu";
import LogoBox from "./topbar/logo-box";

/* user box */
const UserBox = () => {
  // get the profilemenu
  // const authUser = useContext(AuthContext);
  const authUser = authService.authUser();

  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

  /*
   * toggle dropdown
   */
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className="user-box text-center">
      <UserAvatar gender={authUser?.gender} className={"rounded-circle avatar-md"} />
      {/* <img src={profileImg} alt="" title="Mat Helme" className="rounded-circle avatar-md" /> */}
      <Dropdown show={dropdownOpen} onToggle={toggleDropdown}>
        <Dropdown.Toggle
          id="dropdown-notification"
          as="a"
          onClick={toggleDropdown}
          className="cursor-pointer text-reset h5 mt-2 mb-1 d-block">
          {authUser.fullname}
        </Dropdown.Toggle>
        <Dropdown.Menu className="user-pro-dropdown">
          <div onClick={toggleDropdown}>
            {(ProfileMenus || []).map((item, index) => {
              return (
                <Link to={item.redirectTo} className="dropdown-item notify-item" key={index + "-profile-menu"}>
                  <i className={`${item.icon} me-1`}></i>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </Dropdown.Menu>
      </Dropdown>
      {/* <p className="text-reset">Admin Head</p> */}
    </div>
  );
};

/* sidebar content */
const SideBarContent = () => {
  return (
    <>
      <UserBox />

      <div id="sidebar-menu">
        <AppMenu menuItems={getMenuItems()} />
      </div>

      <div className="clearfix" />
    </>
  );
};

interface LeftSidebarProps {
  isCondensed: boolean;
}

const LeftSidebar = ({ isCondensed }: LeftSidebarProps) => {
  const menuNodeRef: any = useRef(null);

  /**
   * Handle the click anywhere in doc
   */
  const handleOtherClick = (e: any) => {
    if (menuNodeRef && menuNodeRef.current && menuNodeRef.current.contains(e.target)) return;
    // else hide the menubar
    if (document.body) {
      document.body.classList.remove("sidebar-enable");
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOtherClick, false);

    return () => {
      document.removeEventListener("mousedown", handleOtherClick, false);
    };
  }, []);

  return (
    <div className="left-side-menu" ref={menuNodeRef}>
      {/* logo */}
      <LogoBox />

      {!isCondensed && (
        // <Scrollbar style={{ maxHeight: "100%" }} timeout={500} scrollbarMaxSize={320}>
        <Scrollbar style={{ maxHeight: "100%" }} scrollbarMaxSize={320}>
          <SideBarContent />
        </Scrollbar>
      )}
      {isCondensed && <SideBarContent />}
    </div>
  );
};

LeftSidebar.defaultProps = {
  isCondensed: false,
};

export default LeftSidebar;
