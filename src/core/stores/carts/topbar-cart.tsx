import DisplayTooltip from "asv-hlps-react/lib/cjs/reacts/displays/display-tooltip";
import { Dropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const TopbarCart = ({ count }: { count?: number }) => {
  const navigate = useNavigate();
  const goToCart = () => {
    navigate("/dash/shopcart");
  };
  return (
    <Dropdown>
      <Dropdown.Toggle as="a" onClick={goToCart} className="nav-link arrow-none waves-effect waves-light maximize-icon">
        {/* <Link to={"/dash/cashs/bilans"} state={{ tabId: "cash_bilan" }}> */}
        <DisplayTooltip content={"panier"}>
          <>
            {count > 0 && (
              <>
                <i className="mdi mdi-cart-plus noti-icon text-white"></i>
                <span className="badge bg-danger rounded-circle noti-icon-badge ">{count}</span>
              </>
            )}
            {count <= 0 && (
              <>
                <i className="mdi mdi-cart-outline noti-icon text-white"></i>
                <span className="badge bg-danger rounded-circle noti-icon-badge ">{count}</span>
              </>
            )}
          </>
        </DisplayTooltip>
        {/* </Link> */}
      </Dropdown.Toggle>
    </Dropdown>
  );
};

export default TopbarCart;
