import { User } from "asv-hlps";
import { ModalBase } from "asv-hlps-react";
import AdditUser from "./addit-user";
type TobProps = {
  title?: any;
  modal: boolean;
  code?: string;
  closeModal;
  grp?: string;
  tob?: User;
  onSubmitForm;
  onCancelForm;
};

const DplAdditUser = ({ title, modal, code, closeModal, grp, tob, onSubmitForm, onCancelForm }: TobProps) => {
  return (
    <ModalBase
      title={title}
      icon={"fas fa-pen"}
      show={modal}
      onCloseModal={closeModal}
      backdrop={"static"}
      keyboard={false}
      size={"lg"}
      // content={<AdditUser code={code} grp={getGrp(code)} tob={tob} onSubmitForm={handleSubmit} onCancelForm={cancelForm} />}
      content={<AdditUser grp={grp} code={code} tob={tob} onSubmitForm={onSubmitForm} onCancelForm={onCancelForm} />}
    />
  );
};

export default DplAdditUser;
