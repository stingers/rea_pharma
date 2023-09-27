import { yupResolver } from "@hookform/resolvers/yup";
import { BtnSubmit, FormField, Toastify } from "asv-hlps-react";
import classNames from "classnames";
import { useState } from "react";
import { Col, Dropdown, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import { NotificationItem } from "../../../layouts/Topbar";
import httpService from "../../../services/httpService";
import hlpForm from "../../../shared/forms/hlpForm";

const notificationContainerStyle = {
  maxHeight: "230px",
  display: "none",
};

const notificationShowContainerStyle = {
  maxHeight: "230px",
};

interface NotificationDropdownProps {
  notifications: Array<NotificationItem>;
}

interface NotificationContainerStyle {
  maxHeight?: string;
  display?: string;
}

const AddWish = () => {
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [notificationContentStyle, setNotificationContentStyles] = useState<NotificationContainerStyle>(notificationContainerStyle);

  /*
   * toggle notification-dropdown
   */
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
    setNotificationContentStyles(
      notificationContentStyle === notificationContainerStyle ? notificationShowContainerStyle : notificationContainerStyle
    );
  };

  const schema = yup.object({
    message: hlpForm.yupRequiredString().min(10).max(250),
  });
  type FormType = yup.InferType<typeof schema>;

  const {
    handleSubmit,
    register,
    control,
    formState: { errors, isValid },
    reset,
  } = useForm<FormType>({
    defaultValues: {},
    resolver: yupResolver<any>(schema),
    mode: "onChange",
  });

  const formSubmit = (msg) => {
    httpService
      .create(msg, "wishes/new")
      .then((data) => {
        Toastify.success();
      })
      .catch((error) => {
        Toastify.error();
      });
    reset();
  };

  return (
    <Dropdown show={dropdownOpen} onToggle={toggleDropdown}>
      <Dropdown.Toggle
        id="dropdown-notification"
        as="a"
        onClick={toggleDropdown}
        className={classNames("nav-link", "waves-effect", "waves-light", {
          show: dropdownOpen,
        })}>
        <i className="mdi mdi-lightbulb-on-outline noti-icon"></i>
      </Dropdown.Toggle>
      <Dropdown.Menu className="dropdown-menu-end dropdown-lg">
        {/* <div onClick={toggleDropdown}> */}
        <div>
          <div className="dropdown-item noti-title">
            <h5 className="m-0 text-center fw-bold">Suggestion</h5>
          </div>
          <form onSubmit={handleSubmit(formSubmit)} className="px-2 text-uppercase fs-6">
            <Row>
              <Col className="mb-2">
                <FormField
                  type="textarea"
                  name={"message"}
                  placeholder={"votre suggestion"}
                  control={control}
                  errors={errors}
                  label="message"
                  register={register}
                  noLabel
                />
              </Col>
            </Row>
            <div className="text-end mt-2  ">
              <BtnSubmit size="sm" onCancel={undefined} disabled={!isValid} />
            </div>
          </form>
        </div>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default AddWish;
