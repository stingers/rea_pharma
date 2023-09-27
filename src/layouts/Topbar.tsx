import classNames from "classnames";
import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";

import logo from "../assets/images/logos/akofa-logo-pharma.svg";
import logoWithText from "../assets/images/logos/akofa-logo-text-pharma.svg";
import textOfLogo from "../assets/images/logos/akofa-text-pharma.svg";
import AuthContext from "../auth/hooks/authContext";
import { ADM, PHD, TLM_COM } from "../auth/services/auth-menu";
import authService from "../auth/services/authService";
import TopbarBilan from "../core/cashs/topbar/topbar-bilan";
import { TopbarPayment } from "../core/cashs/topbar/topbar-payment";
import TopCart from "../core/stores/carts/topbar-cart";
import { useShopCartContext } from "../core/stores/shops/shop-cart-context";
import { ProfileMenus } from "../core/users/profiles/profile-menus";
import { TopbarDuties } from "../core/utilities/duties/topbar-duties";
import AddWish from "../core/utilities/wishes/add-wish";
import useRedux from "../hooks/useRedux";
import { changeSidebarType, showRightSidebar } from "../redux/actions";
import { TobBarDropType } from "../shared/top-bar-dropdown";
import { LayoutTypes, SideBarTypes } from "./constants/layout";
import MaximizeScreen from "./topbar/MaximizeScreen";
import Notifications from "./topbar/Notifications";
import ProfileDropdown from "./topbar/ProfileDropdown";

export interface NotificationItem {
  id: number;
  text: string;
  subText: string;
  icon?: string;
  avatar?: string;
  bgColor?: string;
}

export interface ProfileMenuItem {
  label: string;
  icon: string;
  badge?: { variant: string; text: string };
  redirectTo: string;
}

// get the notifications

// get the profilemenu

interface TopbarProps {
  hideLogo?: boolean;
  navCssClasses?: string;
  openLeftMenuCallBack?: () => void;
  topbarDark?: boolean;
}

const drops: TobBarDropType[] = [
  { icon: "fe-bar-chart", link: "/dash/bills/payments", tooltip: "point du jour" },
  { icon: "fas fa-wallet", link: "/dash/bills/payments", tooltip: "point du jour" },
];

const Topbar = ({ hideLogo, navCssClasses, openLeftMenuCallBack, topbarDark }: TopbarProps) => {
  const { dispatch, appSelector } = useRedux();

  const [isopen, setIsopen] = useState<boolean>(false);

  const authUser = useContext(AuthContext);

  const navbarCssClasses: string = navCssClasses || "";
  const containerCssClasses: string = !hideLogo ? "container-fluid" : "";

  const { layoutType, leftSideBarType } = appSelector((state) => ({
    layoutType: state.Layout.layoutType,
    leftSideBarType: state.Layout.leftSideBarType,
  }));

  const { cartItems } = useShopCartContext();

  /**
   * Toggle the leftmenu when having mobile screen
   */
  const handleLeftMenuCallBack = () => {
    setIsopen(!isopen);
    if (openLeftMenuCallBack) openLeftMenuCallBack();
  };

  /**
   * Toggles the right sidebar
   */
  const handleRightSideBar = () => {
    dispatch(showRightSidebar());
  };

  /**
   * Toggles the left sidebar width
   */
  const toggleLeftSidebarWidth = (e) => {
    e.stopPropagation();
    if (leftSideBarType === "default" || leftSideBarType === "compact")
      dispatch(changeSidebarType(SideBarTypes.LEFT_SIDEBAR_TYPE_CONDENSED));
    if (leftSideBarType === "condensed") dispatch(changeSidebarType(SideBarTypes.LEFT_SIDEBAR_TYPE_DEFAULT));
  };

  return (
    <React.Fragment>
      <div className={`navbar-custom ${navbarCssClasses}`}>
        <div className={containerCssClasses}>
          {!hideLogo && (
            <div className="logo-box">
              <Link to="/dash" className="logo logo-dark text-center">
                <span className="logo-sm">
                  {/* <img src={logoSmDark} alt="" height="24" /> */}
                  <img src={logo} alt="" height="40" />
                </span>
                <span className="logo-lg">
                  {/* <img src={layoutType === LayoutTypes.LAYOUT_TWO_COLUMN ? logoDark2 : logoDark} alt="" height="20" /> */}
                  <img src={layoutType === LayoutTypes.LAYOUT_TWO_COLUMN ? textOfLogo : logoWithText} alt="" height="40" />
                </span>
              </Link>
              <Link to="/dash" className="logo logo-light text-center">
                <span className="logo-sm">
                  {/* <img src={logoSm} alt="" height="24" /> */}
                  <img src={logo} alt="" height="40" />
                </span>
                <span className="logo-lg">
                  {/* <img src={layoutType === LayoutTypes.LAYOUT_TWO_COLUMN ? logoLight2 : logoLight} alt="" height="20" /> */}
                  <img src={layoutType === LayoutTypes.LAYOUT_TWO_COLUMN ? textOfLogo : logoWithText} alt="" height="40" />
                </span>
              </Link>
            </div>
          )}

          <ul className="list-unstyled topnav-menu float-end mb-0">
            {/* <li className="d-none d-lg-block">
              <TopbarSearch />
            </li> */}

            {/* <li className="dropdown d-inline-block d-lg-none">
              <SearchDropdown />
            </li> */}

            <li className="dropdown d-none d-lg-inline-block">
              <MaximizeScreen />
            </li>
            {/* users duties */}

            {authService.getAuth({ steGrps: ["cpa", "eqeer"] }) && (
              <li className="dropdown d-none d-lg-inline-block">
                <TopbarDuties />
              </li>
            )}
            {/* bilan */}
            {authService.getAuth({ roles: [...ADM, "cai"] }) && (
              <li className="dropdown d-none d-lg-inline-block">
                <TopbarBilan />
              </li>
            )}
            {/* payments */}

            {authService.getAuth({ roles: [...ADM, "cai"] }) && (
              <li>
                <TopbarPayment />
              </li>
            )}
            {/* shopping cart*/}
            {/* {authService.getAuth({ roles: [...ADM, "cai"] }) && ( */}
            {authService.getAuth({ roles: [...PHD, ...TLM_COM, "cai"], client: { roles: ["ceo"] } }) && (
              <li className="dropdown d-none d-lg-inline-block">
                <TopCart count={cartItems.length} />
              </li>
            )}

            {/* // ------ notification ------ */}

            {authService.getAuth({ roles: [...PHD, "cai"] }) && (
              <li className="dropdown d-none d-lg-inline-block">
                <Notifications notifications={undefined} />
              </li>
            )}
            {/* // ------ wish ------ */}
            <li className="dropdown d-none d-lg-inline-block">
              <AddWish />
            </li>

            <li className="dropdown notification-list topbar-dropdown">
              <ProfileDropdown
                // profilePic={avatar(authUser)}
                gender={authUser.gender}
                menuItems={ProfileMenus}
                username={authUser?.fullname}
                userTitle={authUser.role.code}
              />
            </li>
            {authService.getAuth({ roles: ["sadm"] }) && (
              <li className="dropdown notification-list">
                <Link to="#" className="nav-link dropdown-toggle right-bar-toggle waves-effect waves-light" onClick={handleRightSideBar}>
                  <i className="fe-settings noti-icon"></i>
                </Link>
              </li>
            )}
          </ul>

          <ul className="list-unstyled topnav-menu topnav-menu-left m-0">
            {layoutType !== LayoutTypes.LAYOUT_HORIZONTAL && (
              <li>
                {/* <button className="button-menu-mobile waves-effect waves-light d-none d-lg-block" onClick={toggleLeftSidebarWidth}> */}
                <button
                  className="button-menu-mobile waves-effect waves-light d-none d-lg-block"
                  onClick={(e) => toggleLeftSidebarWidth(e)}>
                  <i className="fe-menu"></i>
                </button>
              </li>
            )}

            <li>
              <button className="button-menu-mobile open-left d-lg-none d-bolck waves-effect waves-light" onClick={handleLeftMenuCallBack}>
                <i className="fe-menu" />
              </button>
            </li>

            {/* Mobile menu toggle (Horizontal Layout) */}
            <li>
              <Link
                to="#"
                className={classNames("navbar-toggle nav-link", {
                  open: isopen,
                })}
                onClick={handleLeftMenuCallBack}>
                <div className="lines">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Topbar;
