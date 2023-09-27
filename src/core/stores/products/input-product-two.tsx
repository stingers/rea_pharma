import { Product } from "asv-hlps";
import { Card, Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";

import image4 from "../../../assets/images/companies/airbnb.png";

type TobType = { product: Product };

const InputProductTwo = ({ product }: TobType) => {
  return (
    <Card>
      <Card.Body>
        <div className="d-flex align-items-start">
          <div className="avatar-md me-1">
            <div className="avatar-title bg-light rounded-circle">
              <img src={image4} alt="" className="avatar-sm rounded-circle" />
            </div>
          </div>

          <div className="flex-1">
            <h5 className="my-1">
              <Link to="#" className="text-dark">
                {product.designation}
              </Link>
            </h5>
            <p className="text-muted text-truncate mb-0">{product.ref}</p>
          </div>

          <Dropdown>
            <Dropdown.Toggle as="a" className="cursor-pointer text-body">
              <i className="mdi mdi-dots-vertical font-20"></i>
            </Dropdown.Toggle>
            <Dropdown.Menu align="end">
              <Dropdown.Item>Action</Dropdown.Item>
              <Dropdown.Item>Another action</Dropdown.Item>
              <Dropdown.Item>Something else here</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <hr />
        {/* <div className="text-muted">
          <div className="row">
            <div className="col-6">
              <p className="text-truncate mb-0">Revenue (USD)</p>
              <h5 className="mb-sm-0">{item.revenue}</h5>
            </div>
            <div className="col-6">
              <p className="text-truncate mb-0">Number of employees</p>
              <h5 className="mb-sm-0">{item.noOfEmployees}</h5>
            </div>
          </div>
        </div> */}
      </Card.Body>
    </Card>
  );
};

export default InputProductTwo;
