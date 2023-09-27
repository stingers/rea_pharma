import { OverlayTrigger, Popover } from "react-bootstrap";

type TobType = {
  title?: any;
  content: any;
  children?;
  click?: boolean;
  trigger?;
  placement?: "auto" | "right" | "top" | "left";
};

const DisplayPopover = ({ title, content, children, placement = "auto", trigger = ["hover", "focus"] }: TobType) => {
  const popover = (
    <Popover style={{ maxWidth: 400 }}>
      {title && (
        <Popover.Header as="h4" className="py-1 fw-bold">
          {title}
        </Popover.Header>
      )}
      <Popover.Body>{content}</Popover.Body>
    </Popover>
  );
  const Pop = () => (
    <OverlayTrigger trigger={trigger} placement={placement} overlay={popover}>
      <span>{children}</span>
    </OverlayTrigger>
  );
  return <Pop />;
};

export default DisplayPopover;
