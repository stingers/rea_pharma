import CardUserModal from "./card-user-modal";
import { User } from "asv-hlps";
import { ModalBase } from "asv-hlps-react/lib/cjs/reacts/minton/modals";
import { useState } from "react";

import BtnClick from "../../../shared/btns/BtnClick";

type TobType = {
  user: User;
  userProp?: any;
  children?: any;
  link?: boolean;
};

const LinkUserCard = ({ user, userProp, children, link }: TobType) => {
  const [modal, setModal] = useState(false);
  const title = (user: User) => {
    return (
      <span className="fw-bold">
        <i className="fas fa-user me-1"></i>
        {`${user?.ste?.grp?.name} (${user.username}) ${user.grp.code !== "sf" ? user?.ste?.name : user.fullname}`}
      </span>
    );
  };
  return (
    <>
      {link ? (
        <BtnClick type="link" tob={user} path={`/dash/carduser/${user.id}/userstat`} state={"bonbon"}>
          {userProp ? userProp : children}
        </BtnClick>
      ) : (
        <>
          <BtnClick type="click" tob={user} onClick={() => setModal(true)}>
            {userProp ? userProp : children}
          </BtnClick>
          <ModalBase
            size="xl"
            onCloseModal={() => setModal(false)}
            content={<CardUserModal user={user} userId={user.id} />}
            show={modal}
            title={title(user)}
            footer={false}
          />
        </>
      )}
    </>
  );
};

export default LinkUserCard;
