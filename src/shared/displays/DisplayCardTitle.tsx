import { BtnAction, BtnType, DropMenuType, IfBtnType } from "asv-hlps-react";

interface DisplayCardTitleType {
  title: string;
  subTitle?: any;
  dropMenu?: DropMenuType;
  btns?: BtnType[];
  onDrop?: any;
  onBtn?: any;
  tob?: any;
  elpDrop?: boolean;
  linkBtn?: boolean;
  ifBtn?: IfBtnType;
  icon?: string;
}

const DisplayCardTitle = ({ dropMenu, onDrop, onBtn, tob, elpDrop, linkBtn, btns, title, subTitle }: DisplayCardTitleType) => {
  return (
    <>
      <BtnAction linkBtn btns={btns} dropMenu={dropMenu} onBtn={onBtn} onDrop={onDrop} />
      {/* <Row> */}
      <h5 className="header-title">{title}</h5>
      {subTitle && <p className="sub-header" dangerouslySetInnerHTML={{ __html: subTitle }}></p>}
    </>
  );
};

export default DisplayCardTitle;
