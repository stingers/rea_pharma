import React from "react";
import { Link } from "react-router-dom";

type TobType = {
  tob;
  onClick?: (tob) => void;
  property?: string | number;
  type?: "link" | "click" | "linkWithState" | string;
  path?: string;
  children?;
  state?;
};

const BtnClick = ({ property, onClick, tob, type = "click", path, state, children }: TobType) => {
  const handleClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    onClick(tob);
  };
  return (
    <>
      {type === "click" && (
        <span className="cursor-pointer" onClick={(e) => handleClick(e)}>
          {property ? property : children}
        </span>
      )}
      {type === "link" && <Link to={path}>{property ? property : children}</Link>}
      {type === "linkWithState" && (
        <Link to={path} state={state ? state : tob}>
          {property ? property : children}
        </Link>
      )}
      {/* {children} */}
    </>
  );
};
export default BtnClick;
