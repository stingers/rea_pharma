import { Button } from "react-bootstrap";

type TobType = {
  label;
  variant?: "warning" | "purple" | "secondary" | "pink" | "primary" | "success" | "danger" | "info";
  size?: "sm" | "lg";
  onBtn: (tob) => void;
  btnClass?: string;
};

const Btn = ({ label, onBtn, size, variant, btnClass }: TobType) => {
  return (
    <Button
      size={size ? size : "sm"}
      variant={variant ? variant : "info"}
      className={btnClass ? btnClass : "waves-effect waves-light"}
      onClick={onBtn}>
      {label}
    </Button>
  );
};

export default Btn;
