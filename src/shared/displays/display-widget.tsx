import classNames from "classnames";
import React, { ReactNode } from "react";
import { Card, Col, Row } from "react-bootstrap";

export type WidgetType = {
  title: ReactNode | string;
  content: any;
  colMd?: number;
  className?: string;
};

export type WidgetPros = {
  widgets: WidgetType[];
  wrapCard?: boolean;
  className?: string;
  classContent?: string;
};
const getWidgets = (widgets: WidgetType[], className: string = "px-0", classContent = "text-center") => {
  return (
    <Card.Body className={className}>
      <Row>
        {React.Children.toArray(
          widgets.map((widget) => (
            <Col md={widget.colMd}>
              <div className="d-flex align-items-start justify-content-between ">
                <div>
                  {/* <h6 className="text-muted fw-normal my-0 text-truncate text-uppercase" title={widget.title}> */}
                  <h6 className="text-muted fw-normal my-0 text-truncate text-uppercase">{widget.title}</h6>
                  <h4 className={classNames("my-1 fw-bold", classContent)}>{widget.content}</h4>
                </div>
              </div>
            </Col>
          ))
        )}
      </Row>
    </Card.Body>
  );
};

const DisplayWidget = ({ widgets, wrapCard, className }: WidgetPros) => {
  return (
    <>
      {!wrapCard && getWidgets(widgets, className)}
      {wrapCard && <Card className="p-2">{getWidgets(widgets, className)}</Card>}
    </>
  );
};

export default DisplayWidget;
