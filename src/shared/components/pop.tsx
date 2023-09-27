import React from "react";
import { OverlayTrigger, Popover } from "react-bootstrap";

type PopoverType = {
  title: any;
  body: any;
  trigger?: "hover" | "click" | "focus";
  placement?: "top" | "right" | "bottom" | "left" | "auto";
  children?;
};

const Pop = ({ title, body, placement = "auto", trigger = "hover", children }: PopoverType) => {
  const popover = (
    <Popover id="popover-basic">
      <Popover.Header as="h3">{title}</Popover.Header>
      <Popover.Body>{body}</Popover.Body>
    </Popover>
  );
  return (
    // <OverlayTrigger trigger="click" placement={placement} overlay={popover}>
    <OverlayTrigger placement={placement} overlay={popover}>
      {children}
    </OverlayTrigger>
  );
};

export default Pop;
