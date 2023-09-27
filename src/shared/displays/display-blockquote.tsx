import LinkTob, { WithModal } from "asv-hlps-react/lib/cjs/reacts/links/link-tob";
import classNames from "classnames";
import { Col } from "react-bootstrap";

import SkSpinner from "../spinkit/sk-spinner";

type TobType = {
  children: any;
  pulse?: boolean;
  pointer?: boolean;
  auth?: boolean;
  link?: string;
  withModal?: WithModal;
  content?: any;
  size?;
  state?;
  colSize?: number;
  loading?: boolean;
  spinner?: boolean;
};

const DisplayBlockquote = ({
  children,
  state,
  content,
  auth = true,
  colSize = 6,
  size,
  link,
  withModal,
  pointer = true,
  pulse = true,
  loading = false,
  spinner = true,
}: TobType) => {
  const blockquote = () => {
    return (
      <Col md={colSize}>
        <blockquote className={classNames("blockquote border-danger shadow", pulse && "position-relative", pointer && "cursor-pointer")}>
          {link || withModal ? (
            <LinkTob link={link} withModal={withModal} tob={undefined} content={content} size={size} state={state}>
              {pulse && <span className="pulse"></span>}
              <div className="mb-1 fw-bold fs-5">{children}</div>
            </LinkTob>
          ) : (
            <>
              {pulse && <span className="pulse"></span>}
              <div className="mb-1 fw-bold fs-5">{children}</div>
            </>
          )}
          {spinner && <SkSpinner loading={loading} />}
        </blockquote>
      </Col>
    );
  };

  return <>{auth && blockquote()}</>;
};

export default DisplayBlockquote;
