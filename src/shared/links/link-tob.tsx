import { ModalBase } from "asv-hlps-react";
import { useState } from "react";

import BtnClick from "../btns/BtnClick";

type TobType = {
  tob: any;
  title?: any;
  children: any;
  content?: any;
  size?: "lg" | "sm" | "xl";
  link?: string;
  tobProp?;
  icon?: string;
  state?: any;
};

const LinkTob = ({ tob, title, content, size, children, link, tobProp, state, icon = "fas fa-list" }: TobType) => {
  const [modal, setModal] = useState(false);
  return (
    <>
      {link!! ? (
        <BtnClick type="link" tob={tob} path={link} state={state}>
          {tobProp ? tobProp : children}
        </BtnClick>
      ) : (
        <>
          <BtnClick type="click" tob={tob} onClick={() => setModal(true)}>
            {tobProp ? tobProp : children}
          </BtnClick>
          <ModalBase
            icon={icon}
            size={size}
            onCloseModal={() => setModal(false)}
            content={content}
            show={modal}
            title={title}
            footer={false}
          />
        </>
      )}
    </>
  );
};

export default LinkTob;
