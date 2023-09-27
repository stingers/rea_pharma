import React from "react";

type BtnToggleProps = {
  check: boolean;
  onToggle?;
  theme?: "bullhorn" | "userLock" | "thumbs";
};

const BtnToggle: React.FC<BtnToggleProps> = ({ check, onToggle, theme }) => {
  const toggle = () => {
    let icon = "fas fa-";
    switch (theme) {
      case "bullhorn":
        return check ? (icon += "bullhorn text-success") : (icon += "bullhorn text-danger");
      case "userLock":
        return check ? (icon += "user-plus text-success") : (icon += "user-lock text-danger");
      case "thumbs":
        return check ? (icon += "thumbs-up text-success") : (icon += "thumbs-down text-danger");

      default:
        return check ? (icon += "check") : (icon += "times");
    }
  };

  return (
    <span role="button" onClick={onToggle}>
      <i className={toggle()}></i>
    </span>
  );
};

export default BtnToggle;
