import { Gender } from "asv-hlps";
import classNames from "classnames";

import avatarF from "../../assets/images/genders/face-sq-f_3.svg";
import avatarH from "../../assets/images/genders/face-sq-h_2.svg";

type TobType = {
  gender: Gender;
  className?: string;
  nowrap?: boolean;
};

const UserAvatar = ({ gender, className, nowrap = true }: TobType) => {
  const avatar = (gender) => {
    return gender?.id === 1 ? avatarH : avatarF;
  };

  return (
    <>
      {nowrap ? (
        <div>
          <img
            src={avatar(gender)}
            alt="avatar"
            className={classNames(className ? className : "avatar-sm img-thumbnail rounded-circle me-1")}
          />
        </div>
      ) : (
        <img
          src={avatar(gender)}
          alt="avatar"
          className={classNames(className ? className : "avatar-sm img-thumbnail rounded-circle me-1")}
        />
      )}
    </>
  );
};

export default UserAvatar;
