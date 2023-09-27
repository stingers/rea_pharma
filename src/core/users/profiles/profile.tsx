import { User } from "asv-hlps";
import { Toastify } from "asv-hlps-react";
import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";

import authService from "../../../auth/services/authService";
import httpService from "../../../services/httpService";
import DisplayPgTitle from "../../../shared/displays/DisplayPgTitle";
import ProfileIndex from "./profile-index";
import ProfileInfo from "./profile-info";

const Profile = () => {
  const getUser: User = authService.authUser();

  const [user, setUser] = useState<User>(null);
  useEffect(() => {
    httpService
      .getByParam(getUser.id, "users")
      .then(({ data }) => {
        setUser(data);
      })
      .catch(() => {
        Toastify.error();
      });
  }, []);

  const onSubmitForm = (data) => {
    setUser(data);
  };

  return (
    <>
      <DisplayPgTitle pgTitle={"Profile"} />
      <Row>
        <Col xl={3} lg={3}>
          {/* User information */}
          <ProfileInfo user={user} onSubmitForm={onSubmitForm} />

          {/* User's skills */}
          {/* <Skills skills={skills} /> */}
        </Col>

        <Col xl={9} lg={9}>
          <ProfileIndex user={user} />
        </Col>
      </Row>
    </>
  );
};

export default Profile;
