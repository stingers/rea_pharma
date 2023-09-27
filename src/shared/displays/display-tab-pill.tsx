import DisplayHeader from "asv-hlps-react/lib/cjs/reacts/displays/display-header";
import { Tab } from "react-bootstrap";
import { Outlet } from "react-router-dom";

const DisPlayTabPill = ({ paths, countLength }) => {
  return (
    <Tab.Container id="left-tabs-example" defaultActiveKey="first">
      <DisplayHeader countLength={countLength} pills={paths} />
      {/* <Row>
        <div className=" d-flex align-items-baseline">
          <div className="">bnoiouiu</div>
          <div className="me-auto">
            <TabNav variant={"pills"} bordered={false} paths={paths} />
             <Nav variant="pills" className="mx-1">
              <Nav.Item className="mx-1">
                <Nav.Link eventKey="first">Tab 1</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="second">Tab 2</Nav.Link>
              </Nav.Item>
            </Nav>
          </div>
          <div>bonjour</div>
        </div>
      </Row> */}
      <Tab.Content>
        <Outlet />
      </Tab.Content>
    </Tab.Container>
  );
};

export default DisPlayTabPill;
