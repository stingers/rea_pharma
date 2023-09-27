import DisplayTooltip from "asv-hlps-react/lib/cjs/reacts/displays/display-tooltip";

const OrderQityPerPackaging = ({ product }) => {
  const onOdrPackaging = () => {};
  return (
    <DisplayTooltip content={"Quantité par carton"}>
      <span className="text-warning">
        {product.stores[0].isAvailable ? (
          <span className="mx-1">
            <i className="fa fa-archive cursor-pointer" onClick={onOdrPackaging}></i>
          </span>
        ) : (
          <span className="mx-1">
            <i className="fa fa-archive"></i>
          </span>
        )}
        : <span> {product.qtityPerPackaging}</span>
      </span>
    </DisplayTooltip>
  );
};

export default OrderQityPerPackaging;
