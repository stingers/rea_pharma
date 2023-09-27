import { VariantType } from "asv-hlps";
import { Button } from "react-bootstrap";

type TobType = {
  yesVariant?: VariantType;
  noVariant?: VariantType;
  yesLabel?;
  size?: "sm" | "lg";
  noLabel?;
  onYes?;
  onNo?;
  hasNo?: boolean;
  type?: "button" | "reset" | "submit";
};
const BtnYesNo = ({
  noVariant = "success",
  yesVariant = "danger",
  onYes,
  onNo,
  yesLabel,
  noLabel,
  hasNo = true,
  size,
  type = "button",
}: TobType) => {
  return (
    <>
      <Button type={type} variant={yesVariant} size={size ? size : "sm"} className="text-uppercase me-1" onClick={onYes}>
        {yesLabel ? yesLabel : "oui"}
      </Button>
      {hasNo && (
        <Button variant={noVariant} size={size ? size : "sm"} className="text-uppercase " onClick={onNo}>
          {noLabel ? noLabel : "non"}
        </Button>
      )}
    </>
  );
};

export default BtnYesNo;
