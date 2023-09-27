import { checkAuth } from "asv-hlps-react";
import DisplayTooltip from "asv-hlps-react/lib/cjs/reacts/displays/display-tooltip";
import React from "react";
import { Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";

export interface TobBarDropType {
  icon: string;
  link: string;
  auth?: boolean;
  tooltip: string;
}

type TobType = {
  drops: TobBarDropType[];
};

// const TopBarDropdown = ({ icon, link, tooltip, auth = true }: TobType) => {
const TopBarDropdown = ({ drops }: TobType) => {
  return React.Children.toArray(
    drops.map(
      (drop) =>
        checkAuth(drop.auth) && (
          <li className="dropdown d-none d-lg-inline-block">
            <Dropdown>
              <Dropdown.Toggle
                id="dropdown-languages"
                as="a"
                // onClick={undefined}
                className="nav-link arrow-none waves-effect waves-light maximize-icon">
                <DisplayTooltip content={drop.tooltip}>
                  <Link to={drop.link}>
                    <i className={`${drop.icon} text-white noti-icon`}></i>
                    {/* <i className={"fas fa-wallet text-white noti-icon"}></i> */}
                  </Link>
                </DisplayTooltip>
              </Dropdown.Toggle>
            </Dropdown>
          </li>
        )
    )
  );
};

export default TopBarDropdown;
