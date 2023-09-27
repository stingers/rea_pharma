import { AuthParam } from "asv-hlps";
import classNames from "classnames";
import React from "react";
import { Card } from "react-bootstrap";
import CountUp from "react-countup";

export interface StatisticsWidgetProps {
  icon: string;
  stats: string;
  title: string;
  path?: string;
  auth?: AuthParam;
  trend?: {
    value: string;
    title: string;
    icon: string;
    variant: string;
  };
  counterOptions?: any;
}

const StatisticsWidget = ({ icon, stats, title, trend, counterOptions }: StatisticsWidgetProps) => {
  return (
    <Card>
      <Card.Body>
        <div className="d-flex align-items-start justify-content-between">
          <div>
            <h5 className="text-muted fw-normal mt-0 text-truncate text-capitalize" title={title}>
              {title}
            </h5>
            <h3 className="my-2 ">
              <span>
                {/* <CountUp duration={1} end={stats} {...counterOptions} separator={","} /> */}
                <CountUp duration={1} end={stats} {...counterOptions} />
              </span>
            </h3>
            {trend && (
              <p className="mb-0 text-muted">
                <span className={classNames("me-2", "text-" + trend.variant)}>
                  <span className={trend.icon}></span>
                  {trend.value}
                </span>
                <span className="text-nowrap">{trend.title}</span>
              </p>
            )}
          </div>
          <div className="avatar-sm">
            <span className="avatar-title bg-soft-primary rounded">
              <i className={classNames("font-20", "text-primary", icon)}></i>
            </span>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default StatisticsWidget;
