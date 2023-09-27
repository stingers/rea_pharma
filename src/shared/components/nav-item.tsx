import { Nav } from "react-bootstrap";

type TobType = {
  icon?: string;
  eventKey: string;
  title: string;
};

const NavItem = ({ icon, eventKey, title }: TobType) => {
  return (
    <Nav.Item as="li" className="nav-item">
      <Nav.Link href="#" eventKey={eventKey} className="ms-0">
        {icon && <i className={icon}></i>}
        {title}
      </Nav.Link>
    </Nav.Item>
  );
};

export default NavItem;
