import classNames from "classnames";
import { Breadcrumb, Col, Row } from "react-bootstrap";

// custom hoook
import { useRedux } from "../hooks";
import { LayoutTypes } from "./constants";

// constants
// import { LayoutTypes } from '../../../../../constants/';

interface BreadcrumbItems {
  label: string;
  path: string;
  active?: boolean;
}

interface PageTitleProps {
  breadCrumbItems: Array<BreadcrumbItems>;
  title: string;
}

/**
 * PageTitle
 */
const PageTitle = (props: PageTitleProps) => {
  const { appSelector } = useRedux();

  const { layoutType } = appSelector((state) => ({
    layoutType: state.Layout.layoutType,
  }));

  return (
    <Row>
      <Col xs={12}>
        <div
          className={classNames("page-title-box", {
            "page-title-box-alt": layoutType === LayoutTypes.LAYOUT_HORIZONTAL || layoutType === LayoutTypes.LAYOUT_DETACHED,
          })}>
          <h4 className="page-title text-capitalize">{props.title}</h4>
          <div className="page-title-right text-capitalize">
            <Breadcrumb listProps={{ className: "m-0" }}>
              <Breadcrumb.Item href="/">Akofa</Breadcrumb.Item>

              {(props["breadCrumbItems"] || []).map((item, index) => {
                return item.active ? (
                  <Breadcrumb.Item active key={index}>
                    {item.label}
                  </Breadcrumb.Item>
                ) : (
                  <Breadcrumb.Item key={index} href={item.path}>
                    {item.label}
                  </Breadcrumb.Item>
                );
              })}
            </Breadcrumb>
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default PageTitle;
