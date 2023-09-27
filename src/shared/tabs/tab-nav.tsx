import { IPath } from "asv-hlps";
import { checkAuth } from "asv-hlps-react";
import React from "react";
import { Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

import { TabContentType } from "../displays/DisplayTab";

const TabNav = ({ paths, variant, justify, bordered = true }: TabContentType) => {
  // const location = useLocation();

  const itemLink = (tab: IPath) => {
    return (
      <>
        {/* <span className="d-inline-block d-sm-none">
          <i className={tab.icon}></i>
        </span> */}
        {/* <span className="d-none d-sm-inline-block text-uppercase fw-bold fs-6">{tab.title}</span> */}
        <span className=" d-sm-inline-block text-uppercase fw-bold fs-6">{tab.title}</span>
      </>
    );
  };

  const tabNavItem = (tab: IPath) => {
    return (
      <Nav.Item as="li" className={tab.ms && "ms-auto"}>
        {!tab.disabled && (
          <Nav.Link as={Link} to={tab.link} eventKey={tab.id} state={{ tabId: tab.id, ...tab?.state }}>
            {itemLink(tab)}
          </Nav.Link>
        )}
        {tab.disabled && (
          <Nav.Link href="#disabled" disabled>
            {itemLink(tab)}
          </Nav.Link>
        )}
      </Nav.Item>
    );
  };

  return (
    <Nav
      as="ul"
      // onSelect={(selectedKey) => alert(`selected ${selectedKey}`)}
      variant={variant ? variant : "tabs"}
      className={bordered ? "nav-bordered" : ""}
      justify={justify}>
      {React.Children.toArray(
        (paths || []).map((tab) => {
          return <>{checkAuth(tab.auth) && tabNavItem(tab)}</>;
        })
      )}
    </Nav>
  );
};

export default TabNav;
