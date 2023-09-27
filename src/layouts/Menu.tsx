import { User } from "asv-hlps";
import { checkAuth } from "asv-hlps-react";
import classNames from "classnames";
import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Collapse } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";

import AuthContext from "../auth/hooks/authContext";
import { findAllParent, findMenuItem } from "../helpers/menu";
import { MenuItemType } from "./constants/menu";

interface SubMenus {
  item: MenuItemType;
  linkClassName?: string;
  subMenuClassNames?: string;
  activeMenuItems?: Array<string>;
  toggleMenu?: (item: any, status: boolean) => void;
  className?: string;
  authUser?: User;
}

const MenuItemWithChildren = ({ item, linkClassName, subMenuClassNames, activeMenuItems, toggleMenu }: SubMenus) => {
  const [open, setOpen] = useState<boolean>(activeMenuItems!.includes(item.key));

  useEffect(() => {
    setOpen(activeMenuItems!.includes(item.key));
  }, [activeMenuItems, item]);

  const toggleMenuItem = (e: any) => {
    e.preventDefault();
    const status = !open;
    setOpen(status);
    if (toggleMenu) toggleMenu(item, status);
    return false;
  };

  return (
    <>
      <li className={classNames("side-nav-item", { "menuitem-active": open })}>
        <Link
          to="#"
          state={item.state}
          onClick={toggleMenuItem}
          data-menu-key={item.key}
          aria-expanded={open}
          className={classNames("has-arrow", "side-sub-nav-link", linkClassName, {
            "menuitem-active": activeMenuItems!.includes(item.key) ? "active" : "",
          })}>
          {item.icon && <i className={item.icon} />}
          {!item.badge ? (
            <span className="menu-arrow"></span>
          ) : (
            <span className={`badge bg-${item.badge.variant} rounded-pill float-end`}>{item.badge.text}</span>
          )}
          <span className="text-capitalize text-dark"> {item.label} </span>
        </Link>
        <Collapse in={open}>
          <div>
            <ul className={classNames(subMenuClassNames)}>
              {(item.children || []).map((child, i) => {
                return (
                  <React.Fragment key={i}>
                    {child.children ? (
                      <>
                        {checkAuth(child.auth) && (
                          <MenuItemWithChildren
                            item={child}
                            linkClassName={activeMenuItems!.includes(child.key) ? "active" : ""}
                            activeMenuItems={activeMenuItems}
                            subMenuClassNames="side-nav-third-level"
                            toggleMenu={toggleMenu}
                          />
                        )}
                      </>
                    ) : (
                      <>
                        {checkAuth(child.auth) && (
                          <MenuItem
                            item={child}
                            className={activeMenuItems!.includes(child.key) ? "menuitem-active" : ""}
                            linkClassName={activeMenuItems!.includes(child.key) ? "active" : ""}
                          />
                        )}
                      </>
                    )}
                  </React.Fragment>
                );
              })}
            </ul>
          </div>
        </Collapse>
      </li>
    </>
  );
};

const MenuItem = ({ item, className, linkClassName }: SubMenus) => {
  return (
    <li className={classNames("side-nav-item", className)}>
      <MenuItemLink item={item} className={linkClassName} />
    </li>
  );
};

const MenuItemLink = ({ item, className }: SubMenus) => {
  return (
    <Link
      to={item.url!}
      state={item?.state}
      target={item.target}
      className={classNames("side-nav-link-ref", "side-sub-nav-link", className)}
      data-menu-key={item.key}>
      {item.icon && <i className={item.icon} />}
      {item.badge && <span className={`badge bg-${item.badge.variant} float-end`}>{item.badge.text}</span>}
      <span className=" text-capitalize text-dark"> {item.label} </span>
    </Link>
  );
};

/**
 * Renders the application menu
 */
interface AppMenuProps {
  menuItems: MenuItemType[];
}

const AppMenu = ({ menuItems }: AppMenuProps) => {
  const authUser = useContext(AuthContext);
  let location = useLocation();

  const menuRef: any = useRef(null);

  const [activeMenuItems, setActiveMenuItems] = useState<Array<string>>([]);

  /*
   * toggle the menus
   */
  const toggleMenu = (menuItem: MenuItemType, show: boolean) => {
    if (show) setActiveMenuItems([menuItem["key"], ...findAllParent(menuItems, menuItem)]);
  };

  /**
   * activate the menuitems
   */
  const activeMenu = useCallback(() => {
    const div = document.getElementById("side-menu");
    let matchingMenuItem = null;

    if (div) {
      let items: any = div.getElementsByClassName("side-nav-link-ref");
      for (let i = 0; i < items.length; ++i) {
        if (location.pathname === items[i].pathname) {
          matchingMenuItem = items[i];
          break;
        }
      }

      if (matchingMenuItem) {
        const mid = matchingMenuItem.getAttribute("data-menu-key");
        const activeMt = findMenuItem(menuItems, mid);
        if (activeMt) {
          setActiveMenuItems([activeMt["key"], ...findAllParent(menuItems, activeMt)]);
        }
      }
    }
  }, [location, menuItems]);

  useEffect(() => {
    activeMenu();
  }, [activeMenu]);

  const controlMenuItem = (item) => {
    return (
      checkAuth(item.auth) && (
        <MenuItem item={item} linkClassName="side-nav-link" className={activeMenuItems!.includes(item.key) ? "menuitem-active" : ""} />
      )
    );
  };

  const controlMenuItemWithChildren = (item) => {
    return (
      checkAuth(item.auth) && (
        <MenuItemWithChildren
          item={item}
          toggleMenu={toggleMenu}
          subMenuClassNames="nav-second-level"
          activeMenuItems={activeMenuItems}
          linkClassName="side-nav-link"
          authUser={authUser}
        />
      )
    );
  };

  return (
    <>
      <ul className="side-menu" ref={menuRef} id="side-menu">
        {(menuItems || []).map((item, idx) => {
          return (
            <React.Fragment key={idx}>
              {item.isTitle ? (
                <>
                  <li
                    className={classNames("menu-title", {
                      "mt-2": idx !== 0,
                    })}>
                    {item.label}
                  </li>
                </>
              ) : (
                <>
                  {item.children ? (
                    <>
                      {controlMenuItemWithChildren(item)}
                      {/* {item.auth && getAuth(authUser, item.auth) && (
                        <MenuItemWithChildren
                          item={item}
                          toggleMenu={toggleMenu}
                          subMenuClassNames="nav-second-level"
                          activeMenuItems={activeMenuItems}
                          linkClassName="side-nav-link"
                          authUser={authUser}
                        />
                      )}
                      {!item.auth && (
                        <MenuItemWithChildren
                          item={item}
                          toggleMenu={toggleMenu}
                          subMenuClassNames="nav-second-level"
                          activeMenuItems={activeMenuItems}
                          linkClassName="side-nav-link"
                          authUser={authUser}
                        />
                      )} */}
                    </>
                  ) : (
                    <>
                      {controlMenuItem(item)}
                      {/* {item.auth && getAuth(authUser, item.auth) && (
                        <MenuItem
                          item={item}
                          linkClassName="side-nav-link"
                          className={activeMenuItems!.includes(item.key) ? "menuitem-active" : ""}
                        />
                      )}
                      {!item.auth && (
                        <MenuItem
                          item={item}
                          linkClassName="side-nav-link"
                          className={activeMenuItems!.includes(item.key) ? "menuitem-active" : ""}
                        />
                      )} */}
                    </>
                  )}
                </>
              )}
            </React.Fragment>
          );
        })}
      </ul>
    </>
  );
};

export default AppMenu;
