import { checkAuth } from "asv-hlps-react";
import classNames from "classnames";
import { Nav, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { TabContentType } from "../displays/DisplayTab";

const TabNavChild = ({ paths, variant, justify, bordered = true }: TabContentType) => {
  const navBordered = () => (bordered ? "nav-bordered" : "");

  return (
    <Row className="mx-n3">
      <Nav
        as="ul"
        variant={variant ? variant : "tabs"}
        className={classNames(navBordered(), "mt-n3")}
        // className="nav-bordered mt-n3"
        justify={justify}>
        {(paths || []).map((tab) => {
          return (
            checkAuth(tab.auth) && (
              <Nav.Item as="li" key={tab.id} className={classNames(tab.ms && "ms-auto", "p-0")}>
                {/* <Nav.Link as={Link} to={tab.link} eventKey={tab.id} state={tab.state}> */}
                <Nav.Link
                  as={Link}
                  to={tab.link}
                  eventKey={tab.id}
                  state={{ tabId: (tab?.id as string).substring(0, (tab?.id as string).lastIndexOf("_")), tabChildId: tab.id }}>
                  {/* <span className="d-block d-sm-none">
                <i className={tab.icon}></i>
              </span> */}
                  {/* <span className="d-none d-sm-block text-uppercase fw-bold fs-6">{tab.title}</span> */}
                  <span className=" d-block  d-sm-block text-uppercase fw-bold fs-6">{tab.title}</span>
                </Nav.Link>
              </Nav.Item>
            )
          );
        })}
      </Nav>
    </Row>
  );
};

export default TabNavChild;
