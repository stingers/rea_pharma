import { BtnAction, BtnType, DropMenuType, IfBtnType } from "asv-hlps-react";
import { ReactNode } from "react";
import { Col, Row } from "react-bootstrap";

interface DisplayPgTitleType {
  pgTitle: ReactNode;
  dropMenu?: DropMenuType;
  btns?: BtnType[];
  onDrop?: any;
  onBtn?: any;
  tob?: any;
  ifBtn?: IfBtnType;
  elpDrop?: boolean;
  linkBtn?: boolean;
  icon?: string;
}

const DisplayPgTitle = ({ dropMenu, onDrop, onBtn, tob, elpDrop, linkBtn, btns, pgTitle, icon }: DisplayPgTitleType) => {
  return (
    <Row>
      <Col>
        {/* <div className="page-title-box fixed-top position-relative"> */}
        <div className="page-title-box">
          <h4 className="page-title">
            {icon && <i className={icon}></i>}
            {pgTitle}
          </h4>
          <div className="page-title-right">
            {dropMenu && !elpDrop && <BtnAction dropMenu={dropMenu} onDrop={onDrop} tob={tob} />}
            {btns && linkBtn && <BtnAction btns={btns} onBtn={onBtn} ifBtn={"btns"} />}
            {dropMenu && elpDrop && <BtnAction dropMenu={dropMenu} onDrop={onDrop} tob={tob} elpDrop />}
            {/* <Row className="g-2">
            <Col md={"auto"}>{dropMenu && <BtnAction dropMenu={dropMenu} onDrop={onDrop} tob={tob} ifBtn={"btns"} />}</Col>
            </Row> */}
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default DisplayPgTitle;
