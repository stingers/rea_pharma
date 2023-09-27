import { BtnAction, BtnType, ModalBase, Toastify } from "asv-hlps-react";
import { useState } from "react";
import { Card, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import authService from "../../../auth/services/authService";
import httpService from "../../../services/httpService";
// images
import UserAvatar from "../../../shared/components/user-avatar";
import ChangePasswd from "../change-passwd";
import DplAdditUser from "../dpl-addit-user";

const ProfileInfo = ({ user, onSubmitForm }) => {
  const navigate = useNavigate();
  const [modal, setModal] = useState(false);
  const [modalPasswd, setModalPasswd] = useState(false);
  const handleSubmitForm = (values) => {
    setModal(false);
    httpService
      .putBody(user.id, values, "users/registers")
      .then(({ data }) => {
        onSubmitForm(data);
        setModal(false);
        Toastify.success();
      })
      .catch(() => {
        Toastify.error();
      });
  };

  const handleChangePassword = () => {
    authService.logout();
    navigate("/");
    Toastify.success("Veuillez vous reconnecter sur votre interface");
  };

  const drops: BtnType[] = [
    {
      id: 1,
      label: "modifier le profile",
    },
    { id: 2, label: "changer votre password" },
  ];

  const onDrop = (id: number) => {
    switch (id) {
      case 1:
        setModal(true);
        break;
      case 2:
        setModalPasswd(true);
        break;
    }
  };

  return (
    <>
      <Card className="text-center">
        <Card.Body>
          <UserAvatar gender={user?.gender} className="rounded-circle avatar-xl img-thumbnail" nowrap={false} />

          <h4 className="mt-3 mb-0">{user?.fullname}</h4>
          <p className="text-muted text-uppercase">{`${user?.role.name}`}</p>

          <BtnAction dropMenu={{ drops: drops, icon: "fas fa-cog", label: "modifier" }} onDrop={onDrop} />
          <div className="text-start mt-3">
            <Table borderless size="sm" responsive>
              <tbody>
                <tr>
                  <th scope="row">Nom :</th>
                  <td className="text-muted">{user?.fullname}</td>
                </tr>
                <tr>
                  <th scope="row">Mobile :</th>
                  <td className="text-muted">{`${user?.phoneP}`}</td>
                </tr>
                <tr>
                  <th scope="row">Email :</th>
                  <td className="text-muted">{user?.email}</td>
                </tr>
                <tr>
                  <th scope="row">Location :</th>
                  <td className="text-muted">{user?.city?.region?.name + "," + user?.city?.name}</td>
                </tr>
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>
      <DplAdditUser
        tob={user}
        title={"vos infos"}
        modal={modal}
        closeModal={() => setModal(false)}
        onSubmitForm={handleSubmitForm}
        onCancelForm={() => setModal(false)}
      />
      <ModalBase
        onCloseModal={() => setModalPasswd(false)}
        show={modalPasswd}
        title={"changer votre mon de passe"}
        icon="fas fa-pen"
        content={<ChangePasswd tob={user} onSubmitForm={handleChangePassword} onCancelForm={() => setModalPasswd(false)} />}
      />
    </>
  );
};

export default ProfileInfo;
