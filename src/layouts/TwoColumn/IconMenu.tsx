import classNames from "classnames";
import React from "react";
import { Link } from "react-router-dom";

// images
import logo from "../../assets/images/logos/akofa-logo-pharma.svg";
import Scrollbar from "../../shared/components/Scrollbar";

// components

/**
 * Renders the application menu
 */
interface Item {
  key: string;
  label: string;
  isTitle?: boolean;
  icon?: string;
  url?: string;
  badge?: {
    variant: string;
    text: string;
  };
  parentKey?: string;
  target?: string;
  children?: Item[];
}

interface AppMenuProps {
  menuItems: Item[];
  toggleMenu: (item: Item, show: boolean) => void;
  activeMenuItems: string[];
}

const IconMenu = ({ menuItems, toggleMenu, activeMenuItems }: AppMenuProps) => {
  const onMenuItemClick = (e: any, menuItem: Item) => {
    const hasChildren = menuItem.children! && menuItem.children.length;
    if (hasChildren) {
      e.preventDefault();
    }
    toggleMenu(menuItem, true);
  };

  return (
    <>
      <div className="sidebar-icon-menu h-100">
        {/* <Scrollbar style={{ maxHeight: "100%" }} timeout={500} scrollbarMaxSize={320}> */}
        <Scrollbar style={{ maxHeight: "100%" }}  scrollbarMaxSize={320}>
          <Link to="/" className="logo">
            <span>
              <img src={logo} alt="" height="28" />
            </span>
          </Link>

          <nav className="nav flex-column" id="two-col-sidenav-main">
            {(menuItems || []).map((item, index) => {
              const activeParent = activeMenuItems && activeMenuItems.length && activeMenuItems[activeMenuItems.length - 1] === item["key"];
              return (
                <Link
                  key={index}
                  className={classNames("nav-link", "nav-link-ref", {
                    active: activeParent,
                  })}
                  to={item.children! ? "/#" : item.url!}
                  title={item.label}
                  data-menu-key={item.key}
                  onClick={(e: any) => {
                    onMenuItemClick(e, item);
                  }}>
                  <i className={item.icon} />
                </Link>
              );
            })}
          </nav>
        </Scrollbar>
      </div>
    </>
  );
};

export default IconMenu;
